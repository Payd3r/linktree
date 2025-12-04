import React from 'react'
import type { Product } from '../shared/productTypes'
import { ExternalLink } from 'lucide-react'

interface AffiliateCardProps {
  product: Product
}

const truncateDescription = (text: string | undefined, maxLength: number = 100): string => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export const AffiliateCard = ({ product }: AffiliateCardProps) => {
  const truncatedDescription = truncateDescription(product.description, 100)

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center h-24 w-full cursor-pointer border border-gray-100 group active:scale-[0.99]">
      <div className="h-full w-24 flex-shrink-0 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex-1 px-4 py-2 flex justify-between items-center min-w-0">
        <div className="pr-4 min-w-0 flex-1">
          <h3 className="text-gray-900 font-semibold text-sm sm:text-base leading-tight line-clamp-1">
            {product.title}
          </h3>
          {product.description && (
            <p className="text-gray-400 text-xs mt-1 line-clamp-1 hidden sm:block">
              {truncatedDescription}
            </p>
          )}
        </div>

        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 bg-gray-50 text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ExternalLink size={18} />
        </a>
      </div>
    </div>
  )
}



