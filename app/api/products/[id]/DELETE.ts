import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';



export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Продукт удалён' });
  } catch (error) {
    console.error('Ошибка при удалении продукта:', error);
    return NextResponse.json({ error: 'Ошибка при удалении' }, { status: 500 });
  }
}
