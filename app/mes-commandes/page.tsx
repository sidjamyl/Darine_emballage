'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { authClient } from '@/lib/auth-client';
import { OrderTrackingCard } from './components/order-tracking-card';
import { generateOrderPDF } from '@/lib/utils/pdf-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, ArrowLeft } from 'lucide-react';
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

  useEffect(() => {
    checkAuthAndFetchOrders();
  }, []);

  const checkAuthAndFetchOrders = async () => {
    try {
      const session = await authClient.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      setIsAuthenticated(true);
      await fetchOrders();
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/login');
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/my-orders');

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Package className="h-16 w-16 animate-pulse" style={{ color: 'var(--brand-pink)' }} />
          <p className="mt-4 text-gray-600">Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const translations = {
    fr: {
      title: 'Mes Commandes',
      subtitle: 'Consultez et suivez vos commandes',
      noOrders: 'Vous n\'avez pas encore de commandes',
      noOrdersDesc: 'Vos commandes apparaîtront ici une fois que vous aurez effectué un achat.',
      backToShop: 'Retour à la boutique',
      back: 'Retour',
    },
    ar: {
      title: 'طلباتي',
      subtitle: 'استشر وتتبع طلباتك',
      noOrders: 'ليس لديك طلبات بعد',
      noOrdersDesc: 'ستظهر طلباتك هنا بمجرد إجراء عملية شراء.',
      backToShop: 'العودة إلى المتجر',
      back: 'رجوع',
    },
  };

  const t = translations[locale];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="mb-4"
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

      {/* Orders list */}
      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#383738' }}>
              {t.noOrders}
            </h3>
            <p className="text-gray-600 mb-6">
              {t.noOrdersDesc}
            </p>
            <Button
              onClick={() => router.push('/catalog')}
              style={{ backgroundColor: 'var(--brand-pink)' }}
            >
              {t.backToShop}
            </Button>
          </CardContent>
        </Card>
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
