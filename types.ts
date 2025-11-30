export interface Product {
  id: string;
  title: string;
  description?: string;
  originalPrice?: number;
  price?: number;
  image: string;
  ctaText: string;
  layout: 'left' | 'right';
  isPremium?: boolean;
}