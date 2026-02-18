'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { useCart } from '@/lib/cart-context';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
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
import { toast } from 'sonner';
import { Trash2, ShoppingCart, Minus, Plus, Package } from 'lucide-react';

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

export function CartDrawer() {
  const { t, locale } = useLanguage();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getTotalItems,
    isCartOpen,
    closeCart,
  } = useCart();
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

  // Fetch wilayas + shipping costs once when drawer first opens
  useEffect(() => {
    if (!isCartOpen) return;
    if (wilayas.length > 0) return; // already loaded

    fetch('/api/elogistia/wilayas')
      .then((res) => res.json())
      .then((data) => setWilayas(data))
      .catch(() => toast.error(t.common.error));

    fetch('/api/elogistia/shipping-costs/')
      .then((res) => res.json())
      .then((data) => setShippingCosts(data))
      .catch(() => toast.error(t.common.error));
  }, [isCartOpen]);

  // Fetch municipalities when wilaya changes
  useEffect(() => {
    if (customerInfo.wilayaId) {
      fetch(`/api/elogistia/municipalities/${customerInfo.wilayaId}`)
        .then((res) => res.json())
        .then((data) => setMunicipalities(data))
        .catch(() => toast.error(t.common.error));
    } else {
      setMunicipalities([]);
    }
    setCustomerInfo((prev) => ({ ...prev, municipalityId: '' }));
  }, [customerInfo.wilayaId]);

  const subtotal = getSubtotal();
  const selectedWilaya = wilayas.find((w) => w.Id === customerInfo.wilayaId);
  const selectedMunicipality = municipalities.find(
    (m) => m.Id === customerInfo.municipalityId
  );
  const selectedShippingWilaya = shippingCosts.find(
    (w) => w.wilayaID === customerInfo.wilayaId
  );
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
      customerEmail: 'client@darine-emballage.com',
      address: `Wilaya: ${selectedWilaya?.wilaya}, Commune: ${selectedMunicipality?.name}`,
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
        clearCart();
        closeCart();
        toast.success(t.cart.orderSuccess);
        router.push('/');
      } else {
        toast.error(t.common.error);
      }
    } catch {
      toast.error(t.common.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const drawerSide = locale === 'ar' ? 'right' : 'left';

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side={drawerSide}
        showCloseButton={false}
        className="flex flex-col p-0 w-full sm:max-w-md"
      >
        {/* ── Header ── */}
        <SheetHeader className="px-5 pt-5 pb-3 border-b shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-xl"
                style={{ backgroundColor: 'var(--brand-pink)', opacity: 0.1 }}
              >
                <ShoppingCart
                  className="h-5 w-5"
                  style={{ color: 'var(--brand-pink)' }}
                />
              </div>
              <div>
                <SheetTitle className="text-lg font-bold" style={{ color: '#383738' }}>
                  {t.cart.yourCart}
                </SheetTitle>
                <SheetDescription className="text-sm text-gray-500">
                  {getTotalItems()} {t.cart.items}
                </SheetDescription>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label={t.common.close}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </SheetHeader>

        {/* ── Body (scrollable) ── */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full px-5 py-16">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: 'color-mix(in srgb, var(--brand-pink) 10%, transparent)' }}
              >
                <ShoppingCart className="h-10 w-10 text-gray-300" />
              </div>
              <p className="text-lg font-semibold mb-2" style={{ color: '#383738' }}>
                {t.cart.empty}
              </p>
              <Button
                onClick={() => {
                  closeCart();
                  router.push('/catalog');
                }}
                className="mt-4 text-white cursor-pointer"
                style={{ backgroundColor: 'var(--brand-pink)' }}
              >
                {t.hero.viewCatalog}
              </Button>
            </div>
          ) : (
            <div className="px-5 py-4 space-y-6">
              {/* ── Cart Items ── */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantName || ''}`}
                    className="flex gap-3 p-3 rounded-xl border bg-white hover:shadow-sm transition-shadow"
                  >
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-semibold text-sm leading-tight truncate"
                        style={{ color: '#383738' }}
                      >
                        {item.productName}
                      </h4>
                      {item.variantName && (
                        <p className="text-xs text-gray-500 mt-0.5">{item.variantName}</p>
                      )}
                      <p
                        className="text-sm font-bold mt-1"
                        style={{ color: 'var(--brand-pink)' }}
                      >
                        {item.unitPrice.toFixed(0)} DA
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 border rounded-lg">
                          <button
                            className="p-1 hover:bg-gray-100 rounded-l-lg transition-colors cursor-pointer"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity - 1,
                                item.variantName
                              )
                            }
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="p-1 hover:bg-gray-100 rounded-r-lg transition-colors cursor-pointer"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity + 1,
                                item.variantName
                              )
                            }
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold" style={{ color: '#383738' }}>
                            {(item.quantity * item.unitPrice).toFixed(0)} DA
                          </span>
                          <button
                            onClick={() => removeItem(item.productId, item.variantName)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Divider ── */}
              <div className="border-t" />

              {/* ── Customer Info Form ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4" style={{ color: 'var(--brand-pink)' }} />
                  <h3 className="font-bold text-sm" style={{ color: '#383738' }}>
                    {t.customer.title}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs font-medium text-gray-600">
                      {t.customer.fullName}
                    </Label>
                    <Input
                      value={customerInfo.fullName}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, fullName: e.target.value })
                      }
                      className="mt-1 h-9 text-sm"
                      placeholder={t.customer.fullName}
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-gray-600">
                      {t.customer.phone}
                    </Label>
                    <Input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, phone: e.target.value })
                      }
                      className="mt-1 h-9 text-sm"
                      placeholder={t.customer.phone}
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-gray-600">
                      {t.customer.wilaya}
                    </Label>
                    <Select
                      value={customerInfo.wilayaId}
                      onValueChange={(value) =>
                        setCustomerInfo({ ...customerInfo, wilayaId: value })
                      }
                    >
                      <SelectTrigger className="w-full mt-1 h-9 text-sm">
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
                    <Label className="text-xs font-medium text-gray-600">
                      {t.customer.municipality}
                    </Label>
                    <Select
                      value={customerInfo.municipalityId}
                      onValueChange={(value) =>
                        setCustomerInfo({ ...customerInfo, municipalityId: value })
                      }
                      disabled={!customerInfo.wilayaId}
                    >
                      <SelectTrigger className="w-full mt-1 h-9 text-sm">
                        <SelectValue placeholder={t.customer.selectMunicipality} />
                      </SelectTrigger>
                      <SelectContent>
                        {municipalities.map((municipality, index) => (
                          <SelectItem
                            key={`${municipality.Id}-${index}`}
                            value={municipality.Id}
                          >
                            {municipality.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-gray-600">
                      {t.customer.deliveryType}
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() =>
                          setCustomerInfo({ ...customerInfo, deliveryType: 'home' })
                        }
                        className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                          customerInfo.deliveryType === 'home'
                            ? 'border-[var(--brand-pink)] text-[var(--brand-pink)] bg-pink-50'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {t.customer.home}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCustomerInfo({ ...customerInfo, deliveryType: 'stopdesk' })
                        }
                        className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                          customerInfo.deliveryType === 'stopdesk'
                            ? 'border-[var(--brand-pink)] text-[var(--brand-pink)] bg-pink-50'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {t.customer.stopdesk}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer (sticky summary + checkout) ── */}
        {items.length > 0 && (
          <div className="shrink-0 border-t bg-gray-50/80 px-5 py-4 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t.cart.subtotal}</span>
                <span className="font-semibold">{subtotal.toFixed(0)} DA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t.cart.shipping}</span>
                <span className="font-semibold">
                  {shippingCost > 0 ? `${shippingCost.toFixed(0)} DA` : '—'}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold pt-1.5 border-t">
                <span>{t.cart.total}</span>
                <span style={{ color: 'var(--brand-pink)' }}>{total.toFixed(0)} DA</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={!canCheckout || isSubmitting}
              className="w-full h-11 text-white font-semibold text-sm cursor-pointer"
              style={{ backgroundColor: 'var(--brand-pink)' }}
            >
              {isSubmitting ? t.common.loading : t.cart.checkout}
            </Button>

            {!canCheckout && (
              <p className="text-xs text-red-500 text-center">{t.cart.fillInfo}</p>
            )}

            <button
              onClick={closeCart}
              className="w-full text-center text-sm text-gray-500 hover:text-[var(--brand-pink)] transition-colors py-1 cursor-pointer"
            >
              {t.cart.continueShopping}
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
