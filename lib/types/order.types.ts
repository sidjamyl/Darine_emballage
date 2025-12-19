/**
 * Order Type Definitions
 * 
 * Type definitions for orders and order items.
 */

/**
 * Order status values
 */
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'DELIVERED';

/**
 * Order item
 */
export interface OrderItem {
  id: string;
  productName: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

/**
 * Complete order
 */
export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  wilaya: string;
  municipality: string;
  deliveryType: string;
  shippingCost: number;
  subtotal: number;
  total: number;
  status: OrderStatus;
  trackingNumber?: string;
  createdAt: string;
  items: OrderItem[];
}

/**
 * Customer information
 */
export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  wilayaId: string;
  municipalityId: string;
  deliveryType: 'home' | 'stopdesk';
}
