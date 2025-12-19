import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';
import { ELOGISTIA_API_KEY, ELOGISTIA_BASE_URL } from '@/lib/services/elogistia/config';

/**
 * GET user's orders from Elogistia in real-time
 * Requires authentication
 */
export async function GET() {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Get user's profile to find their phone number
    const userAccount = await prisma.account.findFirst({
      where: {
        userId: user.id,
      },
    });

    // Get user's previous orders to know their phone/email
    const userOrders = await prisma.order.findMany({
      where: {
       
      },
      select: {
        customerPhone: true,
        customerEmail: true,
      },
      take: 1,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // If no orders found in DB, return empty array
    if (userOrders.length === 0) {
      return NextResponse.json([]);
    }

    const userPhone = userOrders[0].customerPhone;
    const userEmail = userOrders[0].customerEmail;

    // Fetch all orders from Elogistia
    const params = new URLSearchParams({
      key: ELOGISTIA_API_KEY,
    });

    const url = `${ELOGISTIA_BASE_URL}/getOrders/?${params.toString()}`;
    
    console.log('Fetching orders from Elogistia for user:', user.id);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Elogistia API error:', response.status);
      return NextResponse.json([]);
    }

    const data = await response.json();
    
    // FIXED: Properly extract orders from the response (same as orders-fixed)
    let ordersArray = [];
    
    if (data && data.body && Array.isArray(data.body)) {
      ordersArray = data.body;
    } else if (Array.isArray(data)) {
      ordersArray = data;
    } else if (data && data.orders && Array.isArray(data.orders)) {
      ordersArray = data.orders;
    } else {
      ordersArray = [];
    }
    
    // Filter orders by user's phone or email
    const userOrdersFromElogistia = ordersArray.filter((order: any) => {
      const orderPhone = order['Téléphone'];
      const orderEmail = order['E-mail'];
      return orderPhone === userPhone || (userEmail && orderEmail === userEmail);
    });

    console.log(`Found ${userOrdersFromElogistia.length} orders for user`);

    // Transform Elogistia data to match our format
    const transformedOrders = userOrdersFromElogistia.map((order: any, index: number) => {
      // Normaliser le statut pour correspondre à OrderStatus
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
        subtotal: parseFloat(order['Total Recouvrement'] || 0) - parseFloat(order['Frais de livraison'] || order['Frais ELogistia'] || 0),
        total: parseFloat(order['Total Recouvrement'] || 0),
        status: orderStatus,
        trackingNumber: order['Tracking'] || '',
        createdAt: new Date().toISOString(),
        notes: order['Remarque'] || '',
        items: order['Produit'] ? [{
          id: `item-${index}-0`,
          productName: (order['Produit'] || '').trim(),
          quantity: 1,
          unitPrice: parseFloat(order['Total Recouvrement'] || 0) - parseFloat(order['Frais de livraison'] || order['Frais ELogistia'] || 0),
          total: parseFloat(order['Total Recouvrement'] || 0) - parseFloat(order['Frais de livraison'] || order['Frais ELogistia'] || 0),
        }] : [],
      };
    });

    // Sort by CommandeID (descending) - higher IDs are more recent
    const sortedOrders = transformedOrders.sort((a: any, b: any) => {
      const idA = parseInt(a.orderNumber) || 0;
      const idB = parseInt(b.orderNumber) || 0;
      return idB - idA; // Descending order (most recent first)
    });

    return NextResponse.json(sortedOrders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}
