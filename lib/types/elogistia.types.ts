/**
 * Elogistia Type Definitions
 * 
 * Type definitions for Elogistia delivery service API integration.
 * Includes types for wilayas, municipalities, shipping, and tracking.
 */

/**
 * Wilaya (Province) with shipping costs
 */
export interface Wilaya {
  wilayaLabel: string;
  wilayaID: string;
  home: string;
  stopdesk: string;
}

/**
 * Municipality within a wilaya
 */
export interface Municipality {
  Id: string;
  name: string;
  wilaya: string;
}

/**
 * Shipping cost information
 */
export interface ShippingCost {
  wilayaID: string;
  wilayaLabel: string;
  home: string;
  stopdesk: string;
}

/**
 * Order tracking status
 */
export interface TrackingStatus {
  tracking: string;
  status: string;
  history?: Array<{
    date: string;
    status: string;
    location?: string;
  }>;
}

/**
 * Delivery type options
 */
export type DeliveryType = 'home' | 'stopdesk';
export type DeliveryTypeUpper = 'HOME' | 'STOPDESK';

/**
 * Order data for Elogistia API
 */
export interface CreateElogistiaOrderData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  wilayaId: string;
  municipality: string;
  deliveryType: DeliveryTypeUpper;
  shippingCost: number;
  products: Array<{ name: string; price: number }>;
  notes?: string;
  orderNumber: string;
}

/**
 * Response from Elogistia order creation
 */
export interface CreateElogistiaOrderResponse {
  success: boolean;
  trackingNumber?: string;
  error?: string;
  response?: any;
}
