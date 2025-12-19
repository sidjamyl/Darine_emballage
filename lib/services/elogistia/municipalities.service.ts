/**
 * Elogistia Municipalities Service
 * 
 * Service for fetching municipalities within wilayas.
 */

import { Municipality } from '@/lib/types';
import { ELOGISTIA_API_KEY, ELOGISTIA_BASE_URL } from './config';

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
