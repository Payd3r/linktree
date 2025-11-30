import React from 'react';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = ['Best Selling', 'Free Guides', 'Blog'];

  return (
    <div className="w-full flex justify-center gap-2 mb-10 px-4 animate-fade-up" style={{ animationDelay: '600ms' }}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 shadow-sm active:scale-95 ${
            activeTab === tab
              ? 'bg-black text-white'
              : 'bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};