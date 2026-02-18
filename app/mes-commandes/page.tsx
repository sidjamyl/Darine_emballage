'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { authClient } from '@/lib/auth-client';
import { OrderTrackingCard } from './components/order-tracking-card';
import { generateOrderPDF } from '@/lib/utils/pdf-generator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Package, ArrowLeft, Search, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  productName: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  wilaya: string;
  municipality: string;
  deliveryType: string;
  shippingCost: number;
  subtotal: number;
  total: number;
  status: string;
  trackingNumber?: string;
  trackingStatus?: string;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

export default function MyOrdersPage() {
  const { locale } = useLanguage();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneSearch, setPhoneSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    checkAuthAndFetchOrders();
  }, []);

  const checkAuthAndFetchOrders = async () => {
    try {
      const session = await authClient.getSession();
      if (!session) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(true);
      await fetchOrders();
    } catch (error) {
      console.error('Auth error:', error);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/my-orders');

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          return;
        }
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(locale === 'ar' ? 'خطأ في تحميل الطلبات' : 'Erreur lors du chargement des commandes');
    } finally {
      setIsLoading(false);
    }
  };

  const searchByPhone = async () => {
    const trimmed = phoneSearch.trim();
    if (!trimmed || trimmed.length < 9) {
      toast.error(
        locale === 'ar'
          ? 'يرجى إدخال رقم هاتف صحيح'
          : 'Veuillez entrer un numéro de téléphone valide'
      );
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      const response = await fetch(`/api/orders/by-phone?phone=${encodeURIComponent(trimmed)}`);
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error searching orders:', error);
      toast.error(locale === 'ar' ? 'خطأ في البحث' : 'Erreur lors de la recherche');
    } finally {
      setIsSearching(false);
    }
  };

  const handleDownloadPDF = async (order: Order) => {
    try {
      await generateOrderPDF(order);
      toast.success('PDF téléchargé avec succès');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  const translations = {
    fr: {
      title: 'Mes Commandes',
      subtitle: 'Consultez et suivez vos commandes',
      noOrders: 'Aucune commande trouvée',
      noOrdersDesc: 'Aucune commande n\'a été trouvée.',
      noOrdersYet: 'Vous n\'avez pas encore de commandes',
      noOrdersYetDesc: 'Vos commandes apparaîtront ici une fois que vous aurez effectué un achat.',
      backToShop: 'Retour à la boutique',
      back: 'Retour',
      phoneSearchTitle: 'Retrouvez vos commandes',
      phoneSearchDesc: 'Entrez le numéro de téléphone utilisé lors de votre commande',
      phonePlaceholder: 'Ex: 0540153721',
      search: 'Rechercher',
      searching: 'Recherche...',
      orLogin: 'ou connectez-vous',
    },
    ar: {
      title: 'طلباتي',
      subtitle: 'استشر وتتبع طلباتك',
      noOrders: 'لم يتم العثور على طلبات',
      noOrdersDesc: 'لم يتم العثور على أي طلبات.',
      noOrdersYet: 'ليس لديك طلبات بعد',
      noOrdersYetDesc: 'ستظهر طلباتك هنا بمجرد إجراء عملية شراء.',
      backToShop: 'العودة إلى المتجر',
      back: 'رجوع',
      phoneSearchTitle: 'ابحث عن طلباتك',
      phoneSearchDesc: 'أدخل رقم الهاتف المستخدم عند الطلب',
      phonePlaceholder: 'مثال: 0540153721',
      search: 'بحث',
      searching: 'جاري البحث...',
      orLogin: 'أو سجل الدخول',
    },
  };

  const t = translations[locale];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Package className="h-16 w-16 animate-pulse" style={{ color: 'var(--brand-pink)' }} />
          <p className="mt-4 text-gray-600">
            {locale === 'ar' ? 'جاري تحميل طلباتك...' : 'Chargement de vos commandes...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="mb-4 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.back}
        </Button>

        <div className="flex items-center gap-3 mb-2">
          <Package className="h-8 w-8" style={{ color: 'var(--brand-pink)' }} />
          <h1 className="text-3xl font-bold" style={{ color: '#383738' }}>
            {t.title}
          </h1>
        </div>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      {/* Phone search for non-authenticated users */}
      {!isAuthenticated && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--brand-pink)' }}
              >
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: '#383738' }}>
                  {t.phoneSearchTitle}
                </h3>
                <p className="text-sm text-gray-500">{t.phoneSearchDesc}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Input
                type="tel"
                value={phoneSearch}
                onChange={(e) => setPhoneSearch(e.target.value)}
                placeholder={t.phonePlaceholder}
                className="flex-1"
                dir="ltr"
                onKeyDown={(e) => e.key === 'Enter' && searchByPhone()}
              />
              <Button
                onClick={searchByPhone}
                disabled={isSearching}
                className="text-white cursor-pointer shrink-0"
                style={{ backgroundColor: 'var(--brand-pink)' }}
              >
                {isSearching ? (
                  t.searching
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    {t.search}
                  </>
                )}
              </Button>
            </div>
            <div className="mt-3 text-center">
              <button
                onClick={() => router.push('/login')}
                className="text-sm text-gray-400 hover:text-[var(--brand-pink)] transition-colors cursor-pointer underline"
              >
                {t.orLogin}
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders list */}
      {orders.length === 0 ? (
        <>
          {(isAuthenticated || hasSearched) && (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#383738' }}>
                  {hasSearched ? t.noOrders : t.noOrdersYet}
                </h3>
                <p className="text-gray-600 mb-6">
                  {hasSearched ? t.noOrdersDesc : t.noOrdersYetDesc}
                </p>
                <Button
                  onClick={() => router.push('/catalog')}
                  style={{ backgroundColor: 'var(--brand-pink)' }}
                  className="cursor-pointer"
                >
                  {t.backToShop}
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderTrackingCard
              key={order.id}
              order={order}
              onDownloadPDF={handleDownloadPDF}
            />
          ))}
        </div>
      )}
    </div>
  );
}
