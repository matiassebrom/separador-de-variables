import { NextRequest, NextResponse } from 'next/server'
import { setBaseName } from '@/lib/excel-service'

export async function POST(req: NextRequest, { params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params
  const body = await req.json()
  try {
    setBaseName(fileId, body.base_name)
    return NextResponse.json({ message: 'Nombre base guardado' })
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}
