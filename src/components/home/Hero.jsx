import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSiteContent, useTable } from '../../hooks/useSupabase'

const container = {
  animate: { transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
}

const item = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
}

function ScrollColumn({ images, direction = 'up' }) {
  if (!images.length) return null

  // Duplicate images for seamless infinite scroll
  const repeated = [...images, ...images]

  return (
    <div className="relative h-full overflow-hidden rounded-xl">
      <div
        className={`flex flex-col gap-3 ${
          direction === 'up' ? 'animate-scroll-up' : 'animate-scroll-down'
        }`}
        style={{ willChange: 'transform' }}
      >
        {repeated.map((img, i) => (
          <div
            key={`${img.id}-${i}`}
            className="w-full overflow-hidden rounded-xl flex-shrink-0 aspect-[3/4]"
          >
            <img
              src={img.image_url}
              alt={img.alt_text || 'Aidia Talks'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Hero() {
  const { content, loading: contentLoading } = useSiteContent([
    'hero_headline',
    'hero_subheadline',
    'hero_cta_primary_text',
    'hero_cta_primary_link',
    'hero_cta_secondary_text',
    'hero_cta_secondary_link',
  ])

  const { data: heroImages, loading: imagesLoading } = useTable('hero_images', {
    orderBy: 'display_order',
    ascending: true,
  })

  const loading = contentLoading || imagesLoading

  const col1Images = heroImages.filter(img => img.column_position === 1)
  const col2Images = heroImages.filter(img => img.column_position === 2)
  const hasImages = heroImages.length > 0

  if (loading) {
    return (
      <section className="min-h-screen flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
            <div className="animate-pulse space-y-6 lg:w-1/2">
              <div className="h-14 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4" />
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-full" />
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
              <div className="flex gap-4 mt-8">
                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-40" />
                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-40" />
              </div>
            </div>
            <div className="lg:w-1/2 mt-10 lg:mt-0 flex gap-3">
              <div className="w-1/2 space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                ))}
              </div>
              <div className="w-1/2 space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen flex items-center pt-16 bg-gradient-to-br from-white via-gray-50 to-cream dark:from-[#0a0f1a] dark:via-navy dark:to-navy-dark overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 lg:py-24">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
          {/* Left - Text */}
          <motion.div
            className="lg:w-1/2 mb-8 lg:mb-0"
            variants={container}
            initial="initial"
            animate="animate"
          >
            <motion.h1
              variants={item}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-navy dark:text-white leading-tight"
            >
              {content.hero_headline || 'From Classroom Projects to Market Products'}
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl"
            >
              {content.hero_subheadline || 'Empowering the next generation of Kenyan innovators through industry-led talks and project mentorship.'}
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to={content.hero_cta_primary_link || '/features'}
                className="bg-orange text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-orange-dark transition-colors text-center shadow-lg shadow-orange/20"
              >
                {content.hero_cta_primary_text || 'Explore Our Talks'}
              </Link>
              <Link
                to={content.hero_cta_secondary_link || '/contact'}
                className="border-2 border-navy dark:border-gray-500 text-navy dark:text-gray-300 px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-navy hover:text-white dark:hover:bg-white dark:hover:text-navy transition-colors text-center"
              >
                {content.hero_cta_secondary_text || 'Partner With Us'}
              </Link>
            </motion.div>
          </motion.div>

          {/* Right - Animated Image Grid */}
          <motion.div
            className="lg:w-1/2 h-[480px] sm:h-[540px] lg:h-[580px]"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {hasImages ? (
              <div className="flex gap-3 h-full">
                <div className="w-1/2 h-full overflow-hidden">
                  <ScrollColumn images={col1Images.length ? col1Images : heroImages} direction="up" />
                </div>
                <div className="w-1/2 h-full overflow-hidden">
                  <ScrollColumn images={col2Images.length ? col2Images : heroImages} direction="down" />
                </div>
              </div>
            ) : (
              <div className="h-full flex gap-3">
                <div className="w-1/2 flex flex-col gap-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex-1 bg-gray-100 dark:bg-navy-light rounded-xl flex items-center justify-center">
                      <div className="text-center text-gray-500 px-4">
                        <div className="text-2xl mb-1">📷</div>
                        <p className="text-xs">Upload via admin</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-1/2 flex flex-col gap-3">
                  {[4, 5, 6].map(i => (
                    <div key={i} className="flex-1 bg-gray-100 dark:bg-navy-light rounded-xl flex items-center justify-center">
                      <div className="text-center text-gray-500 px-4">
                        <div className="text-2xl mb-1">📷</div>
                        <p className="text-xs">Upload via admin</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
