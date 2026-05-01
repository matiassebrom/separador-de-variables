'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useFileState } from '@/store/file-state'
import { UploadFileResponse } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Props {
  onComplete: () => void
}

export default function Step1Upload({ onComplete }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setUploadedFile, fileId, filename } = useFileState()

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setSelectedFile(accepted[0])
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'] },
    multiple: false,
  })

  const handleUpload = async () => {
    if (!selectedFile) return
    setIsUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error al subir archivo')
      }
      const data: UploadFileResponse = await res.json()
      setUploadedFile(data.file_id, data.filename)
      onComplete()
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setIsUploading(false)
    }
  }

  if (fileId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div className="space-y-1">
              <p><strong>Archivo:</strong> {filename}</p>
              <p><strong>File ID:</strong> {fileId}</p>
              <p className="text-sm text-muted-foreground">Archivo cargado correctamente. Continua con el siguiente paso.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/60'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">☁️</span>
            <p className="text-muted-foreground">
              {isDragActive ? 'Solta el archivo aqui...' : 'Arrastra tu archivo Excel aqui'}
            </p>
            {selectedFile && (
              <p className="text-sm font-medium text-primary">{selectedFile.name}</p>
            )}
          </div>
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => document.getElementById('file-input-manual')?.click()} disabled={isUploading}>
            Elegir archivo
          </Button>
          <input
            id="file-input-manual"
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
          />
          <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
            {isUploading ? 'Subiendo...' : 'Subir archivo'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
