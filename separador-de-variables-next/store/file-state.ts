'use client'

import { create } from 'zustand'
import { HeaderDataItem } from '@/types'

interface FileState {
  fileId: string | null
  filename: string | null
  headersData: HeaderDataItem[]
  headersToKeep: string[]
  headersToSplit: string[]
  baseName: string

  setUploadedFile: (fileId: string, filename: string) => void
  setHeadersData: (data: HeaderDataItem[]) => void
  setHeadersToKeep: (headers: string[]) => void
  setHeadersToSplit: (headers: string[]) => void
  setBaseName: (name: string) => void
  clearFile: () => void
}

export const useFileState = create<FileState>((set) => ({
  fileId: null,
  filename: null,
  headersData: [],
  headersToKeep: [],
  headersToSplit: [],
  baseName: '',

  setUploadedFile: (fileId, filename) => set({ fileId, filename }),
  setHeadersData: (data) => set({ headersData: data }),
  setHeadersToKeep: (headers) => set({ headersToKeep: headers }),
  setHeadersToSplit: (headers) => set({ headersToSplit: headers }),
  setBaseName: (name) => set({ baseName: name }),
  clearFile: () => set({ fileId: null, filename: null, headersData: [], headersToKeep: [], headersToSplit: [], baseName: '' }),
}))
