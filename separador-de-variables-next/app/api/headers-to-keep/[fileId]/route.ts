import { NextRequest, NextResponse } from 'next/server'
import { setHeadersToKeep } from '@/lib/excel-service'

export async function POST(req: NextRequest, { params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params
  const body = await req.json()
  try {
    const kept = setHeadersToKeep(fileId, body.headers)
    return NextResponse.json({ headers_kept: kept })
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}
