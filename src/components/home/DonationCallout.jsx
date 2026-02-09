import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSiteContent } from '../../hooks/useSupabase'

export default function DonationCallout() {
  const { content, loading } = useSiteContent([
    'donation_title',
    'donation_body',
    'donation_cta_text',
    'donation_cta_link',
  ])

  if (loading) return null

  return (
    <section className="py-10 md:py-20 bg-white dark:bg-[#141414] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="bg-gradient-to-r from-orange to-orange-light rounded-2xl md:rounded-3xl p-6 sm:p-10 md:p-14 text-center text-white relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              {content.donation_title || 'Support the Next Generation of Innovators'}
            </h2>
            <p className="text-white/90 max-w-xl mx-auto mb-8 leading-relaxed">
              {content.donation_body || 'Your contribution helps us reach more universities and mentor more students across Kenya.'}
            </p>
            <Link
              to={content.donation_cta_link || '/contact'}
              className="inline-block bg-white text-orange font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              {content.donation_cta_text || 'Make a Donation'}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
