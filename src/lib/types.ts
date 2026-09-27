/** Subset of the GitHub REST `GET /users/{login}` response that the app uses. */
export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  html_url: string
  type: 'User' | 'Organization' | string
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  bio: string | null
  twitter_username: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

/** Subset of a repository object from `GET /users/{login}/repos`. */
export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  homepage: string | null
  fork: boolean
  archived: boolean
  language: string | null
  topics?: string[]
  stargazers_count: number
  forks_count: number
  watchers_count: number
  open_issues_count: number
  default_branch: string
  size: number
  created_at: string
  updated_at: string
  pushed_at: string | null
}

export interface RateLimit {
  limit: number
  remaining: number
  /** Unix epoch milliseconds when the quota resets. */
  resetAt: number
}
