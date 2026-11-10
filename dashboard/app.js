// Autopilot dashboard — renders data.json (built by `cli.mjs dashboard`).
(function () {
  'use strict';

  var STAGES = {
    queued: { label: 'Queued', tone: '' },
    building: { label: 'Building', tone: 'active' },
    'in-review': { label: 'In review', tone: 'active' },
    'needs-human': { label: 'Needs you', tone: 'critical' },
    done: { label: 'Done', tone: 'good' },
    gating: { label: 'Gate running', tone: 'active' },
    fixing: { label: 'Fixing', tone: 'warning' },
    merging: { label: 'Merging', tone: 'good' },
    'awaiting-owner': { label: 'Awaiting your approval', tone: 'serious' },
    'awaiting-approval': { label: 'Awaiting approval', tone: 'serious' },
    planning: { label: 'Planning', tone: 'active' },
    complete: { label: 'Complete', tone: 'good' },
  };
  var NEEDS = {
    'approve-contract': 'Approve contract',
    'approve-merge': 'Approve risky merge',
    unblock: 'Unblock',
  };

  var $ = function (id) { return document.getElementById(id); };

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') node.textContent = attrs[k];
      else if (k === 'class') node.className = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function pill(stage) {
    var s = STAGES[stage] || { label: stage, tone: '' };
    return el('span', { class: 'pill' + (s.tone ? ' pill--' + s.tone : ''), text: s.label });
  }

  function link(url, text) {
    return el('a', { href: url, target: '_blank', rel: 'noopener', text: text });
  }

  function ago(iso) {
    if (!iso) return '';
    var s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 90) return 'just now';
    if (s < 5400) return Math.round(s / 60) + 'm ago';
    if (s < 129600) return Math.round(s / 3600) + 'h ago';
    return Math.round(s / 86400) + 'd ago';
  }

  function fmtPct(v) { return v == null ? '—' : v + '%'; }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); return node; }

  // ---------------------------------------------------------------- sections

  function renderHeader(d) {
    var a = $('repo-link');
    a.textContent = d.repo;
    a.href = 'https://github.com/' + d.repo;
    $('generated').textContent = d.demo ? 'demo data — sample project' : 'updated ' + ago(d.generatedAt);
    $('generated').title = new Date(d.generatedAt).toLocaleString();
  }

  function renderNeeds(d) {
    var list = clear($('needs'));
    $('needs-count').textContent = d.needsYou.length;
    $('needs-panel').classList.toggle('is-clear', d.needsYou.length === 0);
    if (!d.needsYou.length) {
      list.appendChild(el('li', {}, [el('p', { class: 'empty', text: '✓ Nothing needs you. Autopilot is handling everything in flight.' })]));
      return;
    }
    d.needsYou.forEach(function (n) {
      list.appendChild(el('li', {}, [
        el('span', { class: 'needs__kind', text: NEEDS[n.kind] || n.kind }),
        el('span', {}, [
          link(n.url, '#' + n.number + ' ' + n.title),
          el('span', { class: 'needs__reason', text: ' — ' + n.reason }),
        ]),
      ]));
    });
  }

  function renderTiles(d) {
    var s = d.summary;
    var tiles = [
      ['Active contracts', s.contractsActive, ''],
      ['Tasks done', s.tasksDone, 'of ' + s.tasksTotal],
      ['PRs in flight', s.prsOpen, ''],
      ['Merged · 7 days', s.mergedLast7d, ''],
      ['First-pass gate rate', fmtPct(s.firstPassRate), s.avgGateRuns != null ? s.avgGateRuns + ' gate runs / PR' : ''],
      ['Coverage', fmtPct(s.latestCoverage), 'at last merge'],
    ];
    var root = clear($('tiles'));
    tiles.forEach(function (t) {
      root.appendChild(el('div', { class: 'tile' }, [
        el('div', { class: 'tile__label', text: t[0] }),
        el('div', { class: 'tile__value', text: String(t[1]) }),
        el('div', { class: 'tile__sub', text: t[2] || ' ' }),
      ]));
    });
  }

  function renderContracts(d) {
    var root = clear($('contracts'));
    if (!d.contracts.length) {
      root.appendChild(el('li', {}, [el('p', { class: 'empty', text: 'No contracts yet. Start one with /project in Claude Code.' })]));
      return;
    }
    d.contracts.slice(0, 8).forEach(function (c) {
      var pct = c.progress.total ? Math.round((c.progress.done / c.progress.total) * 100) : 0;
      var fill = el('div', { class: 'bar__fill' });
      fill.style.width = (c.state === 'complete' ? 100 : pct) + '%';
      root.appendChild(el('li', {}, [
        el('div', { class: 'contract__row' }, [
          el('span', { class: 'contract__title' }, [link(c.url, '#' + c.number + ' ' + c.title)]),
          pill(c.state),
        ]),
        el('div', { class: 'bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(pct), 'aria-label': 'Contract #' + c.number + ' progress' }, [fill]),
        el('div', { class: 'contract__pct', text: c.progress.done + ' / ' + c.progress.total + ' tasks merged' }),
      ]));
    });
  }

  function renderBoard(d) {
    var root = clear($('board'));
    ['queued', 'building', 'in-review', 'needs-human', 'done'].forEach(function (key) {
      var items = d.board[key] || [];
      var col = el('div', { class: 'col' }, [
        el('div', { class: 'col__head' }, [pill(key), el('span', { class: 'col__count', text: String(items.length) })]),
      ]);
      if (!items.length) col.appendChild(el('p', { class: 'empty', text: '—' }));
      items.forEach(function (t) {
        var meta = t.dependsOn && t.dependsOn.length && key === 'queued'
          ? 'waits on ' + t.dependsOn.map(function (n) { return '#' + n; }).join(', ')
          : (t.contract ? 'contract #' + t.contract : '');
        col.appendChild(el('a', { class: 'card', href: t.url, target: '_blank', rel: 'noopener' }, [
          el('span', { class: 'card__num', text: '#' + t.number + ' ' }),
          t.title,
          meta ? el('div', { class: 'card__meta', text: meta }) : null,
        ]));
      });
      root.appendChild(col);
    });
  }

  function renderPipeline(d) {
    var t = clear($('pipeline'));
    if (!d.pipeline.length) {
      t.appendChild(el('tbody', {}, [el('tr', {}, [el('td', {}, [el('p', { class: 'empty', text: 'No pull requests in flight.' })])])]));
      return;
    }
    t.appendChild(el('thead', {}, [el('tr', {}, ['Pull request', 'Stage', 'Attempt', 'Risk', 'Changed-line cov.', 'Reviewers', 'Updated'].map(function (h, i) {
      return el('th', { class: i === 2 || i === 4 ? 'num' : '', scope: 'col', text: h });
    }))]));
    var body = el('tbody');
    d.pipeline.forEach(function (p) {
      var g = p.gate || {};
      var names = g.reviewers ? Object.keys(g.reviewers) : [];
      var objecting = names.filter(function (r) { return g.reviewers[r] !== 'approve'; });
      var reviewers = !names.length ? '—'
        : (names.length - objecting.length) + '/' + names.length + ' approve' + (objecting.length ? ' · ✗ ' + objecting.join(', ') : ' ✓');
      body.appendChild(el('tr', {}, [
        el('td', { class: 'title-cell' }, [link(p.url, '#' + p.number + ' ' + p.title)]),
        el('td', {}, [pill(p.stage)]),
        el('td', { class: 'num', text: p.attempt + ' / ' + (d.maxAttempts || 3) }),
        el('td', { text: p.risk || '—' }),
        el('td', { class: 'num', text: fmtPct(g.changedCoverage) }),
        el('td', { text: reviewers }),
        el('td', { text: ago(p.updatedAt) }),
      ]));
    });
    t.appendChild(body);
  }

  function renderMerged(d) {
    var t = clear($('merged'));
    if (!d.merged.length) {
      t.appendChild(el('tbody', {}, [el('tr', {}, [el('td', {}, [el('p', { class: 'empty', text: 'Nothing merged by Autopilot yet.' })])])]));
      return;
    }
    t.appendChild(el('thead', {}, [el('tr', {}, ['Pull request', 'Gate runs', 'Changed cov.', 'Merged'].map(function (h, i) {
      return el('th', { class: i === 1 || i === 2 ? 'num' : '', scope: 'col', text: h });
    }))]));
    var body = el('tbody');
    d.merged.slice(0, 10).forEach(function (m) {
      body.appendChild(el('tr', {}, [
        el('td', {}, [link(m.url, '#' + m.number + ' ' + m.title)]),
        el('td', { class: 'num', text: m.gateRuns + (m.firstPass ? ' ✓' : '') }),
        el('td', { class: 'num', text: fmtPct(m.changedCoverage) }),
        el('td', { text: ago(m.mergedAt) }),
      ]));
    });
    t.appendChild(body);
  }

  function renderLearning(d) {
    var root = clear($('learning'));
    if (!d.learning.length) {
      root.appendChild(el('li', {}, [el('p', { class: 'empty', text: 'No lessons recorded yet. The retro agent runs weekly and after each contract.' })]));
      return;
    }
    d.learning.slice(0, 10).forEach(function (c) {
      root.appendChild(el('li', {}, [
        el('time', { datetime: c.date, text: new Date(c.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }),
        link(c.url, c.message),
        ' ',
        el('code', { text: c.sha }),
      ]));
    });
  }

  // ------------------------------------------------------------ trend chart

  function renderTrend(d) {
    var root = clear($('trend'));
    var pts = d.coverageTrend;
    renderTrendTable(pts);
    if (pts.length < 2) {
      root.appendChild(el('p', { class: 'empty', text: pts.length ? 'Coverage ' + pts[0].overall + '% after the first merge. The trend appears after the second.' : 'Coverage trend appears after Autopilot merges its first PRs.' }));
      return;
    }
    var W = root.clientWidth || 500, H = root.clientHeight || 200;
    var m = { t: 12, r: 44, b: 24, l: 34 };
    var vals = pts.map(function (p) { return p.overall; });
    var lo = Math.max(0, Math.floor((Math.min.apply(null, vals) - 5) / 5) * 5);
    var hi = Math.min(100, Math.ceil((Math.max.apply(null, vals) + 2) / 5) * 5);
    if (hi - lo < 10) lo = Math.max(0, hi - 10);
    var x = function (i) { return m.l + (i / (pts.length - 1)) * (W - m.l - m.r); };
    var y = function (v) { return m.t + (1 - (v - lo) / (hi - lo)) * (H - m.t - m.b); };
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Overall coverage across ' + pts.length + ' merges, from ' + vals[0] + '% to ' + vals[vals.length - 1] + '%');
    function add(tag, attrs) {
      var n = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
      svg.appendChild(n);
      return n;
    }
    var ticks = [lo, Math.round((lo + hi) / 2), hi];
    ticks.forEach(function (v) {
      add('line', { class: 'gridline', x1: m.l, x2: W - m.r, y1: y(v), y2: y(v) });
      add('text', { class: 'axis-label', x: m.l - 6, y: y(v) + 4, 'text-anchor': 'end' }).textContent = v + '%';
    });
    var first = new Date(pts[0].at), last = new Date(pts[pts.length - 1].at);
    var fmt = function (dt) { return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); };
    add('text', { class: 'axis-label', x: m.l, y: H - 6 }).textContent = fmt(first);
    add('text', { class: 'axis-label', x: W - m.r, y: H - 6, 'text-anchor': 'end' }).textContent = fmt(last);
    var path = pts.map(function (p, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ',' + y(p.overall).toFixed(1); }).join('');
    add('path', { class: 'area', d: path + 'L' + x(pts.length - 1) + ',' + y(lo) + 'L' + x(0) + ',' + y(lo) + 'Z' });
    add('path', { class: 'line', d: path });
    var lastPt = pts[pts.length - 1];
    add('circle', { class: 'dot', cx: x(pts.length - 1), cy: y(lastPt.overall), r: 4 });
    add('text', { class: 'end-label', x: x(pts.length - 1) + 8, y: y(lastPt.overall) + 4 }).textContent = lastPt.overall + '%';

    var cross = add('line', { class: 'crosshair', y1: m.t, y2: H - m.b, visibility: 'hidden' });
    var hoverDot = add('circle', { class: 'dot', r: 5, visibility: 'hidden' });
    var hit = add('rect', { x: m.l, y: 0, width: W - m.l - m.r, height: H, fill: 'transparent' });
    var tip = $('tooltip');
    function show(evt) {
      var rect = svg.getBoundingClientRect();
      var px = ((evt.clientX - rect.left) / rect.width) * W;
      var i = Math.max(0, Math.min(pts.length - 1, Math.round(((px - m.l) / (W - m.l - m.r)) * (pts.length - 1))));
      var p = pts[i];
      cross.setAttribute('x1', x(i)); cross.setAttribute('x2', x(i)); cross.setAttribute('visibility', 'visible');
      hoverDot.setAttribute('cx', x(i)); hoverDot.setAttribute('cy', y(p.overall)); hoverDot.setAttribute('visibility', 'visible');
      tip.innerHTML = '';
      tip.appendChild(el('div', {}, [el('strong', { text: p.overall + '%' }), ' overall coverage']));
      tip.appendChild(el('div', { text: 'after PR #' + p.number + ' · ' + new Date(p.at).toLocaleDateString() }));
      tip.hidden = false;
      tip.style.left = Math.min(window.innerWidth - 270, evt.clientX + 12) + 'px';
      tip.style.top = evt.clientY + 12 + 'px';
    }
    function hide() {
      cross.setAttribute('visibility', 'hidden');
      hoverDot.setAttribute('visibility', 'hidden');
      tip.hidden = true;
    }
    hit.addEventListener('mousemove', show);
    hit.addEventListener('mouseleave', hide);
    root.appendChild(svg);
  }

  function renderTrendTable(pts) {
    var host = clear($('trend-table'));
    var t = el('table', { class: 'table' }, [
      el('thead', {}, [el('tr', {}, [el('th', { scope: 'col', text: 'Merged PR' }), el('th', { scope: 'col', text: 'Date' }), el('th', { scope: 'col', class: 'num', text: 'Overall coverage' })])]),
    ]);
    var body = el('tbody');
    pts.slice().reverse().forEach(function (p) {
      body.appendChild(el('tr', {}, [
        el('td', { text: '#' + p.number }),
        el('td', { text: new Date(p.at).toLocaleDateString() }),
        el('td', { class: 'num', text: p.overall + '%' }),
      ]));
    });
    t.appendChild(body);
    host.appendChild(el('div', { class: 'table-scroll' }, [t]));
  }

  // ------------------------------------------------------------------ boot

  var data = null;

  function renderAll() {
    renderHeader(data);
    renderNeeds(data);
    renderTiles(data);
    renderContracts(data);
    renderTrend(data);
    renderBoard(data);
    renderPipeline(data);
    renderMerged(data);
    renderLearning(data);
  }

  function load() {
    return fetch('data.json?ts=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) { data = d; renderAll(); })
      .catch(function (e) {
        clear($('needs')).appendChild(el('li', {}, [el('p', { class: 'empty', text: 'Could not load data.json (' + e.message + ').' })]));
      });
  }

  $('refresh').addEventListener('click', load);
  $('trend-table-toggle').addEventListener('click', function () {
    var host = $('trend-table');
    host.hidden = !host.hidden;
    this.setAttribute('aria-expanded', String(!host.hidden));
    this.textContent = host.hidden ? 'Show table' : 'Hide table';
  });
  $('theme-toggle').addEventListener('click', function () {
    var root = document.documentElement;
    var dark = root.getAttribute('data-theme') === 'dark' ||
      (!root.hasAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.setAttribute('data-theme', dark ? 'light' : 'dark');
    try { localStorage.setItem('autopilot-theme', root.getAttribute('data-theme')); } catch (e) { /* storage unavailable */ }
  });
  try {
    var saved = localStorage.getItem('autopilot-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  } catch (e) { /* storage unavailable */ }
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { if (data) renderTrend(data); }, 150);
  });
  setInterval(load, 5 * 60 * 1000);
  load();
})();
