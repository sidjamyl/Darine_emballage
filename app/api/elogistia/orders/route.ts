import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth-server';
import { ELOGISTIA_API_KEY, ELOGISTIA_BASE_URL } from '@/lib/services/elogistia/config';

/**
 * GET all orders from Elogistia API
 * Admin only endpoint
 */
export async function GET(request: Request) {
  try {
    const user = await getUser();
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get filter parameter
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build Elogistia API URL (using 'key' parameter as per API docs)
    const params = new URLSearchParams({
      key: ELOGISTIA_API_KEY,
    });

    // Add status filter if provided
    if (status && status !== 'ALL') {
      params.append('status', status);
    }

    const url = `${ELOGISTIA_BASE_URL}/getOrders/?${params.toString()}`;
    
    console.log('Fetching orders from Elogistia:', url.replace(ELOGISTIA_API_KEY, 'API_KEY_HIDDEN'));
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Elogistia response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Elogistia API error:', response.status, errorText);
      // Return empty array instead of error to avoid breaking the UI
      return NextResponse.json([]);
    }

    const data = await response.json();
    
    console.log('Elogistia API response:', JSON.stringify(data, null, 2));
    
    // S'assurer que data est un objet ou un tableau
    let ordersData = data;
    
    // Si l'API retourne un objet avec une propriété contenant les commandes
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      console.log('Data is object, looking for orders property...');
      // Chercher une propriété qui pourrait contenir les commandes
      if (data.commandes) ordersData = data.commandes;
      else if (data.orders) ordersData = data.orders;
      else if (data.data) ordersData = data.data;
      else if (data.result) ordersData = data.result;
      else if (Object.keys(data).length === 0) {
        // Objet vide = aucune commande
        console.log('Empty object, no orders');
        ordersData = [];
      } else {
        // Essayer de traiter l'objet comme un tableau d'objets
        console.log('Treating object as array of orders');
        ordersData = Object.values(data);
      }
    }
    
    console.log('Orders data after processing:', JSON.stringify(ordersData, null, 2));
    
    // Transform Elogistia data to match our format
    const orders = Array.isArray(ordersData) ? ordersData.map((order: any, index: number) => {
      // Normaliser le statut pour correspondre à OrderStatus
      let status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'DELIVERED' = 'PENDING';
      const orderStatus = order['Status']?.toUpperCase();
      
      if (orderStatus === 'CONFIRMED' || orderStatus === 'CONFIRMÉE') {
        status = 'CONFIRMED';
      } else if (orderStatus === 'CANCELLED' || orderStatus === 'ANNULÉE') {
        status = 'CANCELLED';
      } else if (orderStatus === 'DELIVERED' || orderStatus === 'LIVRÉE') {
        status = 'DELIVERED';
      }
      
      return {
        id: order.CommandeID || `order-${index}`,
        orderNumber: order.CommandeID || order.Tracking,
        customerName: `${order['Prénom'] || ''} ${order['Nom'] || ''}`.trim(),
        customerPhone: order['Téléphone'],
        customerEmail: order['E-mail'],
        address: order['Addresse'],
        wilaya: order['Wilaya ']?.trim() || order.Wilaya,
        municipality: order['Commune ']?.trim() || order.Commune,
        deliveryType: 'HOME',
        shippingCost: parseFloat(order['Frais de livraison'] || 0),
        subtotal: parseFloat(order['Total Recouvrement'] || 0) - parseFloat(order['Frais de livraison'] || 0),
        total: parseFloat(order['Total Recouvrement'] || 0),
        status: status,
        trackingNumber: order['Tracking'],
        createdAt: new Date().toISOString(),
        items: order['Produit'] ? [{
          id: `item-${index}-0`,
          productName: order['Produit'].trim(),
          quantity: 1,
            unitPrice: parseFloat(order['Total Recouvrement'] || 0) - parseFloat(order['Frais de livraison'] || 0),
          total: parseFloat(order['Total Recouvrement'] || 0) - parseFloat(order['Frais de livraison'] || 0),
        }] : [],
      };
    }) : [];

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching Elogistia orders:', error);
    // Return empty array instead of 500 error to avoid breaking the UI
    return NextResponse.json([]);
  }
}
