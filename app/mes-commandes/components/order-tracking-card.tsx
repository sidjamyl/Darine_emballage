/**
 * Order Tracking Card Component
 * Displays a single order with tracking information and PDF download
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Download, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

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

interface OrderTrackingCardProps {
  order: Order;
  onDownloadPDF: (order: Order) => void;
}

export function OrderTrackingCard({ order, onDownloadPDF }: OrderTrackingCardProps) {
  const getStatusInfo = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DRAFT':
        return {
          icon: Clock,
          label: 'Brouillon',
          color: 'bg-gray-100 text-gray-800',
          iconColor: 'text-gray-600',
        };
      case 'PENDING':
        return {
          icon: Clock,
          label: 'En attente',
          color: 'bg-yellow-100 text-yellow-800',
          iconColor: 'text-yellow-600',
        };
      case 'CONFIRMED':
        return {
          icon: Truck,
          label: 'Confirmée',
          color: 'bg-blue-100 text-blue-800',
          iconColor: 'text-blue-600',
        };
      case 'DELIVERED':
        return {
          icon: CheckCircle,
          label: 'Livrée',
          color: 'bg-green-100 text-green-800',
          iconColor: 'text-green-600',
        };
      case 'CANCELLED':
        return {
          icon: XCircle,
          label: 'Annulée',
          color: 'bg-red-100 text-red-800',
          iconColor: 'text-red-600',
        };
      default:
        return {
          icon: Package,
          label: status,
          color: 'bg-gray-100 text-gray-800',
          iconColor: 'text-gray-600',
        };
    }
  };

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5" style={{ color: 'var(--brand-pink)' }} />
              {order.orderNumber}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${statusInfo.color}`}
            >
              <StatusIcon className={`h-4 w-4 ${statusInfo.iconColor}`} />
              {statusInfo.label}
            </span>
            <Button
              size="sm"
              onClick={() => onDownloadPDF(order)}
              style={{ backgroundColor: 'var(--brand-pink)' }}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Télécharger le bon
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          {/* Informations de livraison */}
          <div>
            <p className="font-semibold mb-3" style={{ color: '#383738' }}>
              📍 Livraison
            </p>
            <div className="space-y-1 text-sm text-gray-700">
              <p>{order.address}</p>
              <p>{order.municipality}, {order.wilaya}</p>
              {order.trackingNumber && (
                <div className="mt-3 p-2 bg-gray-50 rounded">
                  <p className="font-semibold text-xs text-gray-600">Numéro de suivi</p>
                  <p className="font-mono text-sm" style={{ color: 'var(--brand-pink)' }}>
                    {order.trackingNumber}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Résumé financier */}
          <div>
            <p className="font-semibold mb-3" style={{ color: '#383738' }}>
              💰 Résumé
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total:</span>
                <span className="font-medium">{order.subtotal.toFixed(0)} DA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Livraison:</span>
                <span className="font-medium">{order.shippingCost.toFixed(0)} DA</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-bold text-base">
                <span>Total:</span>
                <span style={{ color: 'var(--brand-pink)' }}>
                  {order.total.toFixed(0)} DA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des produits */}
        <div className="border-t pt-4">
          <p className="font-semibold mb-3" style={{ color: '#383738' }}>
            📦 Produits commandés
          </p>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {item.productName}
                    {item.variantName && (
                      <span className="text-gray-600"> - {item.variantName}</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.unitPrice.toFixed(0)} DA × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold" style={{ color: 'var(--brand-pink)' }}>
                  {item.total.toFixed(0)} DA
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Notes si présentes */}
        {order.notes && (
          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-100">
            <p className="text-sm font-semibold text-blue-900 mb-1">📝 Notes</p>
            <p className="text-sm text-blue-800">{order.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
