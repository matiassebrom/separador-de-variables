'use client'

import { useState } from 'react'
import { useFileState } from '@/store/file-state'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Step1Upload from '@/components/steps/Step1Upload'
import Step2HeadersToKeep from '@/components/steps/Step2HeadersToKeep'
import Step3HeadersToSplit from '@/components/steps/Step3HeadersToSplit'
import Step4Download from '@/components/steps/Step4Download'

const STEPS = ['step-1', 'step-2', 'step-3', 'step-4']

export default function Home() {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [openStep, setOpenStep] = useState<string>('step-1')
  const { fileId, filename } = useFileState()

  const canAccessStep = (n: number) => {
    if (n === 1) return true
    return completedSteps.has(n - 1)
  }

  const isCompleted = (n: number) => completedSteps.has(n)

  const completeStep = (n: number) => {
    setCompletedSteps((prev) => new Set([...prev, n]))
    if (n < 4) setOpenStep(`step-${n + 1}`)
  }

  const stepLabel = (n: number) => {
    if (isCompleted(n)) return '✓'
    if (openStep === `step-${n}`) return '●'
    return '○'
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Separador de Variables</h1>
          <p className="text-sm text-muted-foreground mt-1">Procesa y separa columnas de archivos Excel</p>
        </div>

        <Accordion
          value={[openStep]}
          onValueChange={(val) => {
            const next = val[0]
            if (!next) return
            const n = parseInt(next.replace('step-', ''))
            if (canAccessStep(n)) setOpenStep(next)
          }}
        >
          <AccordionItem value="step-1">
            <AccordionTrigger className="text-base">
              <span className="mr-2 text-primary font-mono">{stepLabel(1)}</span>
              1) Subir archivo
              {isCompleted(1) && fileId && (
                <span className="ml-3 text-xs text-muted-foreground font-normal">{filename}</span>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <Step1Upload onComplete={() => completeStep(1)} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="step-2" disabled={!canAccessStep(2)}>
            <AccordionTrigger className="text-base">
              <span className="mr-2 text-primary font-mono">{stepLabel(2)}</span>
              2) Variables a mantener
            </AccordionTrigger>
            <AccordionContent>
              <Step2HeadersToKeep onComplete={() => completeStep(2)} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="step-3" disabled={!canAccessStep(3)}>
            <AccordionTrigger className="text-base">
              <span className="mr-2 text-primary font-mono">{stepLabel(3)}</span>
              3) Variables a separar
            </AccordionTrigger>
            <AccordionContent>
              <Step3HeadersToSplit onComplete={() => completeStep(3)} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="step-4" disabled={!canAccessStep(4)}>
            <AccordionTrigger className="text-base">
              <span className="mr-2 text-primary font-mono">{stepLabel(4)}</span>
              4) Descargar archivos
            </AccordionTrigger>
            <AccordionContent>
              <Step4Download />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  )
}
