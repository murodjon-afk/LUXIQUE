import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
interface Product {
  id: number
  title: string
  price: number
  image: string
  sellerId: number
}

interface OrderPayload {
  products: Product[] 
  region: string
  total: number
  quantity: number
  status?: string
  date?: string
}

interface UserPayload {
  email: string
  name: string
  password: string
  phone: string
  role?: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Заказ
    if (body.products && Array.isArray(body.products)) {
      const { products, region, total, quantity, status = "готовится", date } = body as OrderPayload

      console.log("Новый заказ:", { products, region, total, quantity, status, date })

      return NextResponse.json({ message: "Заказ успешно получен!" }, { status: 200 })
    }

    // Регистрация пользователя
    const { email, name, password, phone, role = "buyer" } = body as UserPayload

    if (!email || !name || !password || !phone) {
      return NextResponse.json({ error: "Обязательные поля отсутствуют" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return NextResponse.json({ message: "Пользователь уже существует", user: existingUser }, { status: 200 })
    }

    const newUser = await prisma.user.create({
      data: { email, name, password, phone, role }
    })

    return NextResponse.json({ message: "Пользователь создан", user: newUser }, { status: 201 })

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error"
    console.error("Ошибка в POST /api/users:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          phone: true,
          password:true
        },
      })

      if (!user) {
        return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
      }

      return NextResponse.json({ user })
    } else {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          phone: true,
          password:true
        },
      })

      return NextResponse.json({ users })
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error"
    console.error("Ошибка в GET /api/users:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

interface PatchPayload {
  id: number
  name?: string
  phone?: string
  role?: string
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, name, phone, role } = body as PatchPayload

    if (!id) {
      return NextResponse.json({ error: 'ID обязателен' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(role && { role }),
      },
    })

    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка при обновлении пользователя'
    console.error("Ошибка в PATCH /api/users:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
