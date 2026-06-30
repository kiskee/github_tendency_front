export const config = {
  matcher: ['/health', '/search/:path*', '/trends/:path*'],
}

export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const target = `https://prologue-vintage-cheesy.ngrok-free.dev${url.pathname}${url.search}`

  const headers = new Headers(request.headers)
  headers.set('x-api-key', process.env.API_KEY || '')
  headers.set('User-Agent', 'Vercel-Edge/1.0')
  headers.delete('host')

  return fetch(target, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? null : request.body,
  })
}
