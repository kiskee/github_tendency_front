import { useEffect, useState, useRef } from 'react'

export default function CountUp({ value, duration = 600 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    startRef.current = null
    const step = (now: number) => {
      if (!startRef.current) startRef.current = now
      const elapsed = now - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      setDisplay(Math.floor(progress * value))
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value, duration])

  return <>{display.toLocaleString()}</>
}
