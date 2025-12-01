import React from 'react'
import type { Product } from '../shared/productTypes'

interface ProductCardProps {
  product: Product
}

const truncateDescription = (text: string | undefined, maxLength: number = 120): string => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const isImageLeft = product.layout === 'left'
  const truncatedDescription = truncateDescription(product.description, 120)

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-row min-h-[17rem] h-[17rem] w-full cursor-pointer group border border-gray-100">
      <div
        className={`relative w-[35%] sm:w-[40%] overflow-hidden flex-shrink-0 ${
          isImageLeft ? 'order-1' : 'order-2'
        }`}
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      <div
        className={`flex-1 p-5 flex flex-col justify-between overflow-hidden min-h-0 ${
          isImageLeft ? 'order-2' : 'order-1'
        }`}
      >
        <div className="min-w-0 flex-shrink">
          <h3 className="text-gray-900 font-bold text-lg leading-tight mb-2 line-clamp-2">
            {product.title}
          </h3>

          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-3">
            {truncatedDescription}
          </p>
        </div>

        <div className="flex-shrink-0">
          {(product.priceStart !== undefined || product.priceEnd !== undefined) && (
            <div className="flex items-baseline gap-2 mb-3">
              {product.priceStart !== undefined && product.priceEnd !== undefined ? (
                <>
                  <span className="text-gray-400 text-sm line-through decoration-gray-400 decoration-1">
                    €{product.priceStart.toFixed(2)}
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    €{product.priceEnd.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  €{(product.priceEnd ?? product.priceStart ?? 0).toFixed(2)}
                </span>
              )}
            </div>
          )}
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center bg-black text-white font-medium py-2.5 rounded-lg text-sm hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
          >
            {product.ctaText || 'Scopri di più'}
          </a>
        </div>
      </div>
    </div>
  )
}



