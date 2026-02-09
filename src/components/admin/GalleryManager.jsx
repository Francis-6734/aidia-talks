import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { HiOutlinePlus, HiOutlineTrash, HiOutlineArrowUp, HiOutlineArrowDown } from 'react-icons/hi'

export default function GalleryManager() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [altText, setAltText] = useState('')

  useEffect(() => { fetchImages() }, [])

  async function fetchImages() {
    setLoading(true)
    const { data } = await supabase
      .from('office_gallery')
      .select('*')
      .order('display_order', { ascending: true })
    setImages(data || [])
    setLoading(false)
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)

    const fileName = `office/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('images').upload(fileName, file)

    if (!error) {
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName)
      const maxOrder = images.length > 0 ? Math.max(...images.map(i => i.display_order)) + 1 : 0

      await supabase.from('office_gallery').insert({
        image_url: urlData.publicUrl,
        alt_text: altText || '',
        display_order: maxOrder,
      })
      setAltText('')
      fetchImages()
    }
    setUploading(false)
    e.target.value = ''
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this gallery image?')) return
    await supabase.from('office_gallery').delete().eq('id', id)
    fetchImages()
  }

  async function moveOrder(id, direction) {
    const sorted = [...images].sort((a, b) => a.display_order - b.display_order)
    const idx = sorted.findIndex(i => i.id === id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return

    const current = sorted[idx]
    const swap = sorted[swapIdx]

    await Promise.all([
      supabase.from('office_gallery').update({ display_order: swap.display_order }).eq('id', current.id),
      supabase.from('office_gallery').update({ display_order: current.display_order }).eq('id', swap.id),
    ])
    fetchImages()
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-navy dark:text-white mb-1">Office Gallery</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Upload images for the office gallery section on the About page. Images scroll continuously. Add at least 5 images for a smooth effect.
        </p>
      </div>

      {/* Upload form */}
      <div className="bg-white dark:bg-[#1c1c1c] rounded-xl border border-gray-100 dark:border-gray-800 p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-navy dark:text-gray-300 mb-1">Alt Text (optional)</label>
            <input
              type="text"
              value={altText}
              onChange={e => setAltText(e.target.value)}
              placeholder="Describe the image"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-[#0e0e0e] dark:text-white text-sm focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none"
            />
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
      ) : images.length === 0 ? (
        <p className="text-xs text-gray-400 py-8 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
          No gallery images yet. Upload images to get started.
        </p>
      ) : (
        <div className="space-y-2">
          {[...images].sort((a, b) => a.display_order - b.display_order).map((img, idx) => (
            <div
              key={img.id}
              className="bg-white dark:bg-[#1c1c1c] rounded-xl border border-gray-100 dark:border-gray-800 p-3 flex items-center gap-3"
            >
              <img
                src={img.image_url}
                alt={img.alt_text || 'Office'}
                className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-navy dark:text-white truncate">
                  {img.alt_text || 'No description'}
                </p>
                <p className="text-xs text-gray-400">Order: {img.display_order}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveOrder(img.id, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 text-gray-400 hover:text-orange transition-colors disabled:opacity-30"
                  aria-label="Move up"
                >
                  <HiOutlineArrowUp size={16} />
                </button>
                <button
                  onClick={() => moveOrder(img.id, 'down')}
                  disabled={idx === images.length - 1}
                  className="p-1.5 text-gray-400 hover:text-orange transition-colors disabled:opacity-30"
                  aria-label="Move down"
                >
                  <HiOutlineArrowDown size={16} />
                </button>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Delete"
                >
                  <HiOutlineTrash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
