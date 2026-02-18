'use client';

import { useLanguage } from '@/lib/language-context';
import { useCart } from '@/lib/cart-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Wilaya {
  Id: string;
  wilaya: string;
  home: string;
  stopdesk: string;
}

interface ShippingCost {
  wilayaID: string;
  wilayaLabel: string;
  home: string;
  stopdesk: string;
}

interface Municipality {
  Id: string;
  name: string;
  wilaya: string;
}

export default function CartPage() {
  const { t, locale } = useLanguage();
  const { items, removeItem, updateQuantity, clearCart, getSubtotal } = useCart();
  const router = useRouter();

  const [shippingCosts, setShippingCosts] = useState<ShippingCost[]>([]);
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    wilayaId: '',
    municipalityId: '',
    deliveryType: 'home' as 'home' | 'stopdesk',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch wilayas from Elogistia
    fetch('/api/elogistia/wilayas')
      .then((res) => res.json())
      .then((data) => {
        setWilayas(data);
      })
      .catch(() => toast.error(t.common.error));
  }, []);

  useEffect(() => {
    // Fetch municipalities when wilaya changes
    if (customerInfo.wilayaId) {
      fetch(`/api/elogistia/municipalities/${customerInfo.wilayaId}`)
        .then((res) => res.json())
        .then((data) => {
          setMunicipalities(data);
        })
        .catch(() => {
          toast.error(t.common.error);
        });
    } else {
      setMunicipalities([]);
    }


    // Reset municipality when wilaya changes
    setCustomerInfo(prev => ({ ...prev, municipalityId: '' }));
  }, [customerInfo.wilayaId]);


  useEffect(() => {

    fetch(`/api/elogistia/shipping-costs/`)
      .then((res) => res.json())
      .then((data) => {
        setShippingCosts(data);
      })
      .catch(() => {
        toast.error(t.common.error);
      });
  }, []);
  const subtotal = getSubtotal();

  const selectedWilaya = wilayas.find((w) => w.Id === customerInfo.wilayaId);
  const selectedMunicipality = municipalities.find((m) => m.Id === customerInfo.municipalityId);

  // Find shipping cost from the shippingCosts array
  const selectedShippingWilaya = shippingCosts.find((w) => w.wilayaID === customerInfo.wilayaId);
  const shippingCost = selectedShippingWilaya
    ? parseFloat(selectedShippingWilaya[customerInfo.deliveryType]) || 0
    : 0;

  const total = subtotal + shippingCost;

  const canCheckout =
    items.length > 0 &&
    customerInfo.fullName &&
    customerInfo.phone &&
    customerInfo.wilayaId &&
    customerInfo.municipalityId;

  const handleCheckout = async () => {
    if (!canCheckout) {
      toast.error(t.cart.fillInfo);
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      customerName: customerInfo.fullName,
      customerPhone: customerInfo.phone,
      customerEmail: 'client@darine-emballage.com', // Mock email
      address: `Wilaya: ${selectedWilaya?.wilaya}, Commune: ${selectedMunicipality?.name}`, // Mock address using location
      wilayaId: customerInfo.wilayaId,
      wilaya: selectedWilaya?.wilaya || '',
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

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <ShoppingCart className="h-24 w-24 mx-auto mb-4 text-gray-300" />
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#383738' }}>
            {t.cart.empty}
          </h1>
          <Button
            onClick={() => router.push('/catalog')}
            style={{ backgroundColor: 'var(--brand-pink)' }}
          >
            {t.hero.viewCatalog}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8" style={{ color: '#383738' }}>
        {t.cart.title}
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={`${item.productId}-${item.variantName || ''}`}>
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
                      onClick={() => removeItem(item.productId, item.variantName)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          item.productId,
                          parseInt(e.target.value) || 1,
                          item.variantName
                        )
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
          ))}
        </div>

        {/* Customer Info & Summary */}
        <div className="space-y-4">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t.customer.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t.customer.fullName}</Label>
                <Input
                  value={customerInfo.fullName}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, fullName: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label>{t.customer.phone}</Label>
                <Input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, phone: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label>{t.customer.wilaya}</Label>
                <Select
                  value={customerInfo.wilayaId}
                  onValueChange={(value) =>
                    setCustomerInfo({ ...customerInfo, wilayaId: value })
                  }
                >
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder={t.customer.selectWilaya} />
                  </SelectTrigger>
                  <SelectContent>
                    {wilayas.map((wilaya, index) => (
                      <SelectItem key={`${wilaya.Id}-${index}`} value={wilaya.Id}>
                        {wilaya.Id} - {wilaya.wilaya}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t.customer.municipality}</Label>
                <Select
                  value={customerInfo.municipalityId}
                  onValueChange={(value) =>
                    setCustomerInfo({ ...customerInfo, municipalityId: value })
                  }
                  disabled={!customerInfo.wilayaId}
                >
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder={t.customer.selectMunicipality} />
                  </SelectTrigger>
                  <SelectContent>
                    {municipalities.map((municipality, index) => (
                      <SelectItem key={`${municipality.Id}-${index}`} value={municipality.Id}>
                        {municipality.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t.customer.deliveryType}</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="home"
                      checked={customerInfo.deliveryType === 'home'}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          deliveryType: e.target.value as 'home',
                        })
                      }
                    />
                    {t.customer.home}
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="stopdesk"
                      checked={customerInfo.deliveryType === 'stopdesk'}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          deliveryType: e.target.value as 'stopdesk',
                        })
                      }
                    />
                    {t.customer.stopdesk}
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>{t.cart.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t.cart.subtotal}</span>
                  <span className="font-semibold">{subtotal.toFixed(0)} DA</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.cart.shipping}</span>
                  <span className="font-semibold text-green-600">{shippingCost.toFixed(0)} DA</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>{t.cart.total}</span>
                  <span style={{ color: 'var(--brand-pink)' }}>{total.toFixed(0)} DA</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={!canCheckout || isSubmitting}
                className="w-full mt-4"
                style={{ backgroundColor: 'var(--brand-pink)' }}
              >
                {isSubmitting ? t.common.loading : t.cart.checkout}
              </Button>

              {!canCheckout && items.length > 0 && (
                <p className="text-sm text-red-500 mt-2 text-center">
                  {t.cart.fillInfo}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div >
  );
}
