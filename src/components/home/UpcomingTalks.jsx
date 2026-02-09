import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineUser } from 'react-icons/hi'
import { useTable } from '../../hooks/useSupabase'

function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetDate))
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  if (timeLeft.total <= 0) {
    return <span className="text-orange font-semibold text-sm">Happening now!</span>
  }

  return (
    <div className="flex gap-3">
      {[
        { val: timeLeft.days, label: 'Days' },
        { val: timeLeft.hours, label: 'Hrs' },
        { val: timeLeft.minutes, label: 'Min' },
        { val: timeLeft.seconds, label: 'Sec' },
      ].map(unit => (
        <div key={unit.label} className="text-center">
          <div className="bg-navy dark:bg-navy-light text-white font-display font-bold text-lg w-12 h-12 rounded-lg flex items-center justify-center">
            {String(unit.val).padStart(2, '0')}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">{unit.label}</span>
        </div>
      ))}
    </div>
  )
}

function calcTimeLeft(targetDate) {
  const diff = new Date(targetDate) - new Date()
  if (diff <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function UpcomingTalks() {
  const { data: talks, loading } = useTable('talks', {
    orderBy: 'date',
    ascending: true,
    filters: { talk_type: 'upcoming', is_published: true },
  })

  if (loading || talks.length === 0) return null

  return (
    <section className="py-10 md:py-20 bg-gray-50 dark:bg-navy-dark transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-navy dark:text-white">
            Upcoming Talks
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Join us at our next events across Kenyan universities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {talks.map((talk, i) => (
            <motion.div
              key={talk.id}
              className="bg-white dark:bg-navy rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-display font-bold text-navy dark:text-white">{talk.title}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <HiOutlineCalendar className="text-orange" />
                      {new Date(talk.date).toLocaleDateString('en-KE', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <HiOutlineLocationMarker className="text-orange" />
                      {talk.institution}
                    </p>
                    {talk.speaker && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <HiOutlineUser className="text-orange" />
                        {talk.speaker}
                      </p>
                    )}
                  </div>
                  {talk.summary && (
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{talk.summary}</p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <Countdown targetDate={talk.date} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
