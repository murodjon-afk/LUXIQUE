'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image'
import { toast } from 'sonner'

export type Product = {
  id: number
  title: string
  price: number
  image: string
  quantity: number
  sellerId: number
}

export type User = {
  id: number
  email: string
  name?: string
  role: string
  phone: string
}

export type Order = {
  id: string
  status: string
  buyerId: number
  sellerId: number
  productIds: number[]
  buyer?: User
  seller?: User
  products?: Product[]
}

export default function MyOrders() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.email) {
        toast.error('Не авторизованы')
        return
      }

      try {
        const usersRes = await fetch('/api/users')
        const usersData = await usersRes.json()
        const users: User[] = usersData.users || usersData

        const matchedUser = users.find((user) => user.email === session.user?.email)
        if (!matchedUser) return

        const userId = matchedUser.id

        const ordersRes = await fetch('/api/orders')
        const ordersData = await ordersRes.json()
        const allOrders: Order[] = ordersData.orders || ordersData

        const userOrders = allOrders.filter((order) => order.buyerId === userId)
        setOrders(userOrders)
      } catch (error) {
        toast.error('Ошибка при загрузке заказов')
        console.error(error)
      }
    }

    fetchData()
  }, [session])

  const openModalWithProducts = async (productIds: number[]) => {
    try {
      const res = await fetch('/api/products')
      const allProducts: Product[] = await res.json()

      const filtered = productIds.flatMap(id => {
        const product = allProducts.find((p) => p.id === id)
        return product ? [product] : []
      })

      setSelectedProducts(filtered)
      setModalOpen(true)
    } catch  {
      toast.error('Ошибка при загрузке продуктов заказа')
    }
  }

  const deleteOrder = async (id: string) => {
    const orderToDelete = orders.find(order => order.id === id)
    if (!orderToDelete) return toast.error('Заказ не найден')
    if (['ready', 'delivered'].includes(orderToDelete.status)) {
      return toast.warning('Нельзя отменить завершённый заказ')
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error()

      setOrders(prev => prev.filter(order => order.id !== id))
      toast.success('Заказ удалён')
    } catch {
      toast.error('Ошибка при удалении заказа')
    }
  }

  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(searchTerm) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-[95%] mx-auto mt-6 h-[90%] overflow-auto rounded-lg shadow bg-white p-4">
      <input
        type="text"
        placeholder="Поиск по ID, статусу или покупателю..."
        className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Таблица заказов */}
      <div id="ad-ord-tabel">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead className="bg-green-100 text-green-900 text-left text-sm">
            <tr className="h-[45px]">
              <th className="px-4 py-2">Покупатель</th>
              <th className="px-4 py-2">Продавец</th>
              <th className="px-4 py-2">Статус</th>
              <th className="px-4 py-2">Продуктов</th>
              <th className="px-4 py-2">Действие</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700 bg-white/60">
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-50 h-[60px]"
                  onClick={() => openModalWithProducts(order.productIds)}
                >
                  <td className="px-4 py-2">{order.buyer?.name || '—'}</td>
                  <td className="px-4 py-2">{order.seller?.name || '—'}</td>
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-4 py-2">{order.productIds?.length || 0}</td>
                  <td className="px-4 py-2" onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="cursor-pointer text-sm text-green-700">Edit</DropdownMenuTrigger>
                      <DropdownMenuContent className="flex flex-col gap-2 px-2 py-2">
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Отмена
                        </button>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">Нет заказов</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Карточки заказов */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6" id="ad-ord-block">
        {filteredOrders.map(order => (
          <div
            key={order.id}
            className="border rounded-lg shadow-sm p-4 bg-white"
            onClick={() => openModalWithProducts(order.productIds)}
          >
            <p className="text-sm font-semibold text-gray-800">Заказ</p>
            <p className="text-xs text-gray-600 mt-1">👤 {order.buyer?.name || '—'}</p>
            <p className="text-xs text-gray-600">🏪 {order.seller?.name || '—'}</p>
            <p className="text-xs text-gray-600">📦 {order.productIds?.length || 0}</p>
            <p className="text-xs font-medium mt-1 text-green-600">Статус: {order.status}</p>
            <div className="mt-4 flex gap-2" onClick={e => e.stopPropagation()}>
              <button
                className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition"
                onClick={() => deleteOrder(order.id)}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно с продуктами */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-2"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-green-900 mb-4">Продукты в заказе</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedProducts.map((product, index) => (
                <div key={`${product.id}-${index}`} className="border rounded-lg p-4 flex gap-4 items-center">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={70}
                    height={70}
                    className="object-contain rounded-md"
                  />
                  <div>
                    <p className="font-semibold text-green-900">{product.title}</p>
                    <p className="text-sm text-gray-600">{product.price} $</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-6 px-4 py-2 bg-green-900 text-white rounded hover:bg-green-800 transition"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
