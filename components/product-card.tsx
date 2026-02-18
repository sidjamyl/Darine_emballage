'use client';



import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { ProductWithVariants } from '@/lib/types/product.types';
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

interface ProductCardProps {
  product: ProductWithVariants;
}

export function ProductCard({ product }: ProductCardProps) {
  const { locale, t } = useLanguage();
  const { addItem, openCart } = useCart();
  const [showVariantDialog, setShowVariantDialog] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const name = locale === 'ar' ? product.nameAr : product.nameFr;
  const description = locale === 'ar' ? product.descriptionAr : product.descriptionFr;
  const typeLabel = product.type === 'FOOD' ? t.products.food : t.products.packaging;
  const isNew = product.newUntil && new Date(product.newUntil) > new Date();

  // Need to add translation for "New" if not exists, fallback to hardcoded for now or use key
  const newLabel = locale === 'ar' ? 'جديد' : 'Nouveau';

  const handleAddToCart = () => {
    if (product.hasVariants && product.variants && product.variants.length > 0) {
      setShowVariantDialog(true);
    } else {
      addToCartDirect();
    }
  };

  const addToCartDirect = () => {
    addItem({
      productId: product.id,
      productName: name,
      quantity: quantity,
      unitPrice: product.price,
      image: product.image,
    });
    setQuantity(1);
    toast.success(t.products.addToCart);
    openCart();
  };

  const handleConfirmVariant = () => {
    if (!selectedVariant) return;

    let variantName = '';
    let finalPrice = 0;

    if (selectedVariant === 'base') {
      // Produit de base
      variantName = locale === 'ar' ? 'قياسي' : 'Standard';
      finalPrice = product.price;
    } else {
      // Variante spécifique
      const variant = product.variants?.find((v) => v.id === selectedVariant);
      if (!variant) return;
      variantName = locale === 'ar' ? variant.nameAr : variant.nameFr;
      finalPrice = variant.priceAdjustment;
    }

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
    toast.success(t.products.addToCart);
    openCart();
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow relative">
        <Link href={`/catalog/${product.id}`} className="block relative h-36 md:h-48 overflow-hidden group">
          <img
            src={product.image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {/* Type badge - bottom right */}
          <div className="absolute bottom-1.5 right-1.5 md:bottom-2 md:right-2 bg-[var(--brand-pink)] text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-sm font-medium z-10 shadow-sm">
            {typeLabel}
          </div>

          {/* Left badges stack (promo + new) - top left */}
          <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 z-10 flex flex-col gap-1">
            {product.ribbonText && (
              <div className="bg-red-600 text-white px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-bold rounded-md shadow-md">
                {product.ribbonText}
              </div>
            )}
            {isNew && (
              <div className="bg-green-500 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-md text-[10px] md:text-sm font-bold shadow-md animate-pulse">
                {newLabel}
              </div>
            )}
          </div>
        </Link>
        <CardContent className="p-2.5 md:p-4">
          <Link href={`/catalog/${product.id}`}>
            <h3 className="font-bold text-sm md:text-xl mb-1 md:mb-2 hover:text-[var(--brand-pink)] transition-colors line-clamp-2" style={{ color: '#383738' }}>
              {name}
            </h3>
          </Link>
          <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-4 line-clamp-2 min-h-[32px] md:min-h-[40px]">{description}</p>
          <p className="text-lg md:text-2xl font-bold" style={{ color: 'var(--brand-pink)' }}>
            {product.price.toFixed(0)} DA
          </p>
        </CardContent>
        <CardFooter className="p-2.5 md:p-4 pt-0 flex flex-col gap-2 md:gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center w-full gap-1 md:gap-2 bg-gray-50 rounded-lg p-0.5 md:p-1 border">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 md:h-8 md:w-8 rounded-md"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </Button>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="h-7 md:h-8 text-center border-none bg-transparent focus-visible:ring-0 px-0 text-sm"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 md:h-8 md:w-8 rounded-md"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full text-white font-medium cursor-pointer text-xs md:text-sm h-8 md:h-10"
            style={{ backgroundColor: 'var(--brand-pink)' }}
          >
            {t.products.addToCart}
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
                  {/* Produit de base */}
                  <SelectItem key="base" value="base">
                    {locale === 'ar' ? 'قياسي' : 'Standard'} - {product.price.toFixed(0)} DA
                  </SelectItem>
                  {/* Variantes */}
                  {product.variants?.map((variant) => {
                    const variantName = locale === 'ar' ? variant.nameAr : variant.nameFr;
                    const variantPrice = variant.priceAdjustment;
                    // Ensure ID exists (it should for DB products)
                    const vId = variant.id || 'unknown';
                    return (
                      <SelectItem key={vId} value={vId}>
                        {variantName} - {variantPrice.toFixed(0)} DA
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
              style={{ backgroundColor: 'var(--brand-pink)' }}
            >
              {t.products.addToCart}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
