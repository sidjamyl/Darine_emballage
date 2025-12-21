/**
 * Products Grid Component
 * 
 * Grid display for products with empty state.
 */

'use client';

import { ProductCard } from '@/components/product-card';
import { ProductWithVariants } from '@/lib/types/product.types';

interface ProductsGridProps {
  products: ProductWithVariants[];
  t: any;
}

export function ProductsGrid({ products, t }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">{t.products.noProducts}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}