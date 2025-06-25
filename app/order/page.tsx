'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import MyOrders from '@/components/MyOrders'
interface Order {
  id: number
  buyerId: number
  sellerId: number
  products: {
    title: string
    price: number
    total: number
    productId: number
  }[]
  status: string
  createdAt?: string
}


interface User {
  id: number
  email: string
  name?: string
  buyerId:number
}
export default function OrdersPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
useEffect(() => {
  const fetchData = async () => {
    if (!session || !session.user || !session.user.email) return

    try {
      const usersRes = await fetch('/api/users')
      const usersData = await usersRes.json()
      const users = usersData.users || usersData

      const matchedUser = users.find((user: User) => user.email === session.user!.email)
      if (!matchedUser) return

      const ordersRes = await fetch('/api/orders')
      const ordersData = await ordersRes.json()
      const allOrders = ordersData.orders || ordersData

      const userOrders = allOrders.filter((order: User) => order.buyerId === matchedUser.id)
      setOrders(userOrders)
    } catch (error) {
      console.error('Ошибка при получении заказов:', error)
    }
  }

  fetchData()
}, [session])
 if (orders.length === 0) {
  return (
     <div className="w-full h-[100vh]  flex flex-col items-center justify-center  text-center text-gray-500 ">
      <div className="relative w-64 h-64 ">
        <Image
          src="/empty.png"
          alt="Нет заказов"
          fill
          className="object-contain"
        />
      </div>
      <p className="text-xl font-semibold mb-2">Вы еще ничего не заказали</p>

     <button className='font-medium text-xl text-white bg-green-900 w-[200px] h-[40px] rounded-lg cursor-pointer'>
         Корзина
     </button>
    </div>
  )
}


  return (
     <div className="w-[100%] h-[100vh]">
       <div className='w-[100%] h-[100vh] flex flex-col items-center justify-center'>
      <div className='w-[100%] h-[95%]'>



   <div id="cart-container" className="w-[90%] h-[90%] bg-[#f4f5f5] mx-auto rounded-lg shadow-[0_5px_12px_rgba(0,0,0,0.2)] py-5">
    <h1 className='text-3xl text-center font-medium  text-green-900'>Заказы</h1>
<MyOrders></MyOrders>

    </div>
      </div>
       
    </div>
    </div>
  )
}
