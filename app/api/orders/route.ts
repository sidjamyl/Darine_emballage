import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createElogistiaOrder } from '@/lib/elogistia';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      address,
      wilayaId,
      wilaya,
      municipalityId,
      municipality,
      deliveryType,
      shippingCost,
      subtotal,
      total,
      items,
    } = body;

    // Generate order number
    const orderNumber = `DRN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order in database first
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        customerEmail,
        address,
        wilayaId,
        wilaya,
        municipalityId,
        municipality,
        deliveryType,
        shippingCost,
        subtotal,
        total,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            variantName: item.variantName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Send order to Elogistia
    const elogistiaResult = await createElogistiaOrder({
      customerName,
      customerPhone,
      customerEmail,
      address,
      wilayaId,
      municipality,
      deliveryType: deliveryType as 'HOME' | 'STOPDESK',
      shippingCost,
      products: items.map((item: any) => ({
        name: item.variantName 
          ? `${item.productName} - ${item.variantName} (x${item.quantity})` 
          : `${item.productName} (x${item.quantity})`,
        price: item.total,
      })),
      notes: `Sous-total: ${subtotal} DA | Frais de livraison: ${shippingCost} DA | Total: ${total} DA`,
      orderNumber,
    });

    // Update order with Elogistia tracking if successful
    if (elogistiaResult.success && elogistiaResult.trackingNumber) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          trackingNumber: elogistiaResult.trackingNumber,
          status: 'CONFIRMED',
        },
      });
      
      return NextResponse.json({
        ...order,
        trackingNumber: elogistiaResult.trackingNumber,
        status: 'CONFIRMED',
      }, { status: 201 });
    } else {
      // If Elogistia fails, keep order as PENDING for manual processing
      console.error('Elogistia order creation failed:', elogistiaResult.error);
      return NextResponse.json({
        ...order,
        warning: 'Order created locally but failed to sync with Elogistia',
      }, { status: 201 });
    }

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const orders = await prisma.order.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json([], { status: 500 });
  }
}
