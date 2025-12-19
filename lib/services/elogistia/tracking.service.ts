/**
 * Elogistia Tracking Service
 * 
 * Service for tracking order delivery status.
 */

import { TrackingStatus } from '@/lib/types';
import { ELOGISTIA_API_KEY, ELOGISTIA_BASE_URL } from './config';

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
