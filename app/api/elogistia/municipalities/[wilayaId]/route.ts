import { NextResponse } from 'next/server';
import { getMunicipalities } from '@/lib/elogistia';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ wilayaId: string }> }
) {
  try {
    const { wilayaId } = await params;
    const municipalities = await getMunicipalities(wilayaId);
    return NextResponse.json(municipalities);
  } catch (error) {
    console.error('Error fetching municipalities:', error);
    return NextResponse.json([], { status: 500 });
  }
}