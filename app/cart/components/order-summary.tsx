/**
 * Order Summary Component
 * 
 * Displays order totals and checkout button.
 */

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OrderSummaryProps {
  subtotal: number;
  shippingCost: number;
  total: number;
  canCheckout: boolean;
  isSubmitting: boolean;
  onCheckout: () => void;
  t: any;
}

export function OrderSummary({
  subtotal,
  shippingCost,
  total,
  canCheckout,
  isSubmitting,
  onCheckout,
  t
}: OrderSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.cart.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{t.cart.subtotal}</span>
            <span className="font-semibold">{subtotal.toFixed(2)} DA</span>
          </div>
          <div className="flex justify-between">
            <span>{t.cart.shipping}</span>
            <span className="font-semibold">{shippingCost.toFixed(2)} DA</span>
          </div>
          <div className="border-t pt-2 flex justify-between text-lg font-bold">
            <span>{t.cart.total}</span>
            <span style={{ color: '#F8A6B0' }}>{total.toFixed(2)} DA</span>
          </div>
        </div>

        <Button
          onClick={onCheckout}
          disabled={!canCheckout || isSubmitting}
          className="w-full mt-4"
          style={{ backgroundColor: '#F8A6B0' }}
        >
          {isSubmitting ? t.common.loading : t.cart.checkout}
        </Button>

        {!canCheckout && (
          <p className="text-sm text-red-500 mt-2 text-center">
            {t.cart.fillInfo}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
