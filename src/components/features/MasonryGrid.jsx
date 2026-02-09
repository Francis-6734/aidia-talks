import { motion } from 'framer-motion'
import { useTable } from '../../hooks/useSupabase'

export default function MasonryGrid() {
  const { data: features, loading } = useTable('features', {
    orderBy: 'created_at',
    ascending: false,
    filters: { is_published: true },
  })

  if (loading) {
    return (
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="break-inside-avoid animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl" style={{ height: `${200 + (i % 3) * 80}px` }} />
            <div className="mt-3 h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (features.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">No posts yet. Check back soon!</p>
      </div>
    )
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      {features.map((item, i) => (
        <motion.article
          key={item.id}
          className="break-inside-avoid bg-white dark:bg-[#1c1c1c] rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
        >
          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full object-cover"
              loading="lazy"
            />
          )}
          <div className="p-5">
            <h3 className="font-display font-bold text-navy dark:text-white text-base">
              {item.title}
            </h3>
            {item.description && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {item.description}
              </p>
            )}
            {item.category && (
              <span className="inline-block mt-3 text-xs font-medium text-orange bg-orange/10 px-3 py-1 rounded-full">
                {item.category}
              </span>
            )}
            <p className="mt-3 text-xs text-gray-400">
              {new Date(item.created_at).toLocaleDateString('en-KE', {
                year: 'numeric', month: 'short', day: 'numeric'
              })}
            </p>
          </div>
        </motion.article>
      ))}
    </div>
  )
}
