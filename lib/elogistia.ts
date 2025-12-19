export type { 
  Wilaya, 
  Municipality, 
  TrackingStatus,
  ShippingCost,
  DeliveryType,
  DeliveryTypeUpper,
  CreateElogistiaOrderData,
  CreateElogistiaOrderResponse
} from './types';

// Re-export services for backward compatibility
export {
  getWilayasWithCosts,
  getshippingCosts,
  calculateShippingCost
} from './services/elogistia/wilayas.service';

export { getMunicipalities } from './services/elogistia/municipalities.service';

export { 
  getTracking,
  trackingStatuses 
} from './services/elogistia/tracking.service';

export { createElogistiaOrder } from './services/elogistia/orders.service';

