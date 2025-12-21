/**
 * Order Card Component
 * 
 * Displays a single order with customer details, items, and actions.
 */

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Order } from '@/lib/types';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  // Debug: Afficher ce que reçoit le composant
  console.log('OrderCard received:', order);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{order.orderNumber || 'N/A'}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(order.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${order.status === 'PENDING'
              ? 'bg-yellow-100 text-yellow-800'
              : order.status === 'CONFIRMED'
                ? 'bg-green-100 text-green-800'
                : order.status === 'CANCELLED'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
          >
            {order.status}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="font-semibold mb-2">Client</p>
            <p>{order.customerName}</p>
            <p>{order.customerPhone}</p>
            {order.customerEmail && <p>{order.customerEmail}</p>}
            <p className="mt-2">{order.address}</p>
            <p>{order.municipality}, {order.wilaya}</p>
          </div>
          <div>
            <p className="font-semibold mb-2">Résumé</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Sous-total:</span>
                <span>{order.subtotal.toFixed(0)} DA</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison:</span>
                <span>{order.shippingCost.toFixed(0)} DA</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span style={{ color: '#F8A6B0' }}>
                  {order.total.toFixed(0)} DA
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mb-4">
          <p className="font-semibold mb-2">Produits</p>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.productName}
                  {item.variantName && ` - ${item.variantName}`} x{item.quantity}
                </span>
                <span>{item.total.toFixed(0)} DA</span>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={() => window.open('https://elogistia.com/app/client/', '_blank')}
          style={{ backgroundColor: '#F8A6B0' }}
          className="w-full mt-4"
        >
          Voir la commande sur elogistia
        </Button>

        {order.trackingNumber && (
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <p className="text-sm">
              <span className="font-semibold">Tracking:</span> {order.trackingNumber}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
