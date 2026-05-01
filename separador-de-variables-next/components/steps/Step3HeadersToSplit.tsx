'use client'

import HeadersTable from './HeadersTable'

interface Props {
  onComplete: () => void
}

export default function Step3HeadersToSplit({ onComplete }: Props) {
  return <HeadersTable mode="split" onComplete={onComplete} />
}
