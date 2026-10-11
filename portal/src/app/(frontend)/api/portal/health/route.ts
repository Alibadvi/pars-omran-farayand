import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    await payload.find({ collection: 'projects', depth: 0, limit: 1, overrideAccess: true })
    return NextResponse.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Portal health check failed:', error)
    return NextResponse.json({ status: 'unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
