import { motion } from 'framer-motion'
import { useSiteContent } from '../../hooks/useSupabase'

export default function Testimonial() {
  const { content, loading } = useSiteContent([
    'testimonial_quote',
    'testimonial_name',
    'testimonial_role',
    'testimonial_image',
  ])

  if (loading) {
    return (
      <section className="py-10 md:py-16 bg-white dark:bg-[#141414] transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
            <div className="md:w-1/2 animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-full" />
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-full" />
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
              <div className="mt-8 space-y-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-40" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32" />
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="aspect-[5/6] bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse max-w-md mx-auto" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  const quote = content.testimonial_quote || 'Rest assured that you will be in capable hands with our team. We will take care of every aspect of your product and provide ongoing support.'
  const name = content.testimonial_name || ''
  const role = content.testimonial_role || ''
  const image = content.testimonial_image || ''

  if (!quote && !name) return null

  return (
    <section className="py-10 md:py-16 bg-white dark:bg-[#141414] transition-colors overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12 lg:gap-16">
          {/* Left — Quote */}
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-[1.7rem] font-display font-medium text-navy dark:text-white leading-relaxed lg:leading-[1.5]">
              {quote}
            </blockquote>

            {name && (
              <div className="mt-6 md:mt-8">
                <p className="font-display font-bold text-base md:text-lg text-navy dark:text-white">
                  {name}
                </p>
                {role && (
                  <p className="text-sm text-[#6366f1]">
                    {role}
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* Right — Portrait */}
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="max-w-md mx-auto md:max-w-none">
              {image ? (
                <img
                  src={image}
                  alt={name || 'Testimonial'}
                  className="w-full aspect-[5/6] object-cover rounded-3xl"
                />
              ) : (
                <div className="aspect-[5/6] bg-gray-100 dark:bg-[#242424] rounded-3xl flex items-center justify-center">
                  <p className="text-gray-400 text-sm text-center px-4">Upload image via admin</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
