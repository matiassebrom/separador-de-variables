import { NextRequest, NextResponse } from 'next/server'
import { saveUploadedFile } from '@/lib/excel-service'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No se recibio archivo' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  try {
    const fileId = saveUploadedFile(buffer, file.name)
    return NextResponse.json({ file_id: fileId, filename: file.name, message: 'Archivo cargado exitosamente' })
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }
}
