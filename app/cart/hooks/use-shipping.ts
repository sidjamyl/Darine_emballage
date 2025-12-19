/**
 * Use Shipping Hook
 * 
 * Custom hook for managing shipping-related state and API calls.
 */

'use client';

import { useState, useEffect } from 'react';
import { Wilaya, Municipality, ShippingCost } from '@/lib/types';
import { toast } from 'sonner';

export function useShipping(wilayaId: string, t: any) {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [shippingCosts, setShippingCosts] = useState<ShippingCost[]>([]);

  // Fetch wilayas on mount
  useEffect(() => {
    fetch('/api/elogistia/wilayas')
      .then((res) => res.json())
      .then((data) => {
        console.log('=== WILAYAS API RESPONSE ===');
        console.log('Full data:', data);
        console.log('Data.body:', data.body);
        console.log('ItemCount:', data.itemCount);
        setWilayas(data);
      })
      .catch(() => toast.error(t.common.error));
  }, []);

  // Fetch municipalities when wilaya changes
  useEffect(() => {
    if (wilayaId) {
      console.log('Fetching municipalities for wilaya:', wilayaId);
      fetch(`/api/elogistia/municipalities/${wilayaId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('Municipalities received:', data);
          setMunicipalities(data);
        })
        .catch((error) => {
          console.error('Error fetching municipalities:', error);
          toast.error(t.common.error);
        });
    } else {
      setMunicipalities([]);
    }
  }, [wilayaId]);

  // Fetch shipping costs on mount
  useEffect(() => {
    fetch('/api/elogistia/shipping-costs/')
      .then((res) => res.json())
      .then((data) => {
        console.log('Shipping costs received:', data);
        console.log('Shipping costs body:', data);
        setShippingCosts(data);
      })
      .catch((error) => {
        console.error('Error fetching shipping costs:', error);
        toast.error(t.common.error);
      });
  }, []);

  return {
    wilayas,
    municipalities,
    shippingCosts,
  };
}
