// Tiny GitHub REST client (fetch-based, no dependencies).

import { execFileSync } from 'node:child_process';

export function createClient({ token, repo, apiUrl } = {}) {
  token ??= process.env.GH_TOKEN || process.env.GITHUB_TOKEN || ghCliToken();
  repo ??= process.env.GITHUB_REPOSITORY || ghCliRepo();
  apiUrl ??= process.env.GITHUB_API_URL || 'https://api.github.com';
  if (!token) throw new Error('No GitHub token: set GH_TOKEN or run `gh auth login`.');
  if (!repo) throw new Error('No repository: set GITHUB_REPOSITORY (owner/name).');

  async function request(method, path, body) {
    const url = path.startsWith('http') ? path : `${apiUrl}${path.replace('{repo}', repo)}`;
    const res = await fetch(url, {
      method,
      headers: {
        authorization: `Bearer ${token}`,
        accept: 'application/vnd.github+json',
        'x-github-api-version': '2022-11-28',
        ...(body ? { 'content-type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 204) return null;
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
      const err = new Error(`${method} ${path} -> ${res.status}: ${data?.message ?? text}`);
      err.status = res.status;
      throw err;
    }
    return { data, link: res.headers.get('link') };
  }

  async function paginate(path, { max = 1000 } = {}) {
    const out = [];
    let next = path + (path.includes('?') ? '&' : '?') + 'per_page=100';
    while (next && out.length < max) {
      const { data, link } = await request('GET', next);
      out.push(...data);
      next = /<([^>]+)>;\s*rel="next"/.exec(link ?? '')?.[1] ?? null;
    }
    return out.slice(0, max);
  }

  return {
    repo,
    get: async (p) => (await request('GET', p)).data,
    post: async (p, b) => (await request('POST', p, b))?.data ?? null,
    patch: async (p, b) => (await request('PATCH', p, b))?.data ?? null,
    put: async (p, b) => (await request('PUT', p, b))?.data ?? null,
    del: async (p) => request('DELETE', p),
    paginate,
  };
}

function ghCliToken() {
  try {
    return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

function ghCliRepo() {
  try {
    return execFileSync('gh', ['repo', 'view', '--json', 'nameWithOwner', '-q', '.nameWithOwner'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}
