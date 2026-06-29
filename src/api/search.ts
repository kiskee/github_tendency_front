import { request } from './client'

export interface GitHubRepo {
  githubId: number
  name: string
  fullName: string
  owner: string
  url: string
  stars: number
  forks: number
  language: string
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
