import { request } from './client'

export interface TrendLanguageEntry {
  name: string
  size: number
}

export interface TrendRepo {
  githubId: number
  name: string
  fullName: string
  owner: string
  url: string
  stars: number
  forks: number
  watchers: number
  openIssues: number
  license: string | null
  language: string
  languages: TrendLanguageEntry[]
  topics: string[]
  latestRelease: string | null
  homepageUrl: string | null
  isArchived: boolean
  diskUsage: number
  description: string
  createdAt: string
  lastPush: string
  stars24h: number
  stars7d: number
  score: number
}

export interface TrendSearch {
  id: number
  keyword: string
  search_count: number
  last_searched_at: string
  created_at: string
  repositories: TrendRepo[]
}

export interface TrendsResponse {
  total: number
  page: number
  limit: number
  repoLimit: number
  data: TrendSearch[]
}

export interface TrendsStats {
  total_keywords: number
  total_repositories: number
  total_links: number
  total_searches: number
  max_stars: number
  top_language: string
}

export function getTrends(params?: {
  keyword?: string
  language?: string
  sort?: string
  limit?: number
  page?: number
  repoLimit?: number
}): Promise<TrendsResponse> {
  const query = new URLSearchParams()
  if (params?.keyword) query.set('keyword', params.keyword)
  if (params?.language) query.set('language', params.language)
  if (params?.sort) query.set('sort', params.sort)
  if (params?.limit != null) query.set('limit', String(params.limit))
  if (params?.page != null) query.set('page', String(params.page))
  if (params?.repoLimit != null) query.set('repoLimit', String(params.repoLimit))
  const qs = query.toString()
  return request(`/trends${qs ? `?${qs}` : ''}`)
}

export function getTrendsStats(): Promise<TrendsStats> {
  return request('/trends/stats')
}

export interface TopRepo {
  full_name: string
  owner: string
  stars: number
  forks: number
  language: string
  description: string
  url: string
}

export interface OwnerStat {
  owner: string
  repo_count: number
  total_stars: number
}

export interface PerKeyword {
  keyword: string
  total_repos: number
  avg_stars: number
  max_stars: number
  total_forks: number
}

export interface LanguageBreakdown {
  language: string
  count: number
  percentage: number
}

export interface KeywordPopularity {
  keyword: string
  search_count: number
  last_searched_at: string
}

export interface Report {
  generated_at: string
  top_repos: TopRepo[]
  top_owners: OwnerStat[]
  per_keyword: PerKeyword[]
  language_breakdown: LanguageBreakdown[]
  newest_repos: TopRepo[]
  most_recently_pushed: TopRepo[]
  keyword_popularity: KeywordPopularity[]
  totals: {
    total_repos: number
    total_keywords: number
    total_owners: number
  }
}

export function getReport(): Promise<Report> {
  return request('/trends/report')
}
