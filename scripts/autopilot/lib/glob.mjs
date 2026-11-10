// Minimal, dependency-free glob matcher.
// Supports: `**` (any number of path segments), `*` (within a segment),
// `?` (single char), and a trailing `/` meaning "everything under this dir".

const cache = new Map();

export function globToRegExp(glob) {
  if (cache.has(glob)) return cache.get(glob);
  let pattern = glob.trim();
  if (pattern.startsWith('./')) pattern = pattern.slice(2);
  if (pattern.startsWith('/')) pattern = pattern.slice(1);
  if (pattern.endsWith('/')) pattern += '**';

  let re = '';
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (ch === '*') {
      if (pattern[i + 1] === '*') {
        // `**/` matches zero or more directories; bare `**` matches anything.
        if (pattern[i + 2] === '/') {
          re += '(?:.*/)?';
          i += 2;
        } else {
          re += '.*';
          i += 1;
        }
      } else {
        re += '[^/]*';
      }
    } else if (ch === '?') {
      re += '[^/]';
    } else if ('\\^$.|+()[]{}'.includes(ch)) {
      re += '\\' + ch;
    } else {
      re += ch;
    }
  }
  const compiled = new RegExp('^' + re + '$');
  cache.set(glob, compiled);
  return compiled;
}

export function matchesAny(path, globs = []) {
  return globs.some((g) => globToRegExp(g).test(path));
}

export function firstMatch(path, globs = []) {
  return globs.find((g) => globToRegExp(g).test(path)) ?? null;
}
