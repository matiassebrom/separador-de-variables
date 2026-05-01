import * as XLSX from 'xlsx'
import JSZip from 'jszip'
import { FileData, HeaderDataItem } from '@/types'

const fileStore = new Map<string, FileData>()

export function saveUploadedFile(buffer: Buffer, filename: string): string {
  if (!filename.endsWith('.xlsx') && !filename.endsWith('.xls')) {
    throw new Error('El archivo debe ser de tipo Excel (.xlsx o .xls)')
  }
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)
  const headers = rows.length > 0 ? Object.keys(rows[0]) : []

  const fileId = String(Date.now())
  fileStore.set(fileId, {
    rows,
    headers,
    filename,
    headersToKeep: null,
    headersToSplit: null,
    baseName: null,
  })
  return fileId
}

export function getHeaders(fileId: string): string[] {
  const data = requireFile(fileId)
  return data.headers
}

export function getHeadersData(fileId: string): HeaderDataItem[] {
  const data = requireFile(fileId)
  return data.headers.map((header) => {
    const values = data.rows
      .map((r) => r[header])
      .filter((v) => v !== null && v !== undefined && v !== '')
    const unique = new Set(values.map(String))
    return {
      header,
      total_count: values.length,
      unique_count: unique.size,
    }
  })
}

export function setHeadersToKeep(fileId: string, headers: string[]): string[] {
  const data = requireFile(fileId)
  for (const h of headers) {
    if (!data.headers.includes(h)) {
      throw new Error(`Header '${h}' no esta en la lista de headers`)
    }
  }
  data.headersToKeep = headers
  return headers
}

export function setHeadersToSplit(fileId: string, headers: string[]): number {
  const data = requireFile(fileId)
  for (const h of headers) {
    if (!data.headers.includes(h)) {
      throw new Error(`Header '${h}' no esta en la lista de headers`)
    }
  }
  data.headersToSplit = headers
  return headers.length
}

export function setBaseName(fileId: string, baseName: string): void {
  const data = requireFile(fileId)
  data.baseName = baseName
}

export async function generateZip(fileId: string): Promise<Buffer> {
  const data = requireFile(fileId)
  if (!data.headersToSplit) throw new Error('Falta configurar columnas para separar')
  if (!data.headersToKeep) throw new Error('Falta configurar columnas a mantener')

  const baseName = data.baseName ?? data.filename.replace(/\.[^.]+$/, '')
  const zip = new JSZip()

  for (const splitColumn of data.headersToSplit) {
    const colsToInclude = [...data.headersToKeep]
    if (!colsToInclude.includes(splitColumn)) colsToInclude.push(splitColumn)

    const filteredRows = data.rows.map((row) => {
      const out: Record<string, unknown> = {}
      for (const col of colsToInclude) out[col] = row[col]
      return out
    })

    const ws = XLSX.utils.json_to_sheet(filteredRows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    const xlsxBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer

    zip.file(`${baseName} ${splitColumn}.xlsx`, xlsxBuffer)
  }

  return zip.generateAsync({ type: 'nodebuffer' }) as Promise<Buffer>
}

function requireFile(fileId: string): FileData {
  const data = fileStore.get(fileId)
  if (!data) throw new Error('ID de archivo no encontrado')
  return data
}
