/**
 * Empty Cart Component
 * 
 * Displays when cart is empty with link to catalog.
 */

'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EmptyCartProps {
  t: any;
}

export function EmptyCart({ t }: EmptyCartProps) {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <ShoppingCart className="h-24 w-24 mx-auto mb-4 text-gray-300" />
        <h1 className="text-3xl font-bold mb-4" style={{ color: '#383738' }}>
          {t.cart.empty}
        </h1>
        <Button
          onClick={() => router.push('/catalog')}
          style={{ backgroundColor: '#F8A6B0' }}
        >
          {t.hero.viewCatalog}
        </Button>
      </div>
    </div>
  );
}
