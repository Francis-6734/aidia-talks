import { motion } from 'framer-motion'
import { useSiteContent } from '../../hooks/useSupabase'
import { useTable } from '../../hooks/useSupabase'

export default function OfficeGallery() {
  const { content, loading: contentLoading } = useSiteContent([
    'office_heading_before',
    'office_heading_highlight',
    'office_heading_after',
    'office_subheading',
  ])

  const { data: images, loading: imagesLoading } = useTable('office_gallery', {
    orderBy: 'display_order',
    ascending: true,
  })

  const loading = contentLoading || imagesLoading

  if (loading) {
    return (
      <section className="py-12 md:py-20 bg-[#131313]">
        <div className="flex flex-col items-center mb-10 px-4">
          <div className="w-10 h-10 bg-gray-800 rounded-full mb-4 animate-pulse" />
          <div className="h-8 bg-gray-800 rounded w-72 mb-3 animate-pulse" />
          <div className="h-5 bg-gray-800 rounded w-96 animate-pulse" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-72 h-52 bg-gray-800 rounded-2xl flex-shrink-0 animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  const before = content.office_heading_before || 'Get an'
  const highlight = content.office_heading_highlight || 'impression'
  const after = content.office_heading_after || 'of our office'
  const subheading = content.office_subheading || 'With a diverse range of backgrounds and styles, we\'ve got the perfect fit for any web design project. So why settle for mediocre when you can have the best?'

  if (!images || images.length === 0) return null

  const repeated = [...images, ...images]

  return (
    <section className="py-12 md:py-20 bg-[#131313] overflow-hidden">
      {/* Header */}
      <motion.div
        className="flex flex-col items-center mb-10 md:mb-14 px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <img
          src="/Logo.png"
          alt="Aidia Talks"
          className="w-10 h-10 md:w-12 md:h-12 object-contain mb-4"
        />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white text-center">
          {before}{' '}
          <span className="text-[#6366f1]">{highlight}</span>{' '}
          {after}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-gray-400 text-center max-w-xl">
          {subheading}
        </p>
      </motion.div>

      {/* Infinite scroll gallery */}
      <div className="flex gap-2 md:gap-3 animate-gallery-scroll" style={{ width: 'max-content' }}>
        {repeated.map((img, i) => (
          <div
            key={`${img.id}-${i}`}
            className="w-72 sm:w-80 md:w-[26rem] flex-shrink-0 overflow-hidden rounded-2xl bg-[#1a1a1a]"
          >
            <img
              src={img.image_url}
              alt={img.alt_text || 'Office'}
              className="w-full h-auto rounded-2xl"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
