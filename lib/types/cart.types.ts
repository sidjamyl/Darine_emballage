/**
 * Cart Type Definitions
 * 
 * Type definitions for shopping cart functionality.
 */

/**
 * Cart item
 */
export interface CartItem {
  productId: string;
  productName: string;
  productNameFr?: string;
  productNameAr?: string;
  image: string;
  variantId?: string;
  variantName?: string;
  variantNameFr?: string;
  variantNameAr?: string;
  unitPrice: number;
  quantity: number;
}
