import { NextRequest, NextResponse } from 'next/server'
import { setHeadersToSplit } from '@/lib/excel-service'

export async function POST(req: NextRequest, { params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params
  const body = await req.json()
  try {
    const count = setHeadersToSplit(fileId, body.headers)
    return NextResponse.json({ count_headers_to_split: count })
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}
