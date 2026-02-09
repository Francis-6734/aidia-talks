import { motion } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'
import { useSiteContent } from '../hooks/useSupabase'
import AboutStats from '../components/about/AboutStats'

const sectionAnim = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

export default function AboutPage() {
  useSEO({
    title: 'About Aidia Talks | Kollint Ventures Ltd',
    description: 'Learn about Aidia Talks, a Kollint Ventures Ltd initiative building a better Kenya through university innovation.',
  })

  const { content, loading } = useSiteContent([
    'about_vision',
    'about_vision_body',
    'about_parent_company',
    'about_parent_company_body',
    'about_mission',
  ])

  if (loading) {
    return (
      <div className="pt-24 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-16">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48" />
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-full" />
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-4/6" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="pt-16">
        <AboutStats />
      </div>

      <div className="py-10 md:py-20 bg-white dark:bg-[#0f172a] transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Vision */}
          <motion.section className="mb-10 md:mb-20" {...sectionAnim}>
            <div className="bg-gradient-to-br from-navy to-navy-light rounded-2xl md:rounded-3xl p-6 sm:p-10 md:p-14 text-white">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                {content.about_vision || 'A Better Kenya'}
              </h2>
              <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                {content.about_vision_body || 'We envision a Kenya where every university student with a great idea has the mentorship, resources, and connections to bring it to life.'}
              </p>
            </div>
          </motion.section>

          {/* Parent Company */}
          <motion.section className="mb-10 md:mb-20" {...sectionAnim}>
            <h2 className="text-2xl font-display font-bold text-navy dark:text-white mb-4">
              Powered by {content.about_parent_company || 'Kollint Ventures Ltd'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {content.about_parent_company_body || 'Aidia Talks is an initiative under Kollint Ventures Ltd, dedicated to bridging the gap between academia and industry in Kenya.'}
            </p>
          </motion.section>

          {/* Mission */}
          <motion.section className="mb-10 md:mb-20" {...sectionAnim}>
            <div className="border-l-4 border-orange pl-6 sm:pl-8">
              <h2 className="text-2xl font-display font-bold text-navy dark:text-white mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base md:text-lg">
                {content.about_mission || 'Our mission is to ignite innovation in Kenyan universities by creating spaces where students can pitch, learn, and grow alongside industry professionals.'}
              </p>
            </div>
          </motion.section>

          {/* Provocation Pillar */}
          <motion.section {...sectionAnim}>
            <div className="bg-cream dark:bg-navy rounded-2xl md:rounded-3xl p-6 sm:p-10 md:p-14">
              <h2 className="text-2xl font-display font-bold text-navy dark:text-white mb-4">The Provocation Pillar</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We bring field specialists to challenge students, expose breakthroughs, and discuss industry hurdles.
                We don&apos;t just teach — we provoke the next great Kenyan innovation.
              </p>
            </div>
          </motion.section>
        </div>
      </div>
    </>
  )
}
