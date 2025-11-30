import { Product } from '../types';

export interface ProductsData {
  sections: {
    bestSelling: {
      guides: Product[];
      coaching: Product[];
      affiliates: Product[];
    };
    freeGuides: Product[];
    blog: Product[];
  };
}

declare const productsData: ProductsData;
export default productsData;
