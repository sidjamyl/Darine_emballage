import { NextResponse } from 'next/server';
import { getWilayasWithCosts } from '@/lib/elogistia';

export async function GET() {
  try {
    const wilayas = await getWilayasWithCosts();
    return NextResponse.json(wilayas);
  } catch (error) {
    console.error('Error fetching wilayas:', error);
    return NextResponse.json([], { status: 500 });
  }
}