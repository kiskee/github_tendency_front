export const config = {
  matcher: ['/api/:path*'],
}

export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const apiPath = url.pathname.replace(/^\/api/, '')
  const target = `https://prologue-vintage-cheesy.ngrok-free.dev${apiPath}${url.search}`

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
