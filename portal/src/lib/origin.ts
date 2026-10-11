import type { NextRequest } from 'next/server'

export function hasPortalOrigin(request: NextRequest): boolean {
  const configured = process.env.PORTAL_URL || request.nextUrl.origin
  return request.headers.get('origin') === new URL(configured).origin
}
