/**
 * Cart Item Card Component
 * 
 * Displays a single cart item with image, details, and quantity controls.
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { QuantityInput } from '@/components/ui/quantity-input';
import { CartItem } from '@/lib/types';

interface CartItemCardProps {
  item: CartItem;
  onRemove: (productId: string, variantName?: string) => void;
  onUpdateQuantity: (productId: string, quantity: number, variantName?: string) => void;
}

export function CartItemCard({ item, onRemove, onUpdateQuantity }: CartItemCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img
            src={item.image}
            alt={item.productName}
            className="w-24 h-24 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="font-semibold mb-1" style={{ color: '#383738' }}>
              {item.productName}
            </h3>
            {item.variantName && (
              <p className="text-sm text-gray-600 mb-2">{item.variantName}</p>
            )}
            <p className="font-bold" style={{ color: 'var(--brand-pink)' }}>
              {item.unitPrice.toFixed(0)} DA
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item.productId, item.variantName)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <QuantityInput
              value={item.quantity}
              onChange={(val) =>
                onUpdateQuantity(item.productId, val, item.variantName)
              }
              className="w-20"
            />
            <p className="font-semibold">
              {(item.quantity * item.unitPrice).toFixed(0)} DA
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
