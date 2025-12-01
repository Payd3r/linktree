import React, { useEffect, useMemo, useState } from 'react'
import { ProfileHeader } from './components/ProfileHeader'
import { NavigationTabs } from './components/NavigationTabs'
import { ProductCard } from './components/ProductCard'
import { AffiliateCard } from './components/AffiliateCard'
import { Footer } from './components/Footer'
import type { Product as BackendProduct, ProductSection, ProductCategory } from './shared/productTypes'

const App = () => {
  const [activeTab, setActiveTab] = useState('Best Selling')
  const [backendProducts, setBackendProducts] = useState<BackendProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/products')
        if (!res.ok) throw new Error(`Errore caricamento products (${res.status})`)
        const data = await res.json()
        if (!data.success) throw new Error(data.error || 'Errore caricamento products')
        setBackendProducts(data.products || [])
      } catch (e) {
        console.error(e)
        setError(e instanceof Error ? e.message : 'Errore nel caricamento dei products')
      } finally {
        setLoading(false)
      }
    }

    void fetchProducts()
  }, [])

  const getSectionKey = (tab: string): string => {
    const map: { [key: string]: string } = {
      'Best Selling': 'bestSelling',
      'Free Guides': 'freeGuides',
      Blog: 'blog'
    }
    return map[tab] || 'bestSelling'
  }

  const sectionData = useMemo(() => {
    const sectionKey = getSectionKey(activeTab) as ProductSection | 'bestSelling'

    if (sectionKey === 'bestSelling') {
      const guides = backendProducts.filter(
        p => p.section === 'bestselling' && (p.category as ProductCategory | undefined) === 'guides'
      )
      const coaching = backendProducts.filter(
        p =>
          p.section === 'bestselling' && (p.category as ProductCategory | undefined) === 'coaching'
      )
      const affiliates = backendProducts.filter(
        p =>
          p.section === 'bestselling' && (p.category as ProductCategory | undefined) === 'affiliates'
      )
      return { guides, coaching, affiliates }
    }

    if (sectionKey === 'freeGuides') {
      const items = backendProducts.filter(p => p.section === 'freeguides')
      return { items }
    }

    if (sectionKey === 'blog') {
      const items = backendProducts.filter(p => p.section === 'blog')
      return { items }
    }

    return { items: [] as BackendProduct[] }
  }, [activeTab, backendProducts])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="mb-8 animate-fade-up text-center py-20">
          <p className="text-gray-500">Caricamento prodotti...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="mb-8 animate-fade-up text-center py-20">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )
    }

    if (activeTab === 'Best Selling') {
      const { guides, coaching, affiliates } = sectionData as {
        guides: BackendProduct[]
        coaching: BackendProduct[]
        affiliates: BackendProduct[]
      }

      return (
        <>
          {guides.length > 0 && (
            <div className="mb-12 animate-fade-up" style={{ animationDelay: '200ms' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-6 pl-1 border-l-4 border-black">
                Guide
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guides.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${250 + index * 60}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {coaching.length > 0 && (
            <div className="mb-12 animate-fade-up" style={{ animationDelay: '260ms' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-6 pl-1 border-l-4 border-black">
                Coaching
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coaching.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${320 + index * 60}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {affiliates.length > 0 && (
            <div className="mb-8 animate-fade-up" style={{ animationDelay: '320ms' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-6 pl-1 border-l-4 border-black">
                Affiliate Link
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {affiliates.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${380 + index * 60}ms` }}
                  >
                    <AffiliateCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )
    } else {
      const { items } = sectionData as { items: BackendProduct[] }

      if (items.length === 0) {
        return (
          <div className="mb-8 animate-fade-up text-center py-20">
            <p className="text-gray-500">
              Nessun contenuto disponibile per questa sezione.
            </p>
          </div>
        )
      }

      return (
        <div className="mb-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${260 + index * 60}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full bg-white flex-1 relative shadow-sm flex flex-col">
        <ProfileHeader />

        <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
          <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="px-4 md:px-8 pb-10 flex-1">{renderContent()}</div>
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default App


