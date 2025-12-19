import { NextResponse } from 'next/server';
import { getshippingCosts } from '@/lib/elogistia';

// Deprecated: Use /api/elogistia/wilayas instead
export async function GET() {
  try {
    const wilayas = await getshippingCosts();
    return NextResponse.json(wilayas);
  } catch (error) {
    console.error('Error fetching wilayas:', error);
    return NextResponse.json([], { status: 500 });
  }
}
