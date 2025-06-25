'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import AddProductModal from '@/components/AddProductModal'
import UsersTable from '@/components/UsersTable'
import CategoryChart from '@/components/CategoryChart'
import RatingChart from '@/components/RatingChart'
import ProductsTable from '@/components/ProductsTable'
import OrdersTable from '../../../../../components/OrderTable'
interface User {
  id: number
  name: string
  email: string
  role: string
  phone:number
}

const AdminUserPage = () => {
  const { data: session } = useSession()
const { email } = useParams()
    const [isOpen, setIsOpen] = useState(false)

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
useEffect(() => {
  const fetchUser = async () => {
    try {
      const decodedEmail = decodeURIComponent(email as string)
      const res = await fetch(`/api/users?email=${decodedEmail}`)

      if (!res.ok) throw new Error('Ошибка при загрузке пользователя')

      const data = await res.json()
      setUser(data.user)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Неизвестная ошибка')
      }
    } finally {
      setLoading(false)
    }
  }

  if (email) fetchUser()
}, [email])


  const image = session?.user?.image || '/user.png'

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center p-10">{error}</div>
  }

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <div className="w-full h-[95%] p-4">
        <div className="w-[90%] h-full mx-auto bg-[#f4f5f5] rounded-lg shadow-md p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold text-green-900 mb-6">Администрация</h1>

        <div className="">
            <div className="flex items-center gap-6 mb-2">
            <Image
              src={image}
              alt="User Avatar"
              width={100}
              height={100}
              className="rounded border w-[100px] h-[100px]"
            />
            {user ? (
              <div className="text-base space-y-1">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Имя:</strong> {user.name}</p>
                <p><strong>Роль:</strong> {user.role}</p>
                <p className="text-gray-500 text-sm"><strong>Телефон:</strong> {user.phone || '—'}</p>
                
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Нет данных о пользователе</p>
            )}
            
          </div>
                    <button className='h-[40px] w-[180px] bg-green-900 text-white rounded mb-5 cursor-pointer'onClick={() => setIsOpen(true)}>Создать свой Продукт </button>

        </div>

          <div className="flex flex-col xl:flex-row gap-6">
            <div className="flex flex-col gap-6 w-full xl:w-[40%]">
              <CategoryChart />
              <RatingChart />
            </div>

            <div className="w-full xl:w-[60%] h-[60vh] bg-white rounded-lg shadow overflow-hidden">
              <UsersTable />
              
            </div>
          </div>
          <div className="w-[99%] h-[70vh] my-5 flex gap-3 items-center justify-center px-3" id='ad-block-cont'>
                        <div className="w-[100%] h-[95%] bg-white rounded-lg shadow" id='ad-block-2'>

                    <ProductsTable></ProductsTable>

                        </div>
                       <div className="w-[100%] h-[95%] bg-white rounded-lg shadow" id='ad-block'>                       
                          <OrdersTable></OrdersTable>
                       </div>


          </div>
        </div>
      </div>

        <AddProductModal
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
            />
    </div>
  )
}

export default AdminUserPage
