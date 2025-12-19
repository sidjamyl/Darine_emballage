'use client';

import { useLanguage } from '@/lib/language-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  DialogDescription,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  wilaya: string;
  wilayaId: string;
  municipality: string;
  municipalityId: string;
  deliveryType: string;
  shippingCost: number;
  subtotal: number;
  total: number;
  status: string;
  trackingNumber?: string;
  createdAt: string;
  items: Array<{
    id: string;
    productName: string;
    variantName?: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

export default function AdminPage() {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'confirm' | 'cancel'>('confirm');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await authClient.getSession();
      if (!session) {
        router.push('/sign-in');
        return;
      }
      setIsAuthenticated(true);
      fetchOrders();
    } catch (error) {
      router.push('/sign-in');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async (status?: string) => {
    try {
      const url = status && status !== 'ALL' 
        ? `/api/orders?status=${status}` 
        : '/api/orders';
      const response = await fetch(url);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast.error(t.common.error);
    }
  };

  const handleConfirmOrder = (order: Order) => {
    setSelectedOrder(order);
    setConfirmAction('confirm');
    setShowConfirmDialog(true);
  };

  const handleCancelOrder = (order: Order) => {
    setSelectedOrder(order);
    setConfirmAction('cancel');
    setShowConfirmDialog(true);
  };

  const executeAction = async () => {
    if (!selectedOrder) return;

    try {
      const response = await fetch(`/api/admin/orders/${selectedOrder.id}/${confirmAction}`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success(
          confirmAction === 'confirm'
            ? (locale === 'ar' ? 'تم تأكيد الطلب' : 'Commande confirmée')
            : (locale === 'ar' ? 'تم إلغاء الطلب' : 'Commande annulée')
        );
        fetchOrders(statusFilter);
      } else {
        toast.error(t.common.error);
      }
    } catch (error) {
      toast.error(t.common.error);
    } finally {
      setShowConfirmDialog(false);
      setSelectedOrder(null);
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>{t.common.loading}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const filteredOrders = statusFilter === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#383738' }}>
          {t.admin.title}
        </h1>
        <Button onClick={handleLogout} variant="outline">
          {locale === 'ar' ? 'تسجيل الخروج' : 'Déconnexion'}
        </Button>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <Label className="mb-2 block">{t.admin.orders}</Label>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            fetchOrders(value);
          }}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder={t.admin.orders} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{locale === 'ar' ? 'الكل' : 'Tous'}</SelectItem>
            <SelectItem value="DRAFT">{t.admin.status.DRAFT}</SelectItem>
            <SelectItem value="CONFIRMED">{t.admin.status.CONFIRMED}</SelectItem>
            <SelectItem value="CANCELLED">{t.admin.status.CANCELLED}</SelectItem>
            <SelectItem value="DELIVERED">{t.admin.status.DELIVERED}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              {locale === 'ar' ? 'لا توجد طلبات' : 'Aucune commande'}
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {order.orderNumber}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(order.createdAt).toLocaleDateString(
                        locale === 'ar' ? 'ar-DZ' : 'fr-FR'
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === 'DRAFT'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {t.admin.status[order.status as keyof typeof t.admin.status]}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="font-semibold mb-2">{t.customer.title}</p>
                    <p>{order.customerName}</p>
                    <p>{order.customerPhone}</p>
                    {order.customerEmail && <p>{order.customerEmail}</p>}
                    <p className="mt-2">{order.address}</p>
                    <p>{order.municipality}, {order.wilaya}</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">{locale === 'ar' ? 'الملخص' : 'Résumé'}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>{t.cart.subtotal}:</span>
                        <span>{order.subtotal.toFixed(2)} DA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t.cart.shipping}:</span>
                        <span>{order.shippingCost.toFixed(2)} DA</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>{t.cart.total}:</span>
                        <span style={{ color: '#F8A6B0' }}>
                          {order.total.toFixed(2)} DA
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t pt-4 mb-4">
                  <p className="font-semibold mb-2">{locale === 'ar' ? 'المنتجات' : 'Produits'}</p>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.productName}
                          {item.variantName && ` - ${item.variantName}`} x{item.quantity}
                        </span>
                        <span>{item.total.toFixed(2)} DA</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {order.status === 'DRAFT' && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleConfirmOrder(order)}
                      style={{ backgroundColor: '#F8A6B0' }}
                    >
                      {t.admin.confirm}
                    </Button>
                    <Button
                      onClick={() => handleCancelOrder(order)}
                      variant="outline"
                    >
                      {t.admin.cancel}
                    </Button>
                  </div>
                )}

                {order.trackingNumber && (
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <p className="text-sm">
                      <span className="font-semibold">Tracking:</span> {order.trackingNumber}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'confirm' ? t.admin.confirmOrder : t.admin.cancelOrder}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === 'confirm' ? t.admin.confirmMessage : t.admin.cancelMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              {t.admin.no}
            </Button>
            <Button
              onClick={executeAction}
              style={{
                backgroundColor: confirmAction === 'confirm' ? '#F8A6B0' : undefined,
              }}
              variant={confirmAction === 'cancel' ? 'destructive' : 'default'}
            >
              {t.admin.yes}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
