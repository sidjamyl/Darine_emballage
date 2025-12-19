import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth-server';
import { ELOGISTIA_API_KEY, ELOGISTIA_BASE_URL } from '@/lib/services/elogistia/config';

/**
 * GET all orders from Elogistia API (FIXED VERSION)
 * Admin only endpoint
 * This version properly handles the { body: [...] } response structure
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
    
    console.log('Fetching orders from Elogistia (FIXED):', url.replace(ELOGISTIA_API_KEY, 'API_KEY_HIDDEN'));
    
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
      return NextResponse.json([]);
    }

    const data = await response.json();
    
    console.log('Elogistia API full response:', JSON.stringify(data, null, 2));
    
    // FIXED: Properly extract orders from the response
    let ordersArray = [];
    
    // Check if response has a "body" property (the actual orders array)
    if (data && data.body && Array.isArray(data.body)) {
      console.log('Found orders in data.body, count:', data.body.length);
      ordersArray = data.body;
    } 
    // Fallback to other possible structures
    else if (Array.isArray(data)) {
      console.log('Data is already an array, count:', data.length);
      ordersArray = data;
    } 
    else if (data && data.orders && Array.isArray(data.orders)) {
      console.log('Found orders in data.orders');
      ordersArray = data.orders;
    }
    else {
      console.warn('Could not find orders array in response');
      ordersArray = [];
    }
    
    // Transform Elogistia data to match our format
    const orders = ordersArray.map((order: any, index: number) => {
      // Normaliser le statut pour correspondre à OrderStatus
      let status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'DELIVERED' = 'PENDING';
      const orderStatus = order['Status']?.toUpperCase();
      
      if (orderStatus === 'CONFIRMED' || orderStatus === 'CONFIRMÉE') {
        status = 'CONFIRMED';
      } else if (orderStatus === 'CANCELLED' || orderStatus === 'ANNULÉE') {
        status = 'CANCELLED';
      } else if (orderStatus === 'DELIVERED' || orderStatus === 'LIVRÉE') {
        status = 'DELIVERED';
      } else if (orderStatus?.includes('LIVR') || orderStatus?.includes('RÉGLÉE')) {
        status = 'DELIVERED';
      } else if (orderStatus === 'RETOUR' || orderStatus?.includes('RETOUR')) {
        status = 'CANCELLED';
      } else if (orderStatus === 'BROUILLON') {
        status = 'PENDING';
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
        status: status,
        trackingNumber: order['Tracking'] || '',
        createdAt: new Date().toISOString(),
        items: order['Produit'] ? [{
          id: `item-${index}-0`,
          productName: (order['Produit'] || '').trim(),
          quantity: 1,
          unitPrice: parseFloat(order['Total Recouvrement'] || 0) - parseFloat(order['Frais de livraison'] || order['Frais ELogistia'] || 0),
          total: parseFloat(order['Total Recouvrement'] || 0) - parseFloat(order['Frais de livraison'] || order['Frais ELogistia'] || 0),
        }] : [],
      };
    });

    console.log(`Returning ${orders.length} transformed orders`);
    if (orders.length > 0) {
      console.log('First order sample:', JSON.stringify(orders[0], null, 2));
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching Elogistia orders:', error);
    return NextResponse.json([]);
  }
}
