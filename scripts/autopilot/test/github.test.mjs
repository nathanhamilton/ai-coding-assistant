import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { createClient } from '../lib/github.mjs';

let calls;
let responses;
const realFetch = globalThis.fetch;

beforeEach(() => {
  calls = [];
  responses = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, ...init });
    const r = responses.shift();
    return {
      status: r.status ?? 200,
      ok: (r.status ?? 200) < 400,
      headers: { get: (h) => (h === 'link' ? r.link ?? null : null) },
      text: async () => (r.body === undefined ? '' : JSON.stringify(r.body)),
    };
  };
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

// Set env vars for the duration of fn, restoring each key afterwards. (Never
// reassign process.env itself: that detaches it from what child processes see.)
async function withEnv(vars, fn) {
  const before = Object.fromEntries(Object.keys(vars).map((k) => [k, process.env[k]]));
  for (const [k, v] of Object.entries(vars)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  try {
    return await fn();
  } finally {
    for (const [k, v] of Object.entries(before)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
}

const client = () => createClient({ token: 't0k', repo: 'o/r', apiUrl: 'https://api.test' });

test('substitutes {repo}, sends auth and API version headers', async () => {
  responses.push({ body: { id: 1 } });
  const data = await client().get('/repos/{repo}/issues/1');
  assert.deepEqual(data, { id: 1 });
  assert.equal(calls[0].url, 'https://api.test/repos/o/r/issues/1');
  assert.equal(calls[0].method, 'GET');
  assert.equal(calls[0].headers.authorization, 'Bearer t0k');
  assert.equal(calls[0].headers['x-github-api-version'], '2022-11-28');
  assert.equal(calls[0].body, undefined);
});

test('write methods send JSON bodies; 204 resolves to null', async () => {
  responses.push({ status: 201, body: { number: 9 } }, { status: 204 }, { body: { ok: true } }, { status: 204 });
  const gh = client();
  assert.deepEqual(await gh.post('/repos/{repo}/issues', { title: 'x' }), { number: 9 });
  assert.equal(calls[0].headers['content-type'], 'application/json');
  assert.equal(calls[0].body, '{"title":"x"}');
  assert.equal(await gh.put('/repos/{repo}/x', {}), null);
  assert.deepEqual(await gh.patch('/repos/{repo}/y', { a: 1 }), { ok: true });
  assert.equal(await gh.del('/repos/{repo}/z'), null);
  assert.deepEqual(calls.map((c) => c.method), ['POST', 'PUT', 'PATCH', 'DELETE']);
});

test('errors carry the status and GitHub message', async () => {
  responses.push({ status: 404, body: { message: 'Not Found' } });
  await assert.rejects(client().get('/repos/{repo}/nope'), (e) => e.status === 404 && /404: Not Found/.test(e.message));
  responses.push({ status: 500 });
  await assert.rejects(client().get('/repos/{repo}/boom'), (e) => e.status === 500);
});

test('paginate follows rel="next" and respects max', async () => {
  responses.push(
    { body: [1, 2], link: '<https://api.test/page2>; rel="next", <https://api.test/last>; rel="last"' },
    { body: [3, 4], link: '<https://api.test/page3>; rel="next"' },
  );
  const items = await client().paginate('/repos/{repo}/issues?state=all', { max: 3 });
  assert.deepEqual(items, [1, 2, 3]);
  assert.equal(calls[0].url, 'https://api.test/repos/o/r/issues?state=all&per_page=100');
  assert.equal(calls[1].url, 'https://api.test/page2');
  assert.equal(calls.length, 2, 'stops once max is reached');

  responses.push({ body: [5] });
  assert.deepEqual(await client().paginate('/repos/{repo}/labels'), [5]);
  assert.equal(calls[2].url, 'https://api.test/repos/o/r/labels?per_page=100');
});

test('falls back to environment for token, repo, and API URL', async () => {
  await withEnv({ GH_TOKEN: 'envtok', GITHUB_REPOSITORY: 'e/r', GITHUB_API_URL: 'https://ghe.test/api/v3' }, async () => {
    responses.push({ body: {} });
    const gh = createClient();
    assert.equal(gh.repo, 'e/r');
    await gh.get('/repos/{repo}');
    assert.equal(calls[0].url, 'https://ghe.test/api/v3/repos/e/r');
    assert.equal(calls[0].headers.authorization, 'Bearer envtok');
  });
});

test('falls back to the gh CLI, and tolerates it being unavailable', async () => {
  const { mkdtempSync, writeFileSync, chmodSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const bin = mkdtempSync(join(tmpdir(), 'fake-gh-'));
  writeFileSync(join(bin, 'gh'), '#!/bin/sh\nif [ "$1" = auth ]; then echo clitoken; else echo cli/repo; fi\n');
  chmodSync(join(bin, 'gh'), 0o755);
  const unset = { GH_TOKEN: undefined, GITHUB_TOKEN: undefined, GITHUB_REPOSITORY: undefined, GITHUB_API_URL: undefined };
  await withEnv({ ...unset, PATH: bin }, async () => {
    const gh = createClient();
    assert.equal(gh.repo, 'cli/repo');
    responses.push({ body: {} });
    await gh.get('/x');
    assert.equal(calls[0].url, 'https://api.github.com/x');
    assert.equal(calls[0].headers.authorization, 'Bearer clitoken');
  });
  await withEnv({ ...unset, PATH: mkdtempSync(join(tmpdir(), 'no-gh-')) }, async () => {
    assert.throws(() => createClient(), /No GitHub token/);
  });
});

test('requires a token and a repository', () => {
  assert.throws(() => createClient({ token: '', repo: 'o/r' }), /No GitHub token/);
  assert.throws(() => createClient({ token: 't', repo: '' }), /No repository/);
});
