import { request } from './client'

export interface User {
  id: number
  email: string
  name: string
  phone: string | null
  company: string | null
  country: string | null
  role: string
  email_verified: boolean
  created_at: string
}

export interface MeResponse {
  user: User
}

export async function getMe(): Promise<MeResponse> {
  return request('/me')
}

export async function login(email: string, password: string): Promise<MeResponse> {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function register(data: {
  email: string
  password: string
  name: string
  phone?: string
  company?: string
  country?: string
}): Promise<{ message: string }> {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function logout(): Promise<{ message: string }> {
  return request('/auth/logout', { method: 'POST' })
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  return request(`/auth/verify-email?token=${encodeURIComponent(token)}`)
}
