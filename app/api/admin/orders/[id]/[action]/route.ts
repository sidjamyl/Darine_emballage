// app/api/admin/orders/[id]/[action]/route.ts

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createElogistiaOrder } from '@/lib/elogistia'

const prisma = new PrismaClient()

// Si tu veux un typage encore plus strict, tu peux utiliser RouteContext:
// type OrderActionRoute = RouteContext<'/api/admin/orders/[id]/[action]'>
// export async function POST(request: NextRequest, ctx: OrderActionRoute) {
//   const { id, action } = await ctx.params
//   ...
// }

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; action: string }> }
) {
  try {
    const { id, action } = await params

    if (action !== 'confirm' && action !== 'cancel') {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (order.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Order already processed' },
        { status: 400 }
      )
    }

    if (action === 'cancel') {
      // Cancel order
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status: 'CANCELLED' },
      })

      return NextResponse.json(updatedOrder)
    }

    if (action === 'confirm') {
      // Confirm order and send to Elogistia
      const elogistiaResult = await createElogistiaOrder({
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        address: order.address,
        wilayaId: order.wilayaId,
        municipality: order.municipality,
        deliveryType: order.deliveryType.toUpperCase() as 'HOME' | 'STOPDESK',
        shippingCost: order.shippingCost,
        products: order.items.map((item) => ({
          name: item.productName,
          price: item.unitPrice,
        })),
        notes: `Order ${order.orderNumber}`,
        orderNumber: order.orderNumber,
      })

      if (elogistiaResult.success) {
        // Update order with tracking number and status
        const updatedOrder = await prisma.order.update({
          where: { id },
          data: {
            status: 'CONFIRMED',
            trackingNumber: elogistiaResult.trackingNumber,
          },
        })

        return NextResponse.json(updatedOrder)
      } else {
        // Even if Elogistia fails, mark as confirmed but log the error
        console.error('Elogistia order creation failed:', elogistiaResult.error)

        const updatedOrder = await prisma.order.update({
          where: { id },
          data: {
            status: 'CONFIRMED',
            notes: `Elogistia error: ${elogistiaResult.error}`,
          },
        })

        return NextResponse.json(updatedOrder)
      }
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error processing order action:', error)
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    )
  }
}
