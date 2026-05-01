'use client'

import { useState, useMemo, useEffect } from 'react'
import { useFileState } from '@/store/file-state'
import { GetHeadersDataResponse, HeaderDataItem } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type SortKey = 'header' | 'total_count' | 'unique_count'
type SortDir = 'asc' | 'desc'

interface Props {
  mode: 'keep' | 'split'
  onComplete: () => void
}

export default function HeadersTable({ mode, onComplete }: Props) {
  const { fileId, headersData, setHeadersData, setHeadersToKeep, setHeadersToSplit } = useFileState()
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('header')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!fileId || headersData.length > 0) return
    setLoading(true)
    fetch(`/api/headers-data/${fileId}`)
      .then((r) => r.json())
      .then((d: GetHeadersDataResponse) => setHeadersData(d.headers_data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [fileId, headersData.length, setHeadersData])

  const filtered = useMemo(() => {
    const term = search.toLowerCase()
    return [...headersData]
      .filter((h) => h.header.toLowerCase().includes(term))
      .sort((a, b) => {
        const av = a[sortKey]
        const bv = b[sortKey]
        const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number)
        return sortDir === 'asc' ? cmp : -cmp
      })
  }, [headersData, search, sortKey, sortDir])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const toggleHeader = (header: string) =>
    setSelected((prev) => prev.includes(header) ? prev.filter((h) => h !== header) : [...prev, header])

  const sortIndicator = (key: SortKey) => sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''

  const handleContinue = async () => {
    if (!fileId || selected.length === 0) return
    setSaving(true)
    setError(null)
    try {
      const endpoint = mode === 'keep' ? `/api/headers-to-keep/${fileId}` : `/api/headers-to-split/${fileId}`
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headers: selected }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error al guardar')
      }
      if (mode === 'keep') setHeadersToKeep(selected)
      else setHeadersToSplit(selected)
      onComplete()
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-muted-foreground py-4">Cargando columnas...</p>

  return (
    <div className="space-y-4">
      <Input
        placeholder="Buscar columna..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <div className="rounded-md border overflow-auto max-h-96">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Sel.</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort('header')}>
                Columna{sortIndicator('header')}
              </TableHead>
              <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort('total_count')}>
                Datos{sortIndicator('total_count')}
              </TableHead>
              <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort('unique_count')}>
                Unicos{sortIndicator('unique_count')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((h: HeaderDataItem) => (
              <TableRow key={h.header} className="cursor-pointer" onClick={() => toggleHeader(h.header)}>
                <TableCell>
                  <Checkbox checked={selected.includes(h.header)} onCheckedChange={() => toggleHeader(h.header)} />
                </TableCell>
                <TableCell>{h.header}</TableCell>
                <TableCell className="text-right">{h.total_count}</TableCell>
                <TableCell className="text-right">{h.unique_count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button onClick={handleContinue} disabled={selected.length === 0 || saving}>
        {saving ? 'Guardando...' : `Continuar (${selected.length} seleccionadas)`}
      </Button>
    </div>
  )
}
