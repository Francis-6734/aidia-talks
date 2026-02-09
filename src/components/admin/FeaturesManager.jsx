import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX } from 'react-icons/hi'

const emptyForm = { title: '', description: '', category: 'field-visit', image_url: '' }

export default function FeaturesManager() {
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchFeatures() }, [])

  async function fetchFeatures() {
    setLoading(true)
    const { data } = await supabase
      .from('features')
      .select('*')
      .order('created_at', { ascending: false })
    setFeatures(data || [])
    setLoading(false)
  }

  function openNew() {
    setForm(emptyForm)
    setEditingId(null)
    setUploadError('')
    setShowForm(true)
  }

  function openEdit(item) {
    setForm({
      title: item.title,
      description: item.description || '',
      category: item.category || 'field-visit',
      image_url: item.image_url || '',
    })
    setEditingId(item.id)
    setUploadError('')
    setShowForm(true)
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    const fileName = `features/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const { error } = await supabase.storage.from('images').upload(fileName, file)
    if (error) {
      setUploadError(error.message || 'Image upload failed. Please try again.')
    } else {
      const { data } = supabase.storage.from('images').getPublicUrl(fileName)
      setForm(prev => ({ ...prev, image_url: data.publicUrl }))
    }
    setUploading(false)
    e.target.value = ''
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.title) return
    setSaving(true)

    const row = {
      title: form.title,
      description: form.description || null,
      category: form.category,
      image_url: form.image_url || null,
    }

    if (editingId) {
      await supabase.from('features').update(row).eq('id', editingId)
    } else {
      await supabase.from('features').insert(row)
    }

    setSaving(false)
    setShowForm(false)
    fetchFeatures()
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this post?')) return
    await supabase.from('features').delete().eq('id', id)
    fetchFeatures()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-display font-bold text-navy dark:text-white">Blog & Feature Posts</h2>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-orange text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-dark transition-colors"
        >
          <HiOutlinePlus size={18} />
          Add Post
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-bold text-navy dark:text-white">
                {editingId ? 'Edit Post' : 'New Post'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <HiOutlineX size={22} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy dark:text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-[#0e0e0e] dark:text-white text-sm focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy dark:text-gray-300 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-[#0e0e0e] dark:text-white text-sm focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy dark:text-gray-300 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-[#0e0e0e] dark:text-white text-sm focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none"
                >
                  <option value="field-visit">Field Visit</option>
                  <option value="news">News</option>
                  <option value="blog">Blog</option>
                  <option value="event">Event</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy dark:text-gray-300 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange/10 file:text-orange hover:file:bg-orange/20 disabled:opacity-50"
                />
                {uploading && <p className="text-xs text-orange mt-1">Uploading image, please wait...</p>}
                {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
                {form.image_url && (
                  <img src={form.image_url} alt="Preview" className="mt-2 h-24 rounded-lg object-cover" />
                )}
              </div>

              <button
                type="submit"
                disabled={saving || uploading}
                className="w-full bg-orange text-white py-2.5 rounded-lg font-semibold hover:bg-orange-dark transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : uploading ? 'Wait for upload...' : editingId ? 'Update Post' : 'Create Post'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-48" />
          ))}
        </div>
      ) : features.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(item => (
            <div key={item.id} className="bg-white dark:bg-[#1c1c1c] rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              {item.image_url && (
                <img src={item.image_url} alt={item.title} className="w-full h-36 object-cover" />
              )}
              <div className="p-4">
                <h4 className="font-semibold text-navy dark:text-white text-sm truncate">{item.title}</h4>
                {item.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-orange font-medium">{item.category}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 text-gray-400 hover:text-orange transition-colors"
                      aria-label="Edit"
                    >
                      <HiOutlinePencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Delete"
                    >
                      <HiOutlineTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
