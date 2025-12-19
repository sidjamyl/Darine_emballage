import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(slides);
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json([], { status: 500 });
  }
}
