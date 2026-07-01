import { request } from './client'

export interface LanguageEntry {
  name: string
  size: number
}

export interface GitHubRepo {
  githubId: number
  name: string
  fullName: string
  owner: string
  url: string
  stars: number
  forks: number
  watchers: number
  openIssues: number
  language: string
  languages: LanguageEntry[]
  license: string | null
  latestRelease: string | null
  topics: string[]
  homepageUrl: string | null
  isArchived: boolean
  diskUsage: number
  description: string
  createdAt: string
  lastPush: string
}

export interface SearchResult {
  keyword: string
  totalCount: number
  repositories: GitHubRepo[]
}

export function searchRepos(keyword: string): Promise<SearchResult> {
  return request(`/search/${encodeURIComponent(keyword)}`)
}
