import { NextRequest, NextResponse } from 'next/server'
import { getHeadersData } from '@/lib/excel-service'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params
  try {
    return NextResponse.json({ headers_data: getHeadersData(fileId) })
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 404 })
  }
}
