import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ✅ правильная сигнатура
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: numericId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
