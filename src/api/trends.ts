import { request } from './client'

export interface TrendSearch {
  id: number
  keyword: string
  search_count: number
  last_searched_at: string
  created_at: string
  repositories: any[]
}

export interface TrendsResponse {
  total: number
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

export function getTrends(params?: { keyword?: string; language?: string; sort?: string; limit?: number }): Promise<TrendsResponse> {
  const query = new URLSearchParams()
  if (params?.keyword) query.set('keyword', params.keyword)
  if (params?.language) query.set('language', params.language)
  if (params?.sort) query.set('sort', params.sort)
  if (params?.limit) query.set('limit', String(params.limit))
  const qs = query.toString()
  return request(`/trends${qs ? `?${qs}` : ''}`)
}

export function getTrendsStats(): Promise<TrendsStats> {
  return request('/trends/stats')
}
