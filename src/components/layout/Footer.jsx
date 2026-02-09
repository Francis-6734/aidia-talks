import { Link } from 'react-router-dom'
import { FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { useSiteContent } from '../../hooks/useSupabase'

export default function Footer() {
  const { content } = useSiteContent([
    'footer_tagline',
    'footer_copyright',
    'contact_linkedin_url',
    'contact_instagram_url',
    'contact_whatsapp_number',
  ])

  const whatsappLink = content.contact_whatsapp_number
    ? `https://wa.me/${content.contact_whatsapp_number.replace(/[^0-9]/g, '')}`
    : '#'

  return (
    <footer className="bg-gray-50 dark:bg-[#141414] text-navy dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <img src="/Logo.png" alt="Aidia Talks" className="h-12" />
            <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              {content.footer_tagline || 'Transforming ideas into impact across Kenyan universities.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-600 dark:text-gray-300">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About' },
                { to: '/features', label: 'Features' },
                { to: '/contact', label: 'Contact' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-500 dark:text-gray-400 hover:text-orange text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-600 dark:text-gray-300">
              Connect With Us
            </h4>
            <div className="flex gap-4">
              {content.contact_linkedin_url && (
                <a
                  href={content.contact_linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-orange transition-colors"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={22} />
                </a>
              )}
              {content.contact_instagram_url && (
                <a
                  href={content.contact_instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-orange transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram size={22} />
                </a>
              )}
              {content.contact_whatsapp_number && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-orange transition-colors"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp size={22} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          &copy; {content.footer_copyright || `${new Date().getFullYear()} Aidia Talks. A Kollint Ventures Ltd initiative.`}
        </div>
      </div>
    </footer>
  )
}
