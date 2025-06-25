import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'


export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const body = await request.json()

  const updatedUser = await prisma.user.update({
    where: { id },
    data: body
  })

  return NextResponse.json(updatedUser)
}