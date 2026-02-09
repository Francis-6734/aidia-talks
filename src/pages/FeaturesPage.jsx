import { motion } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'
import MasonryGrid from '../components/features/MasonryGrid'

export default function FeaturesPage() {
  useSEO({
    title: 'Latest News & Blogs | Aidia Talks Kenya',
    description: 'Field visit photos, university talks, and innovation stories from Aidia Talks across Kenya.',
  })

  return (
    <div className="pt-24 pb-20 bg-white dark:bg-[#141414] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-navy dark:text-white mb-4">
            Latest News & Blogs
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Photos and stories from our field visits to universities and TVETs across Kenya.
          </p>
        </motion.div>

        <MasonryGrid />
      </div>
    </div>
  )
}
