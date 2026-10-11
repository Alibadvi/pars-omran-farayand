import { NextResponse, type NextRequest } from 'next/server'

/** Accounts are created by Tehran administrators; the first admin is created with a server-side script. */
export function proxy(_request: NextRequest) {
  return new NextResponse('Not Found', { status: 404 })
}

export const config = { matcher: ['/admin/create-first-user/:path*', '/api/users/first-register/:path*'] }
