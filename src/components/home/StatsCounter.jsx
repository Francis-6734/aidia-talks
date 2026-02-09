import { motion } from 'framer-motion'
import { useSiteContent } from '../../hooks/useSupabase'
import { statKeys, parseNumber, CountUp } from '../../lib/stats'

export default function StatsCounter() {
  const allKeys = statKeys.flatMap(s => [s.numKey, s.labelKey])
  const { content, loading } = useSiteContent(allKeys)

  if (loading) {
    return (
      <section className="py-8 md:py-16 bg-gray-50 dark:bg-[#141414] transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse text-center">
                <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-24 mx-auto mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const stats = statKeys.map(s => {
    const { num, suffix } = parseNumber(content[s.numKey])
    return { num, suffix, label: content[s.labelKey] || '' }
  }).filter(s => s.label)

  if (stats.length === 0) return null

  return (
    <section className="py-8 md:py-16 bg-gray-50 dark:bg-[#141414] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 gap-y-6 md:flex md:flex-wrap md:justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center">
              {/* Vertical divider (before every item except the first) */}
              {i > 0 && (
                <div className="hidden md:block w-px h-16 bg-gray-300 dark:bg-gray-700/60 mx-6 md:mx-10 flex-shrink-0" />
              )}

              <div className="text-center px-4 sm:px-2 py-4">
                <div className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-[#6366f1] to-[#818cf8] bg-clip-text text-transparent">
                  <CountUp target={stat.num} suffix={stat.suffix} />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
