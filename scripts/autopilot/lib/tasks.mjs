// Task model and scheduling. Tasks are GitHub issues labelled `autopilot:task`;
// their state lives in labels so it is visible and editable in GitHub itself.

export const LABELS = {
  contract: 'autopilot:contract',
  approved: 'autopilot:approved',
  task: 'autopilot:task',
  queued: 'autopilot:queued',
  building: 'autopilot:building',
  review: 'autopilot:in-review',
  needsHuman: 'autopilot:needs-human',
  awaitingOwner: 'autopilot:awaiting-owner',
  pr: 'autopilot',
  attemptPrefix: 'autopilot:attempt-',
};

const DEPENDS_RE = /^\s*\*{0,2}depends on:?\*{0,2}:?\s*(.+)$/im;
const CONTRACT_RE = /^\s*\*{0,2}contract:?\*{0,2}:?\s*#(\d+)/im;

export function parseDependencies(body) {
  const m = DEPENDS_RE.exec(body ?? '');
  if (!m || /none/i.test(m[1])) return [];
  return [...m[1].matchAll(/#(\d+)/g)].map((x) => Number(x[1]));
}

export function parseContractRef(body) {
  const m = CONTRACT_RE.exec(body ?? '');
  return m ? Number(m[1]) : null;
}

export function labelNames(issue) {
  return (issue.labels ?? []).map((l) => (typeof l === 'string' ? l : l.name));
}

export function taskState(issue) {
  const labels = labelNames(issue);
  if (issue.state === 'closed') return 'done';
  if (labels.includes(LABELS.needsHuman)) return 'needs-human';
  if (labels.includes(LABELS.review)) return 'in-review';
  if (labels.includes(LABELS.building)) return 'building';
  if (labels.includes(LABELS.queued)) return 'queued';
  return 'unscheduled';
}

export function attemptFromLabels(labels) {
  const nums = labels
    .filter((l) => l.startsWith(LABELS.attemptPrefix))
    .map((l) => Number(l.slice(LABELS.attemptPrefix.length)))
    .filter(Number.isFinite);
  return nums.length ? Math.max(...nums) : 1;
}

// Picks which queued tasks may start now.
// A task is ready when every dependency is closed. Active work (building or in
// review) counts against the concurrency limit. Lower issue numbers go first so
// the planner's ordering is respected.
export function selectReadyTasks(issues, { maxConcurrent }) {
  const byNumber = new Map(issues.map((i) => [i.number, i]));
  const active = issues.filter((i) => ['building', 'in-review'].includes(taskState(i))).length;
  const slots = Math.max(0, maxConcurrent - active);
  if (slots === 0) return { ready: [], blocked: [], active, slots };

  const ready = [];
  const blocked = [];
  for (const issue of issues.filter((i) => taskState(i) === 'queued').sort((a, b) => a.number - b.number)) {
    const deps = parseDependencies(issue.body);
    const open = deps.filter((d) => {
      const dep = byNumber.get(d);
      // Unknown dependency (e.g. not fetched) is treated as still open: fail safe.
      return !dep || dep.state !== 'closed';
    });
    if (open.length) blocked.push({ number: issue.number, waitingOn: open });
    else if (ready.length < slots) ready.push(issue.number);
  }
  return { ready, blocked, active, slots };
}

// Detects dependency cycles in a planned task list (planner output, indexed by
// local id) so a bad plan is rejected before any issues are created.
export function findCycle(tasks) {
  const graph = new Map(tasks.map((t) => [t.id, t.dependsOn ?? []]));
  const state = new Map();
  const stack = [];
  const visit = (id) => {
    if (state.get(id) === 'done') return null;
    if (state.get(id) === 'visiting') return [...stack.slice(stack.indexOf(id)), id];
    state.set(id, 'visiting');
    stack.push(id);
    for (const dep of graph.get(id) ?? []) {
      if (!graph.has(dep)) continue;
      const cycle = visit(dep);
      if (cycle) return cycle;
    }
    stack.pop();
    state.set(id, 'done');
    return null;
  };
  for (const t of tasks) {
    const cycle = visit(t.id);
    if (cycle) return cycle;
  }
  return null;
}

// Orders planned tasks so dependencies are created first (their issue numbers
// are then known when writing "Depends on" lines).
export function topoSort(tasks) {
  const cycle = findCycle(tasks);
  if (cycle) throw new Error(`Plan has a dependency cycle: ${cycle.join(' -> ')}`);
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const out = [];
  const seen = new Set();
  const visit = (t) => {
    if (seen.has(t.id)) return;
    seen.add(t.id);
    for (const dep of t.dependsOn ?? []) {
      if (!byId.has(dep)) throw new Error(`Task "${t.id}" depends on unknown task "${dep}"`);
      visit(byId.get(dep));
    }
    out.push(t);
  };
  tasks.forEach(visit);
  return out;
}

export function renderTaskBody(task, { contractNumber, issueNumbersById }) {
  const deps = (task.dependsOn ?? []).map((id) => `#${issueNumbersById.get(id)}`);
  return [
    `**Contract:** #${contractNumber}`,
    `**Depends on:** ${deps.length ? deps.join(', ') : 'none'}`,
    `**Size:** ${task.size ?? 'm'}`,
    '',
    '## Goal',
    task.goal,
    '',
    '## Acceptance criteria',
    ...task.acceptanceCriteria.map((c) => `- [ ] ${c}`),
    '',
    '## Implementation notes',
    task.notes || '_Builder decides._',
    '',
    `<!-- autopilot-task ${JSON.stringify({ id: task.id, contract: contractNumber })} -->`,
  ].join('\n');
}
