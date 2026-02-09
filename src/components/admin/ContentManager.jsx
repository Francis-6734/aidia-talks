import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { HiOutlineSave, HiOutlineUpload, HiOutlineTrash } from 'react-icons/hi'

export default function ContentManager() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)
  const [editedValues, setEditedValues] = useState({})

  useEffect(() => { fetchContent() }, [])

  async function fetchContent() {
    setLoading(true)
    const { data } = await supabase
      .from('site_content')
      .select('*')
      .order('key')
    setEntries(data || [])
    setLoading(false)
  }

  function handleChange(id, value) {
    setEditedValues(prev => ({ ...prev, [id]: value }))
  }

  async function handleSave(entry) {
    const newValue = editedValues[entry.id]
    if (newValue === undefined || newValue === entry.value) return

    setSaving(entry.id)
    await supabase
      .from('site_content')
      .update({ value: newValue, updated_at: new Date().toISOString() })
      .eq('id', entry.id)

    setSaving(null)
    setEditedValues(prev => {
      const next = { ...prev }
      delete next[entry.id]
      return next
    })
    fetchContent()
  }

  async function handleImageUpload(entry, file) {
    if (!file) return
    setSaving(entry.id)

    const fileName = `content/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('images').upload(fileName, file)

    if (!error) {
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName)
      await supabase
        .from('site_content')
        .update({ value: urlData.publicUrl, updated_at: new Date().toISOString() })
        .eq('id', entry.id)
      fetchContent()
    }
    setSaving(null)
  }

  async function handleImageRemove(entry) {
    if (!window.confirm('Remove this image?')) return
    setSaving(entry.id)
    await supabase
      .from('site_content')
      .update({ value: '', updated_at: new Date().toISOString() })
      .eq('id', entry.id)
    setSaving(null)
    fetchContent()
  }

  function isImageKey(key) {
    return key.endsWith('_image')
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl" />
        ))}
      </div>
    )
  }

  // Group entries by prefix
  const groups = {}
  entries.forEach(entry => {
    const prefix = entry.key.split('_')[0]
    if (!groups[prefix]) groups[prefix] = []
    groups[prefix].push(entry)
  })

  return (
    <div>
      <h2 className="text-lg font-display font-bold text-navy dark:text-white mb-6">Site Content (CMS)</h2>
      <p className="text-sm text-gray-500 mb-6">
        Edit text content used across the website. Changes appear immediately on the public site.
      </p>

      <div className="space-y-8">
        {Object.entries(groups).map(([prefix, items]) => (
          <div key={prefix}>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 capitalize">
              {prefix}
            </h3>
            <div className="space-y-3">
              {items.map(entry => {
                const currentValue = editedValues[entry.id] !== undefined
                  ? editedValues[entry.id]
                  : entry.value
                const isModified = editedValues[entry.id] !== undefined && editedValues[entry.id] !== entry.value

                if (isImageKey(entry.key)) {
                  return (
                    <div key={entry.id} className="bg-white dark:bg-navy rounded-xl border border-gray-100 dark:border-gray-800 p-4">
                      <label className="block text-xs font-medium text-gray-500 mb-2">
                        {entry.key}
                        {entry.description && (
                          <span className="text-gray-400 font-normal ml-2">({entry.description})</span>
                        )}
                      </label>
                      <div className="flex items-center gap-4">
                        {entry.value ? (
                          <img
                            src={entry.value}
                            alt={entry.key}
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-gray-400">No image</span>
                          </div>
                        )}
                        <div className="flex flex-col gap-2">
                          <label className="relative cursor-pointer inline-flex items-center gap-2 bg-orange text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-dark transition-colors">
                            <HiOutlineUpload size={16} />
                            {saving === entry.id ? 'Uploading...' : entry.value ? 'Replace Image' : 'Upload Image'}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleImageUpload(entry, e.target.files?.[0])}
                              disabled={saving === entry.id}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </label>
                          {entry.value && (
                            <button
                              onClick={() => handleImageRemove(entry)}
                              disabled={saving === entry.id}
                              className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            >
                              <HiOutlineTrash size={14} />
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                }

                return (
                  <div key={entry.id} className="bg-white dark:bg-navy rounded-xl border border-gray-100 dark:border-gray-800 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          {entry.key}
                          {entry.description && (
                            <span className="text-gray-400 font-normal ml-2">({entry.description})</span>
                          )}
                        </label>
                        {currentValue.length > 100 ? (
                          <textarea
                            rows={3}
                            value={currentValue}
                            onChange={e => handleChange(entry.id, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-navy-dark dark:text-white text-sm focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none resize-none"
                          />
                        ) : (
                          <input
                            type="text"
                            value={currentValue}
                            onChange={e => handleChange(entry.id, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-navy-dark dark:text-white text-sm focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none"
                          />
                        )}
                      </div>
                      {isModified && (
                        <button
                          onClick={() => handleSave(entry)}
                          disabled={saving === entry.id}
                          className="mt-5 flex items-center gap-1 bg-orange text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-orange-dark transition-colors disabled:opacity-50"
                        >
                          <HiOutlineSave size={14} />
                          {saving === entry.id ? 'Saving...' : 'Save'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
