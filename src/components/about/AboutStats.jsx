import { motion } from 'framer-motion'
import { useSiteContent } from '../../hooks/useSupabase'
import { statKeys, parseNumber, CountUp } from '../../lib/stats'

function HighlightedHeading({ text, highlight }) {
  if (!highlight || !text.includes(highlight)) {
    return <>{text}</>
  }
  const parts = text.split(highlight)
  return (
    <>
      {parts[0]}
      <span className="underline decoration-[#6366f1] decoration-4 underline-offset-4">{highlight}</span>
      {parts[1]}
    </>
  )
}

export default function AboutStats() {
  const allKeys = [
    'about_stats_heading',
    'about_stats_highlight',
    'about_stats_subheading',
    ...statKeys.flatMap(s => [s.numKey, s.labelKey]),
  ]
  const { content, loading } = useSiteContent(allKeys)

  if (loading) {
    return (
      <section className="py-10 md:py-16 bg-gray-50 dark:bg-[#141414] transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4 text-center mb-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-72 mx-auto" />
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-96 mx-auto" />
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700/50 pt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse text-center">
                  <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-20 mx-auto mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-28 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  const heading = content.about_stats_heading || "We're serious in what we do... in a fun way"
  const highlight = content.about_stats_highlight || 'fun'
  const subheading = content.about_stats_subheading || 'We transform ideas into impact and build successful products.'

  const stats = statKeys.map(s => {
    const { num, suffix } = parseNumber(content[s.numKey])
    return { num, suffix, label: content[s.labelKey] || '' }
  }).filter(s => s.label)

  if (stats.length === 0) return null

  return (
    <section className="py-10 md:py-16 bg-gray-50 dark:bg-[#141414] transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          className="text-center mb-8 md:mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-navy dark:text-white leading-snug">
            <HighlightedHeading text={heading} highlight={highlight} />
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {subheading}
          </p>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700/50 mb-8 md:mb-10" />

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 gap-y-6 md:flex md:flex-wrap md:justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center">
              {i > 0 && (
                <div className="hidden md:block w-px h-14 bg-gray-300 dark:bg-gray-700/60 mx-4 md:mx-8 flex-shrink-0" />
              )}
              <div className="text-center px-3 sm:px-2 py-3">
                <div className="text-3xl sm:text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-[#6366f1] to-[#818cf8] bg-clip-text text-transparent">
                  <CountUp target={stat.num} suffix={stat.suffix} />
                </div>
                <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
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
