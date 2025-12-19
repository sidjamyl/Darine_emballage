/**
 * Product Type Definitions
 * 
 * Type definitions for products including variants and filters.
 */

/**
 * Product types in the system
 */
export type ProductType = 'FOOD' | 'PACKAGING';

/**
 * Base product interface
 */
export interface Product {
  id: string;
  nameFr: string;
  nameAr: string;
  descriptionFr: string;
  descriptionAr: string;
  price: number;
  type: ProductType;
  image: string;
  hasVariants: boolean;
  isPopular: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Product variant
 */
export interface ProductVariant {
  id?: string;
  nameFr: string;
  nameAr: string;
  priceAdjustment: number;
  productId?: string;
}

/**
 * Product with variants included
 */
export interface ProductWithVariants extends Product {
  variants?: ProductVariant[];
}

/**
 * Product form data
 */
export interface ProductFormData {
  nameFr: string;
  nameAr: string;
  descriptionFr: string;
  descriptionAr: string;
  price: number;
  type: ProductType;
  image: string;
  hasVariants: boolean;
  isPopular: boolean;
  variants?: ProductVariant[];
}
