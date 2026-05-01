'use client'

import { useState } from 'react'
import { useFileState } from '@/store/file-state'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function Step4Download() {
  const { fileId, baseName, setBaseName } = useFileState()
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    if (!fileId) return
    setIsDownloading(true)
    setError(null)
    try {
      await fetch(`/api/base-name/${fileId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base_name: baseName }),
      })
      const res = await fetch(`/api/download/${fileId}`)
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error al generar archivos')
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'archivos.zip'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre base para los archivos</label>
          <Input
            value={baseName}
            onChange={(e) => setBaseName(e.target.value)}
            placeholder="nombre_base"
            className="max-w-sm"
          />
          <p className="text-xs text-muted-foreground">Los archivos se nombran como: [base] [Variable].xlsx</p>
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button onClick={handleDownload} disabled={isDownloading} size="lg">
          {isDownloading ? 'Generando...' : '⬇ Generar y descargar archivos'}
        </Button>
      </CardContent>
    </Card>
  )
}
