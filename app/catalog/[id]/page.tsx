'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

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
    isPinned: boolean;
    ribbonText?: string;
    newUntil?: string;
}

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const { t, locale } = useLanguage();
    const { addItem, openCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<string>('base');

    useEffect(() => {
        if (id) {
            fetch(`/api/products?id=${id}`)
                .then((res) => res.json())
                .then((data) => {
                    if (!data.error) {
                        setProduct(data);
                    }
                })
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;

        const name = locale === 'ar' ? product.nameAr : product.nameFr;
        let variantName = '';
        let finalPrice = product.price;

        if (selectedVariant !== 'base') {
            const variant = product.variants?.find((v) => v.id === selectedVariant);
            if (variant) {
                variantName = locale === 'ar' ? variant.nameAr : variant.nameFr;
                finalPrice = variant.priceAdjustment;
            }
        } else if (locale === 'ar') {
            variantName = 'قياسي'; // Standard
        } else {
            variantName = 'Standard';
        }

        addItem({
            productId: product.id,
            productName: name,
            quantity,
            unitPrice: finalPrice,
            image: product.image,
            variantName: product.hasVariants ? variantName : undefined,
        });

        toast.success(t.products.addToCart);
        openCart();
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <p>{t.common.loading}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <p>{t.products.noProducts}</p>
                <Button onClick={() => router.push('/')} className="mt-4">
                    Retour à l'accueil
                </Button>
            </div>
        );
    }

    const name = locale === 'ar' ? product.nameAr : product.nameFr;
    const description = locale === 'ar' ? product.descriptionAr : product.descriptionFr;
    const typeLabel = product.type === 'FOOD' ? t.products.food : t.products.packaging;
    const isNew = product.newUntil && new Date(product.newUntil) > new Date();
    const newLabel = locale === 'ar' ? 'جديد' : 'Nouveau';

    // Calculate current price based on variant
    let currentPrice = product.price;
    if (selectedVariant !== 'base') {
        const v = product.variants?.find((varItem) => varItem.id === selectedVariant);
        if (v) currentPrice = v.priceAdjustment;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-6 flex items-center gap-2 text-gray-600 hover:text-[var(--brand-pink)]"
            >
                <ArrowLeft className="h-4 w-4" />
                {t.common.cancel} {/* Using 'Annuler/Cancel' or back text */}
            </Button>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* Gallery / Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg bg-white h-fit">
                    <img
                        src={product.image}
                        alt={name}
                        className="w-full h-auto object-cover max-h-[500px]"
                    />
                    <div className="absolute top-4 right-4 bg-[var(--brand-pink)] text-white px-4 py-1.5 rounded-full font-medium shadow-sm">
                        {typeLabel}
                    </div>

                    {/* Promotional Ribbon */}
                    {product.ribbonText && (
                        <div className="absolute top-6 left-0 bg-red-600 text-white px-8 py-1.5 text-base font-bold shadow-md z-10 transform -rotate-45 -translate-x-8">
                            {product.ribbonText}
                        </div>
                    )}

                    {/* New Label */}
                    {isNew && !product.ribbonText && (
                        <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-1.5 rounded-full font-bold shadow-md z-10 animate-pulse">
                            {newLabel}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#383738' }}>
                            {name}
                        </h1>
                        <p className="text-3xl font-bold font-mono" style={{ color: 'var(--brand-pink)' }}>
                            {currentPrice.toFixed(0)} DA
                        </p>
                    </div>

                    <div className="prose max-w-none text-gray-600">
                        <p className="whitespace-pre-wrap">{description}</p>
                    </div>

                    <div className="space-y-4 pt-6 border-t">
                        {product.hasVariants && (
                            <div>
                                <Label className="mb-2 block">{t.products.selectVariant}</Label>
                                <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="base">
                                            {locale === 'ar' ? 'قياسي' : 'Standard'} - {product.price.toFixed(0)} DA
                                        </SelectItem>
                                        {product.variants?.map((v) => (
                                            <SelectItem key={v.id} value={v.id}>
                                                {locale === 'ar' ? v.nameAr : v.nameFr} - {v.priceAdjustment.toFixed(0)} DA
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div>
                            <Label className="mb-2 block">{t.products.quantity}</Label>
                            <div className="flex items-center w-fit gap-2 bg-gray-50 rounded-lg p-1 border">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="h-10 w-10 hover:bg-white hover:shadow-sm"
                                >
                                    -
                                </Button>
                                <Input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="h-10 w-16 text-center border-none bg-transparent focus-visible:ring-0 px-0 text-lg font-bold"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="h-10 w-10 hover:bg-white hover:shadow-sm"
                                >
                                    +
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button
                                onClick={handleAddToCart}
                                className="flex-1 h-12 text-lg cursor-pointer"
                                style={{ backgroundColor: 'var(--brand-pink)' }}
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                {t.products.addToCart}
                            </Button>
                        </div>

                        <p className="text-sm text-gray-500 text-center mt-4">
                            Livraison disponible dans toutes les wilayas
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
