/**
 * Elogistia Wilayas Service
 * 
 * Service for fetching wilayas and shipping costs.
 */

import { Wilaya } from '@/lib/types';
import { ELOGISTIA_API_KEY, ELOGISTIA_BASE_URL } from './config';

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
 * Fetch shipping costs
 */
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
