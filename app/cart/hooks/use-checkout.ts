/**
 * Use Checkout Hook
 * 
 * Custom hook for handling checkout logic and order submission.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CustomerInfo, CartItem, Wilaya, Municipality } from '@/lib/types';

export function useCheckout(
  items: CartItem[],
  clearCart: () => void,
  locale: string,
  t: any
) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async (
    customerInfo: CustomerInfo,
    selectedWilaya: Wilaya | undefined,
    selectedMunicipality: Municipality | undefined,
    shippingCost: number,
    subtotal: number,
    total: number
  ) => {
    const canCheckout =
      items.length > 0 &&
      customerInfo.fullName &&
      customerInfo.phone &&
      customerInfo.address &&
      customerInfo.wilayaId &&
      customerInfo.municipalityId;

    if (!canCheckout) {
      toast.error(t.cart.fillInfo);
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      customerName: customerInfo.fullName,
      customerPhone: customerInfo.phone,
      customerEmail: customerInfo.email,
      address: customerInfo.address,
      wilayaId: customerInfo.wilayaId,
      wilaya: selectedWilaya?.wilayaLabel  || '',
      municipalityId: customerInfo.municipalityId,
      municipality: selectedMunicipality?.name || '',
      deliveryType: customerInfo.deliveryType.toUpperCase(),
      shippingCost,
      subtotal,
      total,
      items: items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        variantName: item.variantName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      })),
    };

    console.log('=== SENDING ORDER ===');
    console.log('Order data:', orderData);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        clearCart();
        toast.success(
          locale === 'ar'
            ? 'تم إرسال طلبك بنجاح! سنتصل بك قريباً'
            : 'Votre commande a été envoyée avec succès! Nous vous contacterons bientôt'
        );
        router.push('/');
      } else {
        toast.error(t.common.error);
      }
    } catch (error) {
      toast.error(t.common.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleCheckout,
  };
}
