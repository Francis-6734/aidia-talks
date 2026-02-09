import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { HiOutlineSpeakerphone, HiOutlinePhotograph, HiOutlinePencilAlt, HiOutlineMail, HiOutlineLogout, HiOutlineAcademicCap, HiOutlineViewGrid } from 'react-icons/hi'
import TalksManager from './TalksManager'
import FeaturesManager from './FeaturesManager'
import ContentManager from './ContentManager'
import MessagesManager from './MessagesManager'
import PartnersManager from './PartnersManager'
import HeroImagesManager from './HeroImagesManager'

const tabs = [
  { id: 'talks', label: 'Talks', icon: HiOutlineSpeakerphone },
  { id: 'hero', label: 'Hero Images', icon: HiOutlineViewGrid },
  { id: 'partners', label: 'Universities', icon: HiOutlineAcademicCap },
  { id: 'features', label: 'Features / Blog', icon: HiOutlinePhotograph },
  { id: 'content', label: 'Site Content', icon: HiOutlinePencilAlt },
  { id: 'messages', label: 'Messages', icon: HiOutlineMail },
]

export default function AdminLayout() {
  const { signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('talks')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] pt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-display font-bold text-navy dark:text-white">Admin Dashboard</h1>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            <HiOutlineLogout size={18} />
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-orange text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Active Panel */}
        {activeTab === 'talks' && <TalksManager />}
        {activeTab === 'hero' && <HeroImagesManager />}
        {activeTab === 'partners' && <PartnersManager />}
        {activeTab === 'features' && <FeaturesManager />}
        {activeTab === 'content' && <ContentManager />}
        {activeTab === 'messages' && <MessagesManager />}
      </div>
    </div>
  )
}
