import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';


export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const price = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const userId = parseInt(formData.get('userId') as string);
    const rating = JSON.parse(formData.get('rating') as string);
    const image = formData.get('image') as File | null;

    let imageUrl: string | undefined = undefined;

    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = `${Date.now()}-${image.name}`;
      const filePath = path.join(process.cwd(), 'public/uploads', filename);
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title,
        price,
        description,
        category,
        userId,
        rating,
        ...(imageUrl && { image: imageUrl }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Ошибка при обновлении продукта:', error);
    return NextResponse.json({ error: 'Ошибка при обновлении продукта' }, { status: 500 });
  }
}
