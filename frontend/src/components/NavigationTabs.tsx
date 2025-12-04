import React from 'react'

interface NavigationTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export const NavigationTabs = ({ activeTab, onTabChange }: NavigationTabsProps) => {
  const tabs = ['Best Selling', 'Free Guides', 'Blog', 'Portfolio']

  return (
    <div
      className="w-full grid grid-cols-2 md:flex md:justify-center gap-2 mb-10 px-4 animate-fade-up"
      style={{ animationDelay: '180ms' }}
    >
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 shadow-sm active:scale-95 cursor-pointer ${
            activeTab === tab
              ? 'bg-black text-white'
              : 'bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}



