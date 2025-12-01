export type ProductSection = 'bestselling' | 'freeguides' | 'blog'

export type ProductCategory = 'guides' | 'coaching' | 'affiliates'

export type Product = {
  id: string
  section: ProductSection
  category?: ProductCategory
  title: string
  description: string
  priceStart: number
  priceEnd: number
  link: string
  image: string
  ctaText: string
  layout: 'left' | 'right'
  createdAt: string
  updatedAt: string
}
