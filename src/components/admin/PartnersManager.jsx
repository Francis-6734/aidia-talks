import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX, HiOutlineArrowUp, HiOutlineArrowDown } from 'react-icons/hi'

const emptyForm = { name: '', logo_url: '', website_url: '', display_order: 0 }

export default function PartnersManager() {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchPartners() }, [])

  async function fetchPartners() {
    setLoading(true)
    const { data } = await supabase
      .from('university_partners')
      .select('*')
      .order('display_order', { ascending: true })
    setPartners(data || [])
    setLoading(false)
  }

  function openNew() {
    const nextOrder = partners.length > 0
      ? Math.max(...partners.map(p => p.display_order)) + 1
      : 0
    setForm({ ...emptyForm, display_order: nextOrder })
    setEditingId(null)
    setShowForm(true)
  }

  function openEdit(partner) {
    setForm({
      name: partner.name,
      logo_url: partner.logo_url || '',
      website_url: partner.website_url || '',
      display_order: partner.display_order,
    })
    setEditingId(partner.id)
    setShowForm(true)
  }

  async function handleLogoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fileName = `partners/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('images').upload(fileName, file)
    if (!error) {
      const { data } = supabase.storage.from('images').getPublicUrl(fileName)
      setForm(prev => ({ ...prev, logo_url: data.publicUrl }))
    }
    setUploading(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.name) return
    setSaving(true)

    const row = {
      name: form.name,
      logo_url: form.logo_url || null,
      website_url: form.website_url || null,
      display_order: form.display_order,
    }

    if (editingId) {
      await supabase.from('university_partners').update(row).eq('id', editingId)
    } else {
      await supabase.from('university_partners').insert(row)
    }

    setSaving(false)
    setShowForm(false)
    fetchPartners()
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this partner?')) return
    await supabase.from('university_partners').delete().eq('id', id)
    fetchPartners()
  }

  async function moveOrder(partner, direction) {
    const newOrder = partner.display_order + direction
    await supabase
      .from('university_partners')
      .update({ display_order: newOrder })
      .eq('id', partner.id)
    fetchPartners()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-display font-bold text-navy dark:text-white">University Partners</h2>
          <p className="text-sm text-gray-500 mt-1">Logos displayed in the scrolling marquee on the homepage</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-orange text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-dark transition-colors"
        >
          <HiOutlinePlus size={18} />
          Add Partner
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-navy rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-bold text-navy dark:text-white">
                {editingId ? 'Edit Partner' : 'Add University Partner'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <HiOutlineX size={22} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy dark:text-gray-300 mb-1">University Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-navy-dark dark:text-white text-sm focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none"
                  placeholder="e.g. University of Nairobi"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy dark:text-gray-300 mb-1">Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange/10 file:text-orange hover:file:bg-orange/20"
                />
                {uploading && <p className="text-xs text-gray-400 mt-1">Uploading...</p>}
                {form.logo_url && (
                  <img src={form.logo_url} alt="Logo preview" className="mt-2 h-16 object-contain bg-gray-50 dark:bg-navy-dark rounded-lg p-2" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-navy dark:text-gray-300 mb-1">Website URL</label>
                <input
                  type="url"
                  value={form.website_url}
                  onChange={e => setForm(prev => ({ ...prev, website_url: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-navy-dark dark:text-white text-sm focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none"
                  placeholder="https://www.uonbi.ac.ke"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy dark:text-gray-300 mb-1">Display Order</label>
                <input
                  type="number"
                  value={form.display_order}
                  onChange={e => setForm(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-navy-dark dark:text-white text-sm focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-orange text-white py-2.5 rounded-lg font-semibold hover:bg-orange-dark transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingId ? 'Update Partner' : 'Add Partner'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Partners List */}
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg" />)}
        </div>
      ) : partners.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No university partners yet. Add your first one!</p>
      ) : (
        <div className="space-y-3">
          {partners.map(partner => (
            <div
              key={partner.id}
              className="bg-white dark:bg-navy rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="h-10 w-16 object-contain flex-shrink-0 bg-gray-50 dark:bg-navy-dark rounded p-1"
                  />
                ) : (
                  <div className="h-10 w-16 bg-gray-100 dark:bg-navy-dark rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-gray-400">No logo</span>
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="font-semibold text-navy dark:text-white text-sm truncate">{partner.name}</h4>
                  {partner.website_url && (
                    <p className="text-xs text-gray-400 truncate">{partner.website_url}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveOrder(partner, -1)}
                  className="p-1.5 text-gray-400 hover:text-orange transition-colors"
                  aria-label="Move up"
                  title="Move up"
                >
                  <HiOutlineArrowUp size={16} />
                </button>
                <button
                  onClick={() => moveOrder(partner, 1)}
                  className="p-1.5 text-gray-400 hover:text-orange transition-colors"
                  aria-label="Move down"
                  title="Move down"
                >
                  <HiOutlineArrowDown size={16} />
                </button>
                <button
                  onClick={() => openEdit(partner)}
                  className="p-1.5 text-gray-400 hover:text-orange transition-colors"
                  aria-label="Edit"
                >
                  <HiOutlinePencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(partner.id)}
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
