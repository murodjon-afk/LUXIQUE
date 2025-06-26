import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

interface ProductUpdateData {
  title?: string;
  price?: number;
  description?: string;
  category?: string;
  userId?: number;
  rating?: { rate: number; count: number };
  image?: string;
}

// ==================== GET ====================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get('id');

    if (idParam) {
      const id = parseInt(idParam);
      if (isNaN(id)) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
      }

      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        return NextResponse.json([], { status: 200 });
      }

      return NextResponse.json([product]);
    }

    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error('❌ Ошибка в GET /api/products:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}


export const runtime = 'nodejs'; 

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const price = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const userId = parseInt(formData.get('userId') as string);
    const image = formData.get('image') as File | null;
    const ratingRaw = formData.get('rating');
    const rating = ratingRaw ? JSON.parse(ratingRaw.toString()) : undefined;

    if (!title || isNaN(price) || !category || isNaN(userId)) {
      return NextResponse.json({ error: 'Недопустимые данные' }, { status: 400 });
    }

    let imagePath = '';

    if (image && image.name) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, image.name);
      await writeFile(filePath, buffer);

      imagePath = `/uploads/${image.name}`;
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        price,
        description,
        category,
        image: imagePath,
        userId,
        rating,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('❌ Ошибка при создании продукта:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
// ==================== PATCH ====================
export async function PATCH(request: NextRequest) {
  try {
    const formData = await request.formData();

    const idRaw = formData.get('id');
    const id = idRaw ? parseInt(idRaw.toString()) : NaN;

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

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
    console.error('❌ Ошибка при обновлении продукта:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: 'Неверный ID' }, { status: 400 });
    }

    const deleted = await prisma.product.delete({
      where: { id: parsedId },
    });

    return NextResponse.json(deleted);
  } catch (error) {
    console.error('Ошибка при удалении:', error);
    return NextResponse.json({ error: 'Ошибка сервера при удалении' }, { status: 500 });
  }
}