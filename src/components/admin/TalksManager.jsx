import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX } from 'react-icons/hi'

const emptyForm = { title: '', date: '', institution: '', speaker: '', summary: '', talk_type: 'past', image_url: '' }

export default function TalksManager() {
  const [talks, setTalks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchTalks() }, [])

  async function fetchTalks() {
    setLoading(true)
    const { data } = await supabase
      .from('talks')
      .select('*')
      .order('date', { ascending: false })
    setTalks(data || [])
    setLoading(false)
  }

  function openNew() {
    setForm(emptyForm)
    setEditingId(null)
    setUploadError('')
    setShowForm(true)
  }

  function openEdit(talk) {
    setForm({
      title: talk.title,
      date: talk.date,
      institution: talk.institution,
      speaker: talk.speaker || '',
      summary: talk.summary || '',
      talk_type: talk.talk_type,
      image_url: talk.image_url || '',
    })
    setEditingId(talk.id)
    setUploadError('')
    setShowForm(true)
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    const fileName = `talks/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
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
    if (!form.title || !form.date || !form.institution) return
    setSaving(true)

    const row = {
      title: form.title,
      date: form.date,
      institution: form.institution,
      speaker: form.speaker || null,
      summary: form.summary || null,
      talk_type: form.talk_type,
      image_url: form.image_url || null,
    }

    if (editingId) {
      await supabase.from('talks').update(row).eq('id', editingId)
    } else {
      await supabase.from('talks').insert(row)
    }

    setSaving(false)
    setShowForm(false)
    fetchTalks()
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this talk?')) return
    await supabase.from('talks').delete().eq('id', id)
    fetchTalks()
  }

  const filtered = filter === 'all' ? talks : talks.filter(t => t.talk_type === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {['all', 'past', 'upcoming'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f ? 'bg-navy text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-orange text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-dark transition-colors"
        >
          <HiOutlinePlus size={18} />
          Add Talk
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-bold text-navy dark:text-white">
                {editingId ? 'Edit Talk' : 'New Talk'}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy dark:text-gray-300 mb-1">Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-[#0e0e0e] dark:text-white text-sm focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy dark:text-gray-300 mb-1">Type *</label>
                  <select
                    value={form.talk_type}
                    onChange={e => setForm(prev => ({ ...prev, talk_type: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-[#0e0e0e] dark:text-white text-sm focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none"
                  >
                    <option value="past">Past</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy dark:text-gray-300 mb-1">Institution *</label>
                <input
                  type="text"
                  value={form.institution}
                  onChange={e => setForm(prev => ({ ...prev, institution: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-[#0e0e0e] dark:text-white text-sm focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy dark:text-gray-300 mb-1">Speaker</label>
                <input
                  type="text"
                  value={form.speaker}
                  onChange={e => setForm(prev => ({ ...prev, speaker: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-[#0e0e0e] dark:text-white text-sm focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy dark:text-gray-300 mb-1">Summary</label>
                <textarea
                  rows={3}
                  value={form.summary}
                  onChange={e => setForm(prev => ({ ...prev, summary: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-[#0e0e0e] dark:text-white text-sm focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none resize-none"
                />
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
                {saving ? 'Saving...' : uploading ? 'Wait for upload...' : editingId ? 'Update Talk' : 'Create Talk'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No talks found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(talk => (
            <div
              key={talk.id}
              className="bg-white dark:bg-[#1c1c1c] rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-navy dark:text-white text-sm truncate">{talk.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    talk.talk_type === 'upcoming'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {talk.talk_type}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {talk.institution} &middot; {new Date(talk.date).toLocaleDateString('en-KE')}
                  {talk.speaker && ` · ${talk.speaker}`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(talk)}
                  className="p-2 text-gray-400 hover:text-orange transition-colors"
                  aria-label="Edit"
                >
                  <HiOutlinePencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(talk.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Delete"
                >
                  <HiOutlineTrash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
