import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaWhatsapp, FaLinkedin, FaInstagram } from 'react-icons/fa'
import { HiOutlineMail, HiOutlineCheckCircle } from 'react-icons/hi'
import { useSubmit, useSiteContent } from '../../hooks/useSupabase'

export default function ContactForm() {
  const { submit, submitting, success, error: submitError } = useSubmit('contact_submissions')
  const { content } = useSiteContent([
    'contact_heading',
    'contact_subheading',
    'contact_whatsapp_number',
    'contact_email',
    'contact_linkedin_url',
    'contact_instagram_url',
  ])

  const [form, setForm] = useState({ name: '', email: '', institution: '', message: '' })
  const [errors, setErrors] = useState({})

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address'
    if (!form.message.trim()) errs.message = 'Message is required'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    await submit({
      name: form.name.trim(),
      email: form.email.trim(),
      institution: form.institution.trim() || null,
      message: form.message.trim(),
    })
  }

  function handleChange(field) {
    return (e) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }))
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const whatsappLink = content.contact_whatsapp_number
    ? `https://wa.me/${content.contact_whatsapp_number.replace(/[^0-9]/g, '')}`
    : null

  if (success) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <HiOutlineCheckCircle className="text-green-500 mx-auto mb-4" size={56} />
        <h3 className="text-2xl font-display font-bold text-navy dark:text-white mb-2">Thank you!</h3>
        <p className="text-gray-500 dark:text-gray-400">We&apos;ll get back to you shortly.</p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
      {/* Form */}
      <div className="lg:col-span-3">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-navy dark:text-gray-300 mb-1.5">
              Name *
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#1c1c1c] dark:text-white focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-all text-sm"
              placeholder="Your full name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-navy dark:text-gray-300 mb-1.5">
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#1c1c1c] dark:text-white focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-all text-sm"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="institution" className="block text-sm font-medium text-navy dark:text-gray-300 mb-1.5">
              Institution
            </label>
            <input
              id="institution"
              type="text"
              value={form.institution}
              onChange={handleChange('institution')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#1c1c1c] dark:text-white focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-all text-sm"
              placeholder="University or organization"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-navy dark:text-gray-300 mb-1.5">
              Message *
            </label>
            <textarea
              id="message"
              rows={5}
              value={form.message}
              onChange={handleChange('message')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#1c1c1c] dark:text-white focus:border-orange focus:ring-2 focus:ring-orange/20 outline-none transition-all text-sm resize-none"
              placeholder="Tell us how we can help..."
            />
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
          </div>

          {submitError && (
            <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange text-white py-3.5 rounded-xl font-semibold hover:bg-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>

      {/* Contact Info Sidebar */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h3 className="font-display font-bold text-navy dark:text-white text-lg mb-4">Other ways to reach us</h3>

          {content.contact_email && (
            <a
              href={`mailto:${content.contact_email}`}
              className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-orange transition-colors mb-3"
            >
              <HiOutlineMail size={20} />
              <span className="text-sm">{content.contact_email}</span>
            </a>
          )}
        </div>

        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors w-full"
          >
            <FaWhatsapp size={20} />
            Chat on WhatsApp
          </a>
        )}

        <div>
          <h4 className="font-medium text-navy dark:text-gray-300 text-sm mb-3">Follow us</h4>
          <div className="flex gap-4">
            {content.contact_linkedin_url && (
              <a
                href={content.contact_linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>
            )}
            {content.contact_instagram_url && (
              <a
                href={content.contact_instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
