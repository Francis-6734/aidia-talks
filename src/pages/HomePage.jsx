import { useSEO } from '../hooks/useSEO'
import Hero from '../components/home/Hero'
import UniversityMarquee from '../components/home/UniversityMarquee'
import StatsCounter from '../components/home/StatsCounter'
import Testimonial from '../components/home/Testimonial'
import AidiaProcess from '../components/home/AidiaProcess'
import UpcomingTalks from '../components/home/UpcomingTalks'
import DonationCallout from '../components/home/DonationCallout'

export default function HomePage() {
  useSEO({
    title: 'Aidia Talks Kenya | From Classroom Projects to Market Products',
    description: 'Aidia Talks connects university innovators with industry mentors, transforming academic ideas into real-world solutions across Kenya. A Kollint Ventures initiative.',
  })

  return (
    <>
      <Hero />
      <UniversityMarquee />
      <StatsCounter />
      <Testimonial />
      <AidiaProcess />
      <UpcomingTalks />
      <DonationCallout />
    </>
  )
}
