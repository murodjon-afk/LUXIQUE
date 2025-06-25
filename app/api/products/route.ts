import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';
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
        return NextResponse.json([], { status: 200 }); // важно: пустой массив
      }

      return NextResponse.json([product]); // массив, чтобы frontend не ломался
    }

    // Без id — вернуть все товары
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error("❌ Ошибка в GET /api/products:", error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

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

    console.log('🧾 Полученные данные:', {
      title,
      price,
      description,
      category,
      userId,
      imageName: image?.name,
    });

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

    console.log('✅ Продукт создан:', newProduct);
    return NextResponse.json(newProduct, { status: 201 });
  }catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message)
  } else {
    console.error('Неизвестная ошибка')
  }
  }
}
