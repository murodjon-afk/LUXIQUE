import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';

interface ProductUpdateData {
  title?: string;
  price?: number;
  description?: string;
  category?: string;
  userId?: number;
  rating?: { rate: number; count: number };
  image?: string;
}

// ==================== PATCH ====================
export async function PATCH(
  request: Request,
  context: { params: { id: string } } // <-- исправлено: { params } -> context
) {
  const { params } = context;

  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const formData = await request.formData();
    const data: Partial<ProductUpdateData> = {};

    const title = formData.get('title');
    if (title) data.title = title.toString();

    const description = formData.get('description');
    if (description) data.description = description.toString();

    const category = formData.get('category');
    if (category) data.category = category.toString();

    const price = formData.get('price');
    if (price) data.price = Number(price);

    const userId = formData.get('userId');
    if (userId) data.userId = Number(userId);

    const rating = formData.get('rating');
    if (rating) {
      try {
        const parsedRating = JSON.parse(rating.toString());
        if (
          typeof parsedRating?.rate === 'number' &&
          typeof parsedRating?.count === 'number'
        ) {
          data.rating = {
            rate: parsedRating.rate,
            count: parsedRating.count,
          };
        }
      } catch (e) {
        console.error('Rating parse error:', e);
      }
    }

    const image = formData.get('image');
    if (image instanceof File && image.size > 0) {
      try {
        const buffer = Buffer.from(await image.arrayBuffer());
        const filename = `${Date.now()}-${image.name.replace(/\s+/g, '-')}`;
        const filePath = path.join(process.cwd(), 'public/uploads', filename);
        await writeFile(filePath, buffer);
        data.image = `/uploads/${filename}`;
      } catch (error) {
        console.error('Image save error:', error);
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// ==================== DELETE ====================
export async function DELETE(
  request: Request,
  context: { params: { id: string } } // <-- тоже исправлено
) {
  const { params } = context;

  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
