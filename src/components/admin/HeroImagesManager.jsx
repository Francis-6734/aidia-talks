import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { HiOutlinePlus, HiOutlineTrash, HiOutlineArrowUp, HiOutlineArrowDown } from 'react-icons/hi'

export default function HeroImagesManager() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [column, setColumn] = useState(1)
  const [altText, setAltText] = useState('')

  useEffect(() => { fetchImages() }, [])

  async function fetchImages() {
    setLoading(true)
    const { data } = await supabase
      .from('hero_images')
      .select('*')
      .order('column_position', { ascending: true })
      .order('display_order', { ascending: true })
    setImages(data || [])
    setLoading(false)
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)

    const fileName = `hero/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('images').upload(fileName, file)

    if (!error) {
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName)
      const colImages = images.filter(img => img.column_position === column)
      const maxOrder = colImages.length > 0 ? Math.max(...colImages.map(i => i.display_order)) + 1 : 0

      await supabase.from('hero_images').insert({
        image_url: urlData.publicUrl,
        alt_text: altText || '',
        column_position: column,
        display_order: maxOrder,
      })
      setAltText('')
      fetchImages()
    }
    setUploading(false)
    e.target.value = ''
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this hero image?')) return
    await supabase.from('hero_images').delete().eq('id', id)
    fetchImages()
  }

  async function moveOrder(id, direction) {
    const img = images.find(i => i.id === id)
    if (!img) return

    const colImages = images
      .filter(i => i.column_position === img.column_position)
      .sort((a, b) => a.display_order - b.display_order)

    const idx = colImages.findIndex(i => i.id === id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= colImages.length) return

    const current = colImages[idx]
    const swap = colImages[swapIdx]

    await Promise.all([
      supabase.from('hero_images').update({ display_order: swap.display_order }).eq('id', current.id),
      supabase.from('hero_images').update({ display_order: current.display_order }).eq('id', swap.id),
    ])
    fetchImages()
  }

  const col1 = images.filter(i => i.column_position === 1).sort((a, b) => a.display_order - b.display_order)
  const col2 = images.filter(i => i.column_position === 2).sort((a, b) => a.display_order - b.display_order)

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-navy dark:text-white mb-1">Hero Image Grid</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Upload images for the hero section. Column 1 scrolls upward, Column 2 scrolls downward. Add at least 3 images per column for smooth animation.
        </p>
      </div>

      {/* Upload form */}
      <div className="bg-white dark:bg-navy rounded-xl border border-gray-100 dark:border-gray-800 p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-navy dark:text-gray-300 mb-1">Alt Text (optional)</label>
            <input
              type="text"
              value={altText}
              onChange={e => setAltText(e.target.value)}
              placeholder="Describe the image"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-navy-dark dark:text-white text-sm focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy dark:text-gray-300 mb-1">Column</label>
            <select
              value={column}
              onChange={e => setColumn(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-navy-dark dark:text-white text-sm focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none"
            >
              <option value={1}>Column 1 (scrolls up)</option>
              <option value={2}>Column 2 (scrolls down)</option>
            </select>
          </div>
          <div>
            <label className="relative cursor-pointer inline-flex items-center gap-2 bg-orange text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-dark transition-colors">
              <HiOutlinePlus size={18} />
              {uploading ? 'Uploading...' : 'Upload Image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1 */}
          <div>
            <h4 className="text-sm font-semibold text-navy dark:text-gray-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange" />
              Column 1 — Scrolls Up ({col1.length} images)
            </h4>
            {col1.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                No images yet. Upload images to Column 1.
              </p>
            ) : (
              <div className="space-y-2">
                {col1.map((img, idx) => (
                  <ImageCard
                    key={img.id}
                    image={img}
                    isFirst={idx === 0}
                    isLast={idx === col1.length - 1}
                    onDelete={handleDelete}
                    onMove={moveOrder}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-sm font-semibold text-navy dark:text-gray-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Column 2 — Scrolls Down ({col2.length} images)
            </h4>
            {col2.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                No images yet. Upload images to Column 2.
              </p>
            ) : (
              <div className="space-y-2">
                {col2.map((img, idx) => (
                  <ImageCard
                    key={img.id}
                    image={img}
                    isFirst={idx === 0}
                    isLast={idx === col2.length - 1}
                    onDelete={handleDelete}
                    onMove={moveOrder}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ImageCard({ image, isFirst, isLast, onDelete, onMove }) {
  return (
    <div className="bg-white dark:bg-navy rounded-xl border border-gray-100 dark:border-gray-800 p-3 flex items-center gap-3">
      <img
        src={image.image_url}
        alt={image.alt_text || 'Hero image'}
        className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-navy dark:text-white truncate">
          {image.alt_text || 'No description'}
        </p>
        <p className="text-xs text-gray-400">Order: {image.display_order}</p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onMove(image.id, 'up')}
          disabled={isFirst}
          className="p-1.5 text-gray-400 hover:text-orange transition-colors disabled:opacity-30"
          aria-label="Move up"
        >
          <HiOutlineArrowUp size={16} />
        </button>
        <button
          onClick={() => onMove(image.id, 'down')}
          disabled={isLast}
          className="p-1.5 text-gray-400 hover:text-orange transition-colors disabled:opacity-30"
          aria-label="Move down"
        >
          <HiOutlineArrowDown size={16} />
        </button>
        <button
          onClick={() => onDelete(image.id)}
          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Delete"
        >
          <HiOutlineTrash size={16} />
        </button>
      </div>
    </div>
  )
}
