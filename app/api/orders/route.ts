import prisma from '@/lib/prisma'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET() {
  try {
    const orders = await prisma.order.findMany()

    const fullOrders = await Promise.all(
      orders.map(async (order: {
        id: string
        status: string
        buyerId: number
        sellerId: number
        productIds: number[]
      }) => {
        const buyer = await prisma.user.findUnique({
          where: { id: order.buyerId }
        })

        const seller = await prisma.user.findUnique({
          where: { id: order.sellerId }
        })

        const products = await prisma.product.findMany({
          where: {
            id: {
              in: order.productIds
            }
          }
        })

        return {
          ...order,
          buyer,
          seller,
          products
        }
      })
    )

    return NextResponse.json(fullOrders)
  } catch (error) {
    console.error('Ошибка при получении заказов:', error)
    return new NextResponse('Ошибка сервера', { status: 500 })
  }
}



export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { title, description, image, price, category, userId } = data;

    const parsedPrice = Number(price);

    if (
      !title ||
      !description ||
      !image ||
      !category ||
      !userId ||
      isNaN(parsedPrice)
    ) {
      return new NextResponse('Неверные данные продукта', { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        image,
        category,
        price: parsedPrice,
        userId,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error('❌ Ошибка при создании продукта:', err);
    return new NextResponse('Ошибка сервера', { status: 500 });
  }
}


export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'ID не передан' }, { status: 400 })
    }

    const existingOrder = await prisma.order.findUnique({ where: { id } })

    if (!existingOrder) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 })
    }

    await prisma.order.delete({ where: { id } })

    return NextResponse.json({ message: 'Заказ успешно удалён' }, { status: 200 })
  } catch (error) {
    console.error('Ошибка при удалении:', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'ID и статус обязательны' }, { status: 400 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Ошибка при обновлении заказа:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}