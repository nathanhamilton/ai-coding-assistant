// Fetches everything the dashboard needs from GitHub and builds the view model.
// Kept out of the protected CLI so dashboard improvements don't need the owner.

import { buildViewModel } from './dashboard-data.mjs';
import { MARKER, parseGateRecord } from './gate.mjs';
import { LABELS, labelNames } from './tasks.mjs';

export const LEARNING_PATHS = [
  '.autopilot/learned',
  'ai-project-assist/projects/_knowledge-base.md',
  'ai-project-assist/standards.md',
];

export async function collectDashboardData(gh, config, { now = new Date() } = {}) {
  const [issues, pulls] = await Promise.all([
    gh.paginate('/repos/{repo}/issues?state=all&sort=updated', { max: 500 }),
    gh.paginate('/repos/{repo}/pulls?state=all&sort=updated&direction=desc', { max: 200 }),
  ]);

  const gateRecords = {};
  for (const p of pulls.filter((p) => labelNames(p).includes(LABELS.pr))) {
    const comments = await gh.paginate(`/repos/{repo}/issues/${p.number}/comments`);
    gateRecords[p.number] = comments
      .filter((c) => c.body?.includes(MARKER))
      .map((c) => parseGateRecord(c.body))
      .filter(Boolean);
  }

  const learningCommits = [];
  for (const path of LEARNING_PATHS) {
    const commits = await gh.get(`/repos/{repo}/commits?path=${encodeURIComponent(path)}&per_page=10`).catch(() => []);
    for (const c of commits ?? []) {
      if (learningCommits.some((x) => x.sha === c.sha.slice(0, 7))) continue;
      learningCommits.push({
        sha: c.sha.slice(0, 7),
        message: c.commit.message.split('\n')[0],
        date: c.commit.author.date,
        url: c.html_url,
      });
    }
  }
  learningCommits.sort((a, b) => b.date.localeCompare(a.date));

  return buildViewModel({
    repo: gh.repo,
    issues: issues.filter((i) => !i.pull_request),
    pulls,
    gateRecords,
    learningCommits: learningCommits.slice(0, 15),
    maxAttempts: config.maxFixAttempts,
    now,
  });
}
