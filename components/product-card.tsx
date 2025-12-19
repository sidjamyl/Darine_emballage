'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useCart } from '@/lib/cart-context';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ProductVariant {
  id: string;
  nameFr: string;
  nameAr: string;
  priceAdjustment: number;
}

interface Product {
  id: string;
  nameFr: string;
  nameAr: string;
  descriptionFr: string;
  descriptionAr: string;
  price: number;
  type: 'FOOD' | 'PACKAGING';
  image: string;
  hasVariants: boolean;
  variants?: ProductVariant[];
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { locale, t } = useLanguage();
  const { addItem } = useCart();
  const [showVariantDialog, setShowVariantDialog] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [actionType, setActionType] = useState<'cart' | 'order'>('cart');

  const name = locale === 'ar' ? product.nameAr : product.nameFr;
  const description = locale === 'ar' ? product.descriptionAr : product.descriptionFr;
  const typeLabel = product.type === 'FOOD' ? t.products.food : t.products.packaging;

  const handleAddToCart = () => {
    if (product.hasVariants && product.variants && product.variants.length > 0) {
      setActionType('cart');
      setShowVariantDialog(true);
    } else {
      addToCartDirect();
    }
  };

  const handleOrderNow = () => {
    if (product.hasVariants && product.variants && product.variants.length > 0) {
      setActionType('order');
      setShowVariantDialog(true);
    } else {
      orderNowDirect();
    }
  };

  const addToCartDirect = () => {
    addItem({
      productId: product.id,
      productName: name,
      quantity: 1,
      unitPrice: product.price,
      image: product.image,
    });
    toast.success(t.products.addToCart);
  };

  const orderNowDirect = () => {
    addItem({
      productId: product.id,
      productName: name,
      quantity: 1,
      unitPrice: product.price,
      image: product.image,
    });
    window.location.href = '/cart';
  };

  const handleConfirmVariant = () => {
    if (!selectedVariant) return;

    const variant = product.variants?.find((v) => v.id === selectedVariant);
    if (!variant) return;

    const variantName = locale === 'ar' ? variant.nameAr : variant.nameFr;
    const finalPrice = product.price + variant.priceAdjustment;

    addItem({
      productId: product.id,
      productName: name,
      variantName,
      quantity,
      unitPrice: finalPrice,
      image: product.image,
    });

    setShowVariantDialog(false);
    setSelectedVariant('');
    setQuantity(1);

    if (actionType === 'order') {
      window.location.href = '/cart';
    } else {
      toast.success(t.products.addToCart);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.image}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-[#F8A6B0] text-white px-3 py-1 rounded-full text-sm">
            {typeLabel}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2" style={{ color: '#383738' }}>
            {name}
          </h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
          <p className="text-xl font-bold" style={{ color: '#F8A6B0' }}>
            {product.price.toFixed(2)} DA
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col gap-2">
          <Button
            onClick={handleAddToCart}
            className="w-full"
            style={{ backgroundColor: '#F8A6B0' }}
          >
            {t.products.addToCart}
          </Button>
          <Button
            onClick={handleOrderNow}
            variant="outline"
            className="w-full"
          >
            {t.products.orderNow}
          </Button>
        </CardFooter>
      </Card>

      {/* Variant Selection Dialog */}
      <Dialog open={showVariantDialog} onOpenChange={setShowVariantDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.products.selectVariant}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t.products.selectVariant}</Label>
              <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder={t.products.selectVariant} />
                </SelectTrigger>
                <SelectContent>
                  {product.variants?.map((variant) => {
                    const variantName = locale === 'ar' ? variant.nameAr : variant.nameFr;
                    const variantPrice = product.price + variant.priceAdjustment;
                    return (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variantName} - {variantPrice.toFixed(2)} DA
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t.products.quantity}</Label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVariantDialog(false)}>
              {t.common.cancel}
            </Button>
            <Button
              onClick={handleConfirmVariant}
              disabled={!selectedVariant}
              style={{ backgroundColor: '#F8A6B0' }}
            >
              {actionType === 'order' ? t.products.orderNow : t.products.addToCart}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
