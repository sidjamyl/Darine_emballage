/**
 * Product Card Admin Component
 * 
 * Displays a product in the admin panel with edit and delete actions.
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductCardAdminProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductCardAdmin({ product, onEdit, onDelete }: ProductCardAdminProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <img
          src={product.image}
          alt={product.nameFr}
          className="w-full h-48 object-cover rounded mb-4"
        />
        <h3 className="font-semibold mb-2">{product.nameFr}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.nameAr}</p>
        <p className="font-bold mb-4" style={{ color: '#F8A6B0' }}>
          {product.price.toFixed(2)} DA
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(product)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
