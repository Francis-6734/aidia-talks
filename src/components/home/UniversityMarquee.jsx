import { motion } from 'framer-motion'
import { useTable, useSiteContent } from '../../hooks/useSupabase'

export default function UniversityMarquee() {
  const { data: partners, loading: partnersLoading } = useTable('university_partners', {
    orderBy: 'display_order',
    ascending: true,
  })

  const { content, loading: contentLoading } = useSiteContent([
    'marquee_heading',
    'marquee_subheading',
  ])

  const loading = partnersLoading || contentLoading

  if (loading) {
    return (
      <section className="py-10 md:py-16 bg-white dark:bg-[#0f172a] transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse text-center space-y-3 mb-10 md:mb-14">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-56 mx-auto" />
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-80 mx-auto" />
          </div>
          <div className="flex justify-center gap-10 md:gap-16">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-8 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (partners.length === 0) return null

  const heading = content.marquee_heading || 'Trusted by the best'
  const subheading = content.marquee_subheading || 'Leading Kenyan universities and TVETs partner with us to inspire innovation.'

  return (
    <section className="py-10 md:py-16 bg-white dark:bg-[#0f172a] transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-navy dark:text-white italic">
            {heading}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            {subheading}
          </p>
        </motion.div>
      </div>

      {/* Marquee logos */}
      <div className="overflow-hidden">
        <div
          className="flex animate-marquee hover:[animation-play-state:paused] items-center gap-12 md:gap-20"
          style={{ width: 'max-content' }}
        >
          {[...partners, ...partners].map((partner, i) => (
            <div key={`${partner.id}-${i}`} className="flex-shrink-0 px-2 md:px-4">
              {partner.logo_url ? (
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="h-8 sm:h-9 md:h-10 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 dark:invert dark:opacity-60 dark:hover:opacity-100 transition-all duration-300"
                />
              ) : (
                <span className="text-gray-400 dark:text-gray-500 font-semibold text-sm md:text-base whitespace-nowrap hover:text-navy dark:hover:text-white transition-colors duration-300">
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
