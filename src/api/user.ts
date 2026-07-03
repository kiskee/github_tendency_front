import { request } from './client'
import type { User } from './auth'

// ============================================
// Types
// ============================================

export interface TrackedRepoRepository {
  id: number
  githubId: number
  name: string
  fullName: string
  owner: string
  description: string
  url: string
  stars: number
  forks: number
  language: string
  stars24h: number
  stars7d: number
  score: number
  lastPush: string
  collectedAt: string
  openIssues: number
  watchers: number
  license: string | null
  latestRelease: string | null
  topics: string[]
  homepageUrl: string | null
  isArchived: boolean
  diskUsage: number
}

export interface TrackedRepo {
  id: number
  fullName: string
  isActive: boolean
  addedAt: string
  repository: TrackedRepoRepository
}

export interface SnapshotPoint {
  collectedAt: string
  stars: number
  forks: number
  openIssues: number
}

export interface CommitInfo {
  sha: string
  message: string
  authorName: string | null
  authorEmail: string | null
  authorDate: string | null
  url: string
}

export interface PRInfo {
  number: number
  title: string
  state: string
  author_login: string
  author_avatar: string | null
  created_at: string
  updated_at: string
  closed_at: string | null
  merged_at: string | null
  additions: number
  deletions: number
  changed_files: number
  reviewers: { login: string; state: string }[]
  labels: string[]
  head_branch: string
  base_branch: string
  url: string
}

export interface IssueInfo {
  number: number
  title: string
  state: string
  author_login: string
  author_avatar: string | null
  created_at: string
  closed_at: string | null
  labels: string[]
  assignees: { login: string; avatar: string | null }[]
  milestone: string | null
  comments_count: number
  url: string
}

export interface BranchInfo {
  name: string
  is_default: boolean
  last_commit_sha: string | null
  last_commit_message: string | null
  last_commit_author: string | null
  last_commit_date: string | null
  has_open_pr: boolean
}

export interface ReleaseInfo {
  tag_name: string
  name: string | null
  body: string | null
  author_login: string | null
  created_at: string
  published_at: string | null
  is_prerelease: boolean
  is_draft: boolean
  url: string
}

export interface ActivitySummary {
  prsOpened7d: number
  prsMerged7d: number
  prsClosed7d: number
  issuesOpened7d: number
  issuesClosed7d: number
  commits7d: number
  releases30d: number
  activeContributors: number
  totalBranches: number
  totalOpenPrs: number
  totalOpenIssues: number
}

export interface MeResponse {
  user: User
}

export interface TokenStatus {
  hasToken: boolean
  token: string | null
}

export interface CommitsResponse {
  data: CommitInfo[]
  total: number
  limit: number
  offset: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  limit: number
  offset: number
}

// ============================================
// API Functions
// ============================================

export async function getMe(): Promise<MeResponse> {
  return request('/me')
}

export async function updateProfile(data: { name?: string; phone?: string; company?: string; country?: string }): Promise<{ user: User }> {
  return request('/me', { method: 'PUT', body: JSON.stringify(data) })
}

export async function deleteAccount(): Promise<{ message: string }> {
  return request('/me', { method: 'DELETE' })
}

export async function saveGithubToken(token: string): Promise<{ message: string }> {
  return request('/me/github-token', {
    method: 'POST',
    body: JSON.stringify({ token }),
  })
}

export async function deleteGithubToken(): Promise<{ message: string }> {
  return request('/me/github-token', { method: 'DELETE' })
}

export async function getGithubTokenStatus(): Promise<TokenStatus> {
  return request('/me/github-token')
}

export async function getTrackedRepos(): Promise<{ data: TrackedRepo[] }> {
  return request('/me/repos')
}

export async function addTrackedRepo(fullName: string): Promise<TrackedRepo> {
  return request('/me/repos', {
    method: 'POST',
    body: JSON.stringify({ fullName }),
  })
}

export async function removeTrackedRepo(id: number): Promise<{ message: string }> {
  return request(`/me/repos/${id}`, { method: 'DELETE' })
}

export async function getRepoHistory(id: number): Promise<{ data: SnapshotPoint[] }> {
  return request(`/me/repos/${id}/history`)
}

export async function getRepoCommits(id: number, limit: number = 10, offset: number = 0): Promise<CommitsResponse> {
  return request(`/me/repos/${id}/commits?limit=${limit}&offset=${offset}`)
}

export async function refreshRepoCommits(id: number): Promise<{ message: string; commits: CommitInfo[] }> {
  return request(`/me/repos/${id}/refresh-commits`, { method: 'POST' })
}

export async function refreshAllRepoData(id: number): Promise<{ message: string; activity: ActivitySummary }> {
  return request(`/me/repos/${id}/refresh-all`, { method: 'POST' })
}

export async function getRepoPRs(id: number, state?: string, limit: number = 20, offset: number = 0): Promise<PaginatedResponse<PRInfo>> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) })
  if (state) params.set('state', state)
  return request(`/me/repos/${id}/prs?${params.toString()}`)
}

export async function getRepoIssues(id: number, state?: string, limit: number = 20, offset: number = 0): Promise<PaginatedResponse<IssueInfo>> {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) })
  if (state) params.set('state', state)
  return request(`/me/repos/${id}/issues?${params.toString()}`)
}

export async function getRepoBranches(id: number, limit: number = 50, offset: number = 0): Promise<PaginatedResponse<BranchInfo>> {
  return request(`/me/repos/${id}/branches?limit=${limit}&offset=${offset}`)
}

export async function getRepoReleases(id: number, limit: number = 20, offset: number = 0): Promise<PaginatedResponse<ReleaseInfo>> {
  return request(`/me/repos/${id}/releases?limit=${limit}&offset=${offset}`)
}

export async function getRepoActivity(id: number): Promise<ActivitySummary> {
  return request(`/me/repos/${id}/activity`)
}

export interface ScanHistoryEntry {
  id: number
  scanned_at: string
  duration_ms: number
  status: string
  commits_found: number
  prs_opened: number
  prs_merged: number
  prs_closed: number
  issues_opened: number
  issues_closed: number
  branches_count: number
  releases_found: number
  stars: number
  forks: number
  stars_delta_24h: number
  score: number
  error_message: string | null
}

export async function getRepoScanHistory(id: number, limit: number = 20, offset: number = 0): Promise<PaginatedResponse<ScanHistoryEntry>> {
  return request(`/me/repos/${id}/scan-history?limit=${limit}&offset=${offset}`)
}
