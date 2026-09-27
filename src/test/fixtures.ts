import type { GitHubRepo, GitHubUser } from '../lib/types'

let nextId = 1

export function makeRepo(overrides: Partial<GitHubRepo> = {}): GitHubRepo {
  const id = nextId++
  const name = overrides.name ?? `repo-${id}`
  return {
    id,
    name,
    full_name: `octo/${name}`,
    html_url: `https://github.com/octo/${name}`,
    description: null,
    homepage: null,
    fork: false,
    archived: false,
    language: 'TypeScript',
    topics: [],
    stargazers_count: 0,
    forks_count: 0,
    watchers_count: 0,
    open_issues_count: 0,
    default_branch: 'main',
    size: 100,
    created_at: '2020-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    pushed_at: '2024-01-01T00:00:00Z',
    ...overrides,
  }
}

export function makeUser(overrides: Partial<GitHubUser> = {}): GitHubUser {
  return {
    login: 'octo',
    id: 1,
    avatar_url: 'https://avatars.githubusercontent.com/u/1',
    html_url: 'https://github.com/octo',
    type: 'User',
    name: 'Octo Cat',
    company: null,
    blog: null,
    location: null,
    bio: null,
    twitter_username: null,
    public_repos: 3,
    public_gists: 0,
    followers: 10,
    following: 2,
    created_at: '2015-06-15T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  }
}
