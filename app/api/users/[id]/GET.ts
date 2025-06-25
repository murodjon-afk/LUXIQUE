import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const user = await prisma.user.findUnique({ where: { id } })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json(user)
}