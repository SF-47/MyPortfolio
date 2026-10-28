import { useEffect, useState } from 'react'

const STEP_MS = 3000

// State for stepping through a sequence of stages. Autoplay advances one stage at a time
// and stops after the last one; it never loops. When autoplay is not allowed (reduced
// motion) the trace is stepped manually only.
export function useRequestTrace(stageCount: number, autoplayAllowed: boolean) {
  const last = stageCount - 1
  const [step, setStep] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  // Changes every time a stage is entered, so the dot animation restarts even when the
  // same stage is shown again (Replay).
  const [run, setRun] = useState(0)

  const enter = (next: number) => {
    setStep(next)
    setRun((value) => value + 1)
  }

  useEffect(() => {
    if (!playing || step === null) return
    const timer = window.setTimeout(() => {
      if (step >= last) {
        setPlaying(false)
      } else {
        setStep(step + 1)
        setRun((value) => value + 1)
      }
    }, STEP_MS)
    return () => window.clearTimeout(timer)
  }, [playing, step, last])

  return {
    step,
    playing,
    run,
    atEnd: step === last,
    start: () => {
      enter(0)
      setPlaying(autoplayAllowed)
    },
    pause: () => setPlaying(false),
    resume: () => setPlaying(autoplayAllowed),
    next: () => {
      setPlaying(false)
      enter(step === null ? 0 : Math.min(step + 1, last))
    },
    previous: () => {
      setPlaying(false)
      if (step !== null) enter(Math.max(step - 1, 0))
    },
    reset: () => {
      setPlaying(false)
      setStep(null)
    },
  }
}

export type RequestTrace = ReturnType<typeof useRequestTrace>
