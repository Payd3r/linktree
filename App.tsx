import React, { useState } from 'react';
import { ProfileHeader } from './components/ProfileHeader';
import { NavigationTabs } from './components/NavigationTabs';
import { ProductCard } from './components/ProductCard';
import { AffiliateCard } from './components/AffiliateCard';
import { Footer } from './components/Footer';
import { Product } from './types';
import productsData from './data/products.json';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Best Selling');

  // Mappa il nome del tab alla chiave della sezione
  const getSectionKey = (tab: string): string => {
    const map: { [key: string]: string } = {
      'Best Selling': 'bestSelling',
      'Free Guides': 'freeGuides',
      'Blog': 'blog'
    };
    return map[tab] || 'bestSelling';
  };

  // Ottieni i prodotti della sezione corrente
  const getCurrentSectionData = () => {
    const sectionKey = getSectionKey(activeTab);
    
    if (sectionKey === 'bestSelling') {
      return {
        guides: productsData.sections.bestSelling.guides as Product[],
        coaching: productsData.sections.bestSelling.coaching as Product[],
        affiliates: productsData.sections.bestSelling.affiliates as Product[]
      };
    } else if (sectionKey === 'freeGuides') {
      return { items: productsData.sections.freeGuides as Product[] };
    } else if (sectionKey === 'blog') {
      return { items: productsData.sections.blog as Product[] };
    } else {
      return { items: [] as Product[] };
    }
  };

  const sectionData = getCurrentSectionData();

  const renderContent = () => {
    if (activeTab === 'Best Selling') {
      const { guides, coaching, affiliates } = sectionData as { guides: Product[], coaching: Product[], affiliates: Product[] };
      
      return (
        <>
          {/* --- SEZIONE 1: GUIDE --- */}
          {guides.length > 0 && (
            <div className="mb-12 animate-fade-up" style={{ animationDelay: '700ms' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-6 pl-1 border-l-4 border-black">Guide</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guides.map((product, index) => (
                  <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${800 + (index * 100)}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- SEZIONE 2: COACHING --- */}
          {coaching.length > 0 && (
            <div className="mb-12 animate-fade-up" style={{ animationDelay: '900ms' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-6 pl-1 border-l-4 border-black">Coaching</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coaching.map((product, index) => (
                  <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${1000 + (index * 100)}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- SEZIONE 3: AFFILIATE LINK --- */}
          {affiliates.length > 0 && (
            <div className="mb-8 animate-fade-up" style={{ animationDelay: '1100ms' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-6 pl-1 border-l-4 border-black">Affiliate Link</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {affiliates.map((product, index) => (
                  <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${1200 + (index * 100)}ms` }}>
                    <AffiliateCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      );
    } else {
      // Per Free Guides e Blog
      const { items } = sectionData as { items: Product[] };
      
      if (items.length === 0) {
        return (
          <div className="mb-8 animate-fade-up text-center py-20">
            <p className="text-gray-500">Nessun contenuto disponibile per questa sezione.</p>
          </div>
        );
      }

      return (
        <div className="mb-8 animate-fade-up" style={{ animationDelay: '700ms' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((product, index) => (
              <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${800 + (index * 100)}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Container - Centered and responsive */}
      <div className="w-full bg-white flex-1 relative shadow-sm flex flex-col">
        
        <ProfileHeader />
        
        <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
          <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="px-4 md:px-8 pb-10 flex-1">
            {renderContent()}
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default App;