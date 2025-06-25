'use client'

import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { toast } from 'sonner'

interface Product {
  id: number
  title: string
  price: number
  image: string
  quantity: number
  sellerId: number
}
interface User {
  id: number
  email: string
  name?: string
  role?: 'buyer' | 'seller' | 'admin' | 'banned'
  phone?: string
}

interface Props {
  open: boolean
  onClose: () => void
  products: Product[]
  cartItems: { id: number; quantity: number }[]
}

const PaymentModal = ({ open, onClose, products, cartItems }: Props) => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

  const getTotalPrice = () =>
    cartItems.reduce((total, cartItem) => {
      const product = products.find((p) => p.id === cartItem.id)
      const quantity = cartItem.quantity || 1
      return total + (product?.price || 0) * quantity
    }, 0)

  const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)

  // 📦 Создаём массив с дубликатами товаров по quantity
  const expandedProducts = cartItems.flatMap((item) => {
    const product = products.find((p) => p.id === item.id)
    if (!product) return []
    return Array(item.quantity).fill(product)
  })

  if (!open) return null

  const handleOrder = async () => {
    if (!session?.user?.email) {
      toast.error('Вы не авторизованы!')
      return
    }

    setLoading(true)

    try {
      const sessionEmail = session.user.email

      const userRes = await fetch('/api/users')
      const userData = await userRes.json()
      const users = Array.isArray(userData) ? userData : userData.users

      if (!Array.isArray(users)) {
        toast.error('Ошибка при получении пользователей')
        return
      }

const buyer = (users as User[]).find((u) => u.email === sessionEmail)
      if (!buyer) {
        toast.error('Покупатель не найден')
        return
      }

      const buyerId = buyer.id
      const cartRaw = localStorage.getItem('cart')
      if (!cartRaw) {
        toast.error('Корзина пуста')
        return
      }

const cart: { id: number; quantity: number; userId: number }[] = JSON.parse(cartRaw)
     const productIds = cart.map((item) => item.id)
const sellerId = cart.find((item) => productIds.includes(item.id))?.userId


      if (!sellerId) {
        toast.error('sellerId не найден')
        return
      }

      const orderData = {
        buyerId,
        sellerId,
        productIds,
        status: 'started',
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      if (!res.ok) {
        throw new Error('Ошибка при создании заказа')
      }

      toast.success('Заказ успешно создан!')
      localStorage.removeItem('cart')
      onClose()
      window.location.reload()
    } catch (err) {
      console.error('❌ Ошибка:', err)
      toast.error('Ошибка при заказе')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-[90%] md:w-[600px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-green-900 mb-4">Оформление заказа</h2>

        <div className="mb-4">
          <p className="text-lg">
            Общая сумма: <span className="font-semibold">{getTotalPrice().toFixed(2)} $</span>
          </p>
          <p className="text-lg">
            Количество товаров: <span className="font-semibold">{totalQuantity}</span>
          </p>
          <p className="text-lg">
            Вид оплаты: <span className="font-semibold">Наличными</span>
          </p>
        </div>

        <div className="space-y-3 min-h-[100px] max-h-[250px] overflow-auto">
          {expandedProducts.map((product, index) => (
            <div key={index} className="flex items-center gap-4 border p-2 rounded-lg">
              <Image
                src={product.image}
                alt={product.title}
                width={60}
                height={60}
                className="rounded object-contain"
              />
              <div>
                <p className="font-semibold">{product.title}</p>
                <p className="text-gray-600">Цена: {product.price} $</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Закрыть
          </button>
          <button
            disabled={loading}
            onClick={handleOrder}
            className="px-4 py-2 bg-green-900 text-white rounded hover:bg-green-800 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Отправка...' : 'Заказать'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
