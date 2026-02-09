import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSiteContent } from '../../hooks/useSupabase'

const processColors = [
  { card: 'bg-[#8EAADB]', dot: 'bg-[#8EAADB]', label: 'text-[#8EAADB]', border: 'border-[#8EAADB]/30' },
  { card: 'bg-[#C4A74A]', dot: 'bg-[#C4A74A]', label: 'text-[#C4A74A]', border: 'border-[#C4A74A]/30' },
  { card: 'bg-[#DDA48A]', dot: 'bg-[#DDA48A]', label: 'text-[#DDA48A]', border: 'border-[#DDA48A]/30' },
]

// Full grid placement for each card (column + row) — staircase diagonal
const cardPlacements = [
  'col-start-1 row-start-1 row-end-3',
  'col-start-2 row-start-2 row-end-4',
  'col-start-3 row-start-3 row-end-5',
]

const steps = [
  { titleKey: 'process_step_1_title', descKey: 'process_step_1_description' },
  { titleKey: 'process_step_2_title', descKey: 'process_step_2_description' },
  { titleKey: 'process_step_3_title', descKey: 'process_step_3_description' },
]

export default function AidiaProcess() {
  const [activeIndex, setActiveIndex] = useState(-1)
  const sectionRef = useRef(null)
  const cardRefs = useRef([])

  const { content, loading } = useSiteContent([
    'process_step_1_title', 'process_step_1_description',
    'process_step_2_title', 'process_step_2_description',
    'process_step_3_title', 'process_step_3_description',
  ])

  // Observe each card and activate the one most centered in viewport
  useEffect(() => {
    const observers = []
    const visible = new Set()

    cardRefs.current.forEach((el, i) => {
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visible.add(i)
          } else {
            visible.delete(i)
          }
          // Pick the lowest-indexed visible card as active
          if (visible.size > 0) {
            const sorted = [...visible].sort((a, b) => a - b)
            setActiveIndex(sorted[0])
          }
        },
        { threshold: 0.5 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [loading])

  if (loading) {
    return (
      <section className="py-10 md:py-20 bg-white dark:bg-[#141414] transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4 text-center mb-8 md:mb-12">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64 mx-auto" />
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-3 grid-rows-4 gap-4 h-[400px]">
            {[0, 1, 2].map(i => (
              <div key={i} className={`${cardPlacements[i]} animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl`} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  const titles = steps.map((s, i) => content[s.titleKey] || `Process ${i + 1}`)
  const descriptions = steps.map(s => content[s.descKey] || '')

  return (
    <section ref={sectionRef} className="py-10 md:py-20 bg-white dark:bg-[#141414] overflow-hidden transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-navy dark:text-white">
            The Aidia Process
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-500 max-w-lg mx-auto">
            How we transform classroom ideas into market-ready products
          </p>
        </motion.div>

        {/* Timeline column headers */}
        <motion.div
          className="hidden md:grid grid-cols-3 border-b border-gray-200 dark:border-gray-700/50 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {steps.map((_, i) => (
            <div
              key={i}
              className={`py-3 text-center text-sm font-medium transition-colors duration-300 ${
                activeIndex === i ? processColors[i].label : 'text-gray-600'
              } ${i < 2 ? 'border-r border-gray-200 dark:border-gray-700/50' : ''}`}
            >
              Process {i + 1}
            </div>
          ))}
        </motion.div>

        {/* Card grid with vertical separators */}
        <div className="relative">
          {/* Vertical separator lines (desktop) */}
          <div className="hidden md:block absolute inset-0 pointer-events-none">
            <div className="grid grid-cols-3 h-full">
              <div className="border-r border-gray-200 dark:border-gray-700/30" />
              <div className="border-r border-gray-200 dark:border-gray-700/30" />
              <div />
            </div>
          </div>

          {/* Cards grid — 4 rows, 3 columns, cards staircase diagonally */}
          <div className="hidden md:grid grid-cols-3 grid-rows-4 gap-4 min-h-[460px] relative z-10 py-4">
            {steps.map((_, i) => (
              <div
                key={i}
                ref={el => (cardRefs.current[i] = el)}
                className={`${cardPlacements[i]} px-3`}
              >
                <motion.div
                  className={`${processColors[i].card} rounded-2xl p-6 h-full flex items-end shadow-lg cursor-pointer transition-shadow ${
                    activeIndex === i ? 'shadow-2xl ring-2 ring-black/5 dark:ring-white/10' : ''
                  }`}
                  initial={{ opacity: 0, y: 40, scale: 0.92 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  onClick={() => setActiveIndex(activeIndex === i ? -1 : i)}
                >
                  <h3 className="text-base lg:text-lg font-display font-bold text-navy-dark/90">
                    {titles[i]}
                  </h3>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Mobile: stacked cards */}
          <div className="md:hidden space-y-4">
            {steps.map((_, i) => (
              <div
                key={i}
                ref={el => { if (!cardRefs.current[i]) cardRefs.current[i] = el }}
              >
                <motion.div
                  className={`${processColors[i].card} rounded-2xl p-6 min-h-[100px] flex items-end shadow-lg`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  onClick={() => setActiveIndex(activeIndex === i ? -1 : i)}
                >
                  <h3 className="text-lg font-display font-bold text-navy-dark/90">
                    {titles[i]}
                  </h3>
                </motion.div>

                {/* Mobile popover inline */}
                <AnimatePresence>
                  {activeIndex === i && (
                    <motion.div
                      className={`bg-white dark:bg-[#1e293b] rounded-2xl p-5 mt-3 border ${processColors[i].border} shadow-xl`}
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-3 h-3 rounded-full ${processColors[i].dot}`} />
                        <span className="text-sm font-display font-semibold text-navy dark:text-white">{titles[i]}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{descriptions[i]}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop detail popover — single, positioned below the grid */}
        <div className="hidden md:block mt-6">
          <AnimatePresence mode="wait">
            {activeIndex >= 0 && (
              <motion.div
                key={activeIndex}
                className={`bg-white dark:bg-[#1e293b] rounded-2xl p-6 border ${processColors[activeIndex].border} shadow-xl max-w-sm`}
                style={{
                  marginLeft: activeIndex === 0 ? '0%' : activeIndex === 1 ? '33%' : '66%',
                  transform: activeIndex === 2 ? 'translateX(-100%)' : activeIndex === 1 ? 'translateX(-50%)' : 'none',
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <span className={`w-3 h-3 rounded-full ${processColors[activeIndex].dot}`} />
                  <span className="text-sm font-display font-semibold text-navy dark:text-white">{titles[activeIndex]}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{descriptions[activeIndex]}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
