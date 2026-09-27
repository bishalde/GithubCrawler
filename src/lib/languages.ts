// Colors from github-linguist for the most common languages.
const COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Scala: '#c22d40',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#663399',
  SCSS: '#c6538c',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Lua: '#000080',
  Elixir: '#6e4a7e',
  Haskell: '#5e5086',
  Clojure: '#db5855',
  'Jupyter Notebook': '#DA5B0B',
  R: '#198CE7',
  'Objective-C': '#438eff',
  Perl: '#0298c3',
  Zig: '#ec915c',
  Nix: '#7e7eff',
  Dockerfile: '#384d54',
  Makefile: '#427819',
  'Vim Script': '#199f4b',
  'Emacs Lisp': '#c065db',
  MDX: '#fcb32c',
  Astro: '#ff5a03',
  Solidity: '#AA6746',
  OCaml: '#ef7a08',
  Julia: '#a270ba',
}

// Deterministic fallbacks for anything not in the table (and "Other").
const FALLBACK = ['#8b5cf6', '#14b8a6', '#f59e0b', '#ec4899', '#64748b', '#22c55e']

export function languageColor(language: string | null): string {
  if (!language) return '#71717a'
  if (language === 'Other') return '#a1a1aa'
  const known = COLORS[language]
  if (known) return known
  let hash = 0
  for (const ch of language) hash = (hash * 31 + ch.charCodeAt(0)) | 0
  return FALLBACK[Math.abs(hash) % FALLBACK.length]
}
