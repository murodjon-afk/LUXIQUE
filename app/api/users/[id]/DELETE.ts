
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  
  await prisma.user.delete({ where: { id } })

  return NextResponse.json({ message: 'User deleted' })
}
