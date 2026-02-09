import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

export const statKeys = [
  { numKey: 'stats_1_number', labelKey: 'stats_1_label' },
  { numKey: 'stats_2_number', labelKey: 'stats_2_label' },
  { numKey: 'stats_3_number', labelKey: 'stats_3_label' },
  { numKey: 'stats_4_number', labelKey: 'stats_4_label' },
]

export function parseNumber(value) {
  if (!value) return { num: 0, suffix: '' }
  const match = value.match(/^([\d,]+)(.*)$/)
  if (!match) return { num: 0, suffix: '' }
  return {
    num: parseInt(match[1].replace(/,/g, ''), 10),
    suffix: match[2] || '',
  }
}

export function CountUp({ target, suffix, duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!inView || hasStarted.current || target === 0) return
    hasStarted.current = true

    const start = performance.now()
    function tick(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        setCount(target)
      }
    }
    requestAnimationFrame(tick)
  }, [inView, target, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}
