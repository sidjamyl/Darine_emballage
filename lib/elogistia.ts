// lib/elogistia.ts - Elogistia API Integration

const ELOGISTIA_API_KEY = process.env.ELOGISTIA_API_KEY || '';
const ELOGISTIA_BASE_URL = 'https://api.elogistia.com';

export interface Wilaya {
  wilayaLabel: string;
  wilayaID: string;
  home: string;
  stopdesk: string;
}

export interface Municipality {
  Id: string;
  name: string;
  wilaya: string;
}

export interface TrackingStatus {
  tracking: string;
  status: string;
  history?: Array<{
    date: string;
    status: string;
    location?: string;
  }>;
}

export async function getshippingCosts() {
  try {
    const url = `${ELOGISTIA_BASE_URL}/getShippingCosts/?key=${ELOGISTIA_API_KEY}`;
    console.log('Fetching shipping costs from URL:', url);  
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      console.error('Shipping Costs API response not ok:', response.status, response.statusText);
      const errorText = await response.text();


      console.error('Error response body:', errorText);
      throw new Error('Failed to fetch shipping costs');
    }   
    const data = await response.json();
    console.log('Shipping costs API response:', data);
    return data.body || data;
  } catch (error) {
    console.error('Error fetching shipping costs:', error);
    return [];
  }
}
/**
 * Fetch all wilayas with shipping costs
 */
export async function getWilayasWithCosts(): Promise<Wilaya[]> {
  try {
    const url = `${ELOGISTIA_BASE_URL}/getWilayas/?key=${ELOGISTIA_API_KEY}`;
    console.log('Fetching wilayas from URL:', url);
    
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      console.error('API response not ok:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error('Failed to fetch wilayas');
    }

    const data = await response.json();
    console.log('Elogistia API response:', data);
    return data.body || data;
  } catch (error) {
    console.error('Error fetching wilayas:', error);
    return [];
  }
}

/**
 * Fetch municipalities for a specific wilaya
 */
export async function getMunicipalities(wilayaId: string): Promise<Municipality[]> {
  try {
    const url = `${ELOGISTIA_BASE_URL}/getMunicipalities/?key=${ELOGISTIA_API_KEY}&wilaya=${wilayaId}`;
    console.log('Fetching municipalities from URL:', url);
    
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      console.error('Municipalities API response not ok:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error('Failed to fetch municipalities');
    }

    const data = await response.json();
    console.log('Municipalities API response for wilaya', wilayaId, ':', data);
    return data.body || data;
  } catch (error) {
    console.error('Error fetching municipalities for wilaya', wilayaId, ':', error);
    return [];
  }
}

/**
 * Calculate shipping cost for a wilaya and delivery type
 */
export function calculateShippingCost(
  wilaya: Wilaya | undefined,
  deliveryType: 'home' | 'stopdesk'
): number {
  if (!wilaya) return 0;
  const cost = deliveryType === 'home' ? wilaya.home : wilaya.stopdesk;
  return parseFloat(cost) || 0;
}

/**
 * Get tracking information for an order
 */
export async function getTracking(trackingNumber: string): Promise<TrackingStatus | null> {
  try {
    const response = await fetch(
      `${ELOGISTIA_BASE_URL}/getTracking/?apiKey=${ELOGISTIA_API_KEY}&tracking=${trackingNumber}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch tracking information');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tracking:', error);
    return null;
  }
}

/**
 * Split full name into firstname and lastname
 */
function splitName(fullName: string): { firstname: string; name: string } {
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) {
    return { firstname: parts[0], name: parts[0] };
  }
  const firstname = parts[0];
  const name = parts.slice(1).join(' ');
  return { firstname, name };
}

/**
 * Create an order in Elogistia system
 */
export async function createElogistiaOrder(orderData: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  wilayaId: string;
  municipality: string;
  deliveryType: 'HOME' | 'STOPDESK';
  shippingCost: number;
  products: Array<{ name: string; price: number }>;
  notes?: string;
  orderNumber: string;
}): Promise<{ success: boolean; trackingNumber?: string; error?: string; response?: any }> {
  try {
    const { firstname, name } = splitName(orderData.customerName);
    
    // Build URL with query parameters as per Elogistia API
    const params = new URLSearchParams({
      apiKey: ELOGISTIA_API_KEY,
      name: name,
      firstname: firstname,
      mail: orderData.customerEmail || '',
      phone: orderData.customerPhone,
      address: orderData.address,
      commune: orderData.municipality,
      fraisDeLivraison: orderData.shippingCost.toString(),
      remarque: orderData.notes || '',
      stop_desk: orderData.deliveryType === 'STOPDESK' ? '2' : '1',
      wilaya: orderData.wilayaId,
      product: orderData.products.map(p => p.name).join(','),
      price: orderData.products.map(p => p.price.toString()).join(','),
      modeDeLivraison: '1', // 1 = normal delivery
      IdCommande: orderData.orderNumber,
    });

    const url = `${ELOGISTIA_BASE_URL}/insertCommande/?${params.toString()}`;
    console.log('Creating Elogistia order with URL:', url);

    const response = await fetch(url, {
      method: 'POST',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Elogistia API error:', response.status, errorText);
      throw new Error(`Failed to create order in Elogistia: ${response.status}`);
    }

    const data = await response.json();
    console.log('Elogistia order created:', data);
    
    return {
      success: true,
      trackingNumber: data.trackingNumber || data.tracking,
      response: data,
    };
  } catch (error) {
    console.error('Error creating Elogistia order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Tracking status translations
 */
export const trackingStatuses = {
  fr: {
    'Ramassée': 'Ramassée',
    'Réceptionnée': 'Réceptionnée',
    'À expédiée': 'À expédier',
    'En transit': 'En transit',
    'En hub': 'En hub',
    'En cours livraison': 'En cours de livraison',
    'Livré': 'Livré',
    'Livrée & réglée': 'Livrée & réglée',
    'Suspendue': 'Suspendue',
    'Annulée': 'Annulée',
    'Retour en transit': 'Retour en transit',
    'Retour remis': 'Retour remis',
    'Perdue': 'Perdue',
    'Partiel remis': 'Partiellement remise',
  },
  ar: {
    'Ramassée': 'تم الاستلام',
    'Réceptionnée': 'تم الاستقبال',
    'À expédiée': 'جاهز للإرسال',
    'En transit': 'قيد النقل',
    'En hub': 'في المركز',
    'En cours livraison': 'قيد التوصيل',
    'Livré': 'تم التسليم',
    'Livrée & réglée': 'تم التسليم والدفع',
    'Suspendue': 'معلق',
    'Annulée': 'ملغى',
    'Retour en transit': 'قيد الإرجاع',
    'Retour remis': 'تم الإرجاع',
    'Perdue': 'مفقود',
    'Partiel remis': 'تسليم جزئي',
  },
};
