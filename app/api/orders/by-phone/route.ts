import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ELOGISTIA_API_KEY, ELOGISTIA_BASE_URL } from '@/lib/services/elogistia/config';

/**
 * GET orders by phone number (public, no auth required)
 * Query param: ?phone=0540153721
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone')?.trim();

    if (!phone || phone.length < 9) {
      return NextResponse.json(
        { error: 'Numéro de téléphone invalide' },
        { status: 400 }
      );
    }

    // Normalize phone: remove spaces, dashes, +213 prefix
    const normalizedPhone = phone
      .replace(/[\s\-\.]/g, '')
      .replace(/^\+213/, '0');

    // Fetch all orders from Elogistia
    const params = new URLSearchParams({
      key: ELOGISTIA_API_KEY,
    });

    const url = `${ELOGISTIA_BASE_URL}/getOrders/?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      // Fallback: return orders from local DB
      return await getLocalOrders(normalizedPhone);
    }

    const data = await response.json();

    let ordersArray: any[] = [];
    if (data?.body && Array.isArray(data.body)) {
      ordersArray = data.body;
    } else if (Array.isArray(data)) {
      ordersArray = data;
    } else if (data?.orders && Array.isArray(data.orders)) {
      ordersArray = data.orders;
    }

    // Filter orders by phone number
    const matchingOrders = ordersArray.filter((order: any) => {
      const orderPhone = (order['Téléphone'] || '')
        .replace(/[\s\-\.]/g, '')
        .replace(/^\+213/, '0');
      return orderPhone === normalizedPhone;
    });

    // Transform to our format
    const transformedOrders = matchingOrders.map((order: any, index: number) => {
      let orderStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'DELIVERED' = 'PENDING';
      const rawStatus = order['Status']?.toUpperCase();

      if (rawStatus === 'CONFIRMED' || rawStatus === 'CONFIRMÉE') {
        orderStatus = 'CONFIRMED';
      } else if (rawStatus === 'CANCELLED' || rawStatus === 'ANNULÉE') {
        orderStatus = 'CANCELLED';
      } else if (rawStatus === 'DELIVERED' || rawStatus === 'LIVRÉE') {
        orderStatus = 'DELIVERED';
      } else if (rawStatus?.includes('LIVR') || rawStatus?.includes('RÉGLÉE')) {
        orderStatus = 'DELIVERED';
      } else if (rawStatus === 'RETOUR' || rawStatus?.includes('RETOUR')) {
        orderStatus = 'CANCELLED';
      } else if (rawStatus === 'BROUILLON') {
        orderStatus = 'PENDING';
      }

      return {
        id: order.CommandeID || `order-${index}`,
        orderNumber: order.CommandeID || order.Tracking || `N/A-${index}`,
        customerName: `${order['Prénom'] || ''} ${order['Nom'] || ''}`.trim() || 'N/A',
        customerPhone: order['Téléphone'] || 'N/A',
        customerEmail: order['E-mail'] || '',
        address: order['Addresse'] || order['Adresse'] || 'N/A',
        wilaya: (order['Wilaya ']?.trim() || order.Wilaya || '').trim(),
        municipality: (order['Commune ']?.trim() || order.Commune || '').trim(),
        deliveryType: 'HOME' as const,
        shippingCost: parseFloat(order['Frais de livraison'] || order['Frais ELogistia'] || 0),
        subtotal:
          parseFloat(order['Total Recouvrement'] || 0) -
          parseFloat(order['Frais de livraison'] || order['Frais ELogistia'] || 0),
        total: parseFloat(order['Total Recouvrement'] || 0),
        status: orderStatus,
        trackingNumber: order['Tracking'] || '',
        createdAt: new Date().toISOString(),
        notes: order['Remarque'] || '',
        items: order['Produit']
          ? [
              {
                id: `item-${index}-0`,
                productName: (order['Produit'] || '').trim(),
                quantity: 1,
                unitPrice:
                  parseFloat(order['Total Recouvrement'] || 0) -
                  parseFloat(order['Frais de livraison'] || order['Frais ELogistia'] || 0),
                total:
                  parseFloat(order['Total Recouvrement'] || 0) -
                  parseFloat(order['Frais de livraison'] || order['Frais ELogistia'] || 0),
              },
            ]
          : [],
      };
    });

    // Sort by ID descending (most recent first)
    const sorted = transformedOrders.sort((a: any, b: any) => {
      const idA = parseInt(a.orderNumber) || 0;
      const idB = parseInt(b.orderNumber) || 0;
      return idB - idA;
    });

    return NextResponse.json(sorted);
  } catch (error) {
    console.error('Error fetching orders by phone:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}

/** Fallback: fetch from local DB if Elogistia is unreachable */
async function getLocalOrders(phone: string) {
  const orders = await prisma.order.findMany({
    where: { customerPhone: phone },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(orders);
}
