import { motion } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'
import { useSiteContent } from '../hooks/useSupabase'
import ContactForm from '../components/contact/ContactForm'

export default function ContactPage() {
  useSEO({
    title: 'Contact Aidia Talks | Partner With Us',
    description: 'Get in touch with Aidia Talks. Invite us to your university, partner with us, or make a donation.',
  })

  const { content } = useSiteContent(['contact_heading', 'contact_subheading'])

  return (
    <div className="pt-24 pb-20 bg-white dark:bg-[#0f172a] transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-navy dark:text-white mb-4">
            {content.contact_heading || 'Get in Touch'}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {content.contact_subheading || 'Have a question, want to partner, or invite us to your university? Reach out!'}
          </p>
        </motion.div>

        <ContactForm />
      </div>
    </div>
  )
}
