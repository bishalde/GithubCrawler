// GitHub logins: 1–39 chars, alphanumeric or single hyphens, no leading/trailing hyphen.
const LOGIN_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i

export function isValidLogin(value: string): boolean {
  return LOGIN_RE.test(value)
}

/** Accept "@user", "github.com/user" or a full profile URL, and return the bare login. */
export function normalizeLogin(input: string): string {
  let v = input.trim()
  const urlMatch = v.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/?#]+)/i)
  if (urlMatch) v = urlMatch[1]
  return v.replace(/^@/, '')
}
