import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { HiOutlineTrash, HiOutlineMailOpen, HiOutlineMail } from 'react-icons/hi'

export default function MessagesManager() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchMessages() }, [])

  async function fetchMessages() {
    setLoading(true)
    const { data } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  async function toggleRead(msg) {
    await supabase
      .from('contact_submissions')
      .update({ is_read: !msg.is_read })
      .eq('id', msg.id)
    fetchMessages()
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this message?')) return
    await supabase.from('contact_submissions').delete().eq('id', id)
    fetchMessages()
  }

  const unreadCount = messages.filter(m => !m.is_read).length

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl" />)}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-display font-bold text-navy dark:text-white">Contact Messages</h2>
        {unreadCount > 0 && (
          <span className="bg-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {unreadCount} new
          </span>
        )}
      </div>

      {messages.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`bg-white dark:bg-[#1c1c1c] rounded-xl border p-4 ${
                msg.is_read ? 'border-gray-100 dark:border-gray-800' : 'border-orange/30 bg-orange/5 dark:bg-orange/10'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-navy dark:text-white text-sm">{msg.name}</h4>
                    {!msg.is_read && (
                      <span className="w-2 h-2 bg-orange rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {msg.email}
                    {msg.institution && ` · ${msg.institution}`}
                    {' · '}
                    {new Date(msg.created_at).toLocaleDateString('en-KE', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{msg.message}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleRead(msg)}
                    className="p-2 text-gray-400 hover:text-orange transition-colors"
                    aria-label={msg.is_read ? 'Mark as unread' : 'Mark as read'}
                    title={msg.is_read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {msg.is_read ? <HiOutlineMail size={18} /> : <HiOutlineMailOpen size={18} />}
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Delete"
                  >
                    <HiOutlineTrash size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
