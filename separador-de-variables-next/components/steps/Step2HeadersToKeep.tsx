'use client'

import HeadersTable from './HeadersTable'

interface Props {
  onComplete: () => void
}

export default function Step2HeadersToKeep({ onComplete }: Props) {
  return <HeadersTable mode="keep" onComplete={onComplete} />
}
