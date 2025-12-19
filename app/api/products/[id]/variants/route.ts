// app/api/products/[id]/variants/route.ts (ou ton chemin correspondant)

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const variants = await prisma.productVariant.findMany({
      where: {
        productId: id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(variants);
  } catch (error) {
    console.error('Error fetching variants:', error);
    return NextResponse.json([], { status: 500 });
  }
}
