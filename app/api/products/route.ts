import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUser } from '@/lib/auth-server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const popular = searchParams.get('popular');
  const id = searchParams.get('id');

  try {
    if (id) {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          variants: true,
        },
      });

      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json(product);
    }
    const products = await prisma.product.findMany({
      where: popular === 'true' ? { isPopular: true } : undefined,
      include: {
        variants: true,
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ] as any,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getUser();
    console.log('POST /api/products - Session User:', sessionUser);

    if (!sessionUser?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch full user from DB to be sure about the role
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
    });

    if (!user || user.role !== 'ADMIN') {
      console.log('Unauthorized access attempt. Role:', user?.role);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validation des champs obligatoires
    if (!body.nameFr || !body.nameAr || !body.descriptionFr || !body.descriptionAr || !body.price || !body.type || !body.image) {
      return NextResponse.json({
        error: 'Tous les champs sont obligatoires (nameFr, nameAr, descriptionFr, descriptionAr, price, type, image)'
      }, { status: 400 });
    }

    // Validation du prix
    if (typeof body.price !== 'number' || body.price <= 0) {
      return NextResponse.json({ error: 'Le prix doit être un nombre positif' }, { status: 400 });
    }

    // Validation du type
    if (body.type !== 'FOOD' && body.type !== 'PACKAGING') {
      return NextResponse.json({ error: 'Le type doit être FOOD ou PACKAGING' }, { status: 400 });
    }

    // Validation des variantes si hasVariants est true
    if (body.hasVariants && (!body.variants || body.variants.length === 0)) {
      return NextResponse.json({ error: 'Au moins une variante est requise' }, { status: 400 });
    }

    const { variants, ...productData } = body;

    const product = await prisma.product.create({
      data: {
        ...productData,
        variants: body.hasVariants ? {
          create: variants.map((v: any) => ({
            nameFr: v.nameFr,
            nameAr: v.nameAr,
            priceAdjustment: v.priceAdjustment || 0,
          })),
        } : undefined,
      },
      include: {
        variants: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const sessionUser = await getUser();

    if (!sessionUser?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch full user from DB
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const body = await request.json();

    // Validation des champs obligatoires
    if (!body.nameFr || !body.nameAr || !body.descriptionFr || !body.descriptionAr || !body.price || !body.type || !body.image) {
      return NextResponse.json({
        error: 'Tous les champs sont obligatoires (nameFr, nameAr, descriptionFr, descriptionAr, price, type, image)'
      }, { status: 400 });
    }

    // Validation du prix
    if (typeof body.price !== 'number' || body.price <= 0) {
      return NextResponse.json({ error: 'Le prix doit être un nombre positif' }, { status: 400 });
    }

    // Validation du type
    if (body.type !== 'FOOD' && body.type !== 'PACKAGING') {
      return NextResponse.json({ error: 'Le type doit être FOOD ou PACKAGING' }, { status: 400 });
    }

    // Validation des variantes si hasVariants est true
    if (body.hasVariants && (!body.variants || body.variants.length === 0)) {
      return NextResponse.json({ error: 'Au moins une variante est requise' }, { status: 400 });
    }

    const { variants, ...productData } = body;

    // Supprimer les anciennes variantes si elles existent
    await prisma.productVariant.deleteMany({
      where: { productId: id },
    });

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        variants: body.hasVariants ? {
          create: variants.map((v: any) => ({
            nameFr: v.nameFr,
            nameAr: v.nameAr,
            priceAdjustment: v.priceAdjustment || 0,
          })),
        } : undefined,
      },
      include: {
        variants: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const sessionUser = await getUser();

    if (!sessionUser?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch full user from DB
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
