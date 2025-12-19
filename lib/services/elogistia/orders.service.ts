/**
 * Elogistia Orders Service
 * 
 * Service for creating orders in the Elogistia system.
 */

import { CreateElogistiaOrderData, CreateElogistiaOrderResponse } from '@/lib/types';
import { ELOGISTIA_API_KEY, ELOGISTIA_BASE_URL } from './config';

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
export async function createElogistiaOrder(orderData: CreateElogistiaOrderData): Promise<CreateElogistiaOrderResponse> {
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
