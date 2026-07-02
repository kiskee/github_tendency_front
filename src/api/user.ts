import { request } from './client'
import type { User } from './auth'

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

export interface MeResponse {
  user: User
}

export interface TokenStatus {
  hasToken: boolean
  token: string | null
}

export async function getMe(): Promise<MeResponse> {
  return request('/me')
}

export async function saveGithubToken(token: string): Promise<{ message: string }> {
  return request('/me/github-token', {
    method: 'POST',
    body: JSON.stringify({ token }),
  })
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
