'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useModal } from '../../components/ModalProvider'
export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { openAdminModal } = useModal()

  const [phone, setPhone] = useState('')
  const [region, setRegion] = useState('')
  const [userRole, setUserRole] = useState('')
    const [userPassword, setUserPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
const [loading , setLoading ] = useState(true)
  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user?.email) router.replace('/api/auth/signin')
  }, [session, status, router])

  useEffect(() => {
    const storedPhone = localStorage.getItem('userPhone') || 'Телефон не найден'
    const selectedRegion = localStorage.getItem('selectedRegion') || 'Регион не выбран'
    setPhone(storedPhone)
    setRegion(selectedRegion)
  }, [])



  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        if (session?.user?.email) {
          const res = await fetch(`/api/users?email=${session.user.email}`)
          if (!res.ok) throw new Error('Ошибка получения роли пользователя')
          const data = await res.json()
          setUserRole(data.user?.role || 'Неизвестно')
          setUserPassword(data.user?.password || "Неизвестно")
        }
      } catch (err) {
        console.error('Ошибка при получении роли:', err)
        setUserRole('Ошибка')
      }
      finally {
        setLoading(false);
      }
    }

    fetchUserRole()
  }, [session])

  if (status === 'loading') return <div>Загрузка...</div>
  if (!session?.user) return null
    if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  const { name, email, image } = session.user
if (userRole === 'banned') {
  return (
    <div className="w-full h-screen  flex items-center justify-center flex-col gap-2">
      <p className=" text-2xl font-bold text-red-500">Ваш аккаунт заблокирован</p>
            <p className=" text-xl font-bold text-red-500">Вы ограничены по доступу</p>

       <Link href="/api/auth/signout" className="w-[400px] h-[50px] flex items-center justify-center bg-red-600 text-white font-bold rounded">
                  Выйти
                </Link>
    </div>
  )
}

  return (
    <div className='w-full h-screen flex flex-col items-center justify-end'>
      <div className='w-full h-[95%]'>
        <div className='w-[90%] h-[90%] bg-[#f4f5f5] mx-auto rounded-lg shadow-[0_5px_12px_rgba(0,0,0,0.2)] pb-10'>
          <h1 className="text-4xl font-extrabold text-start text-green-950 tracking-wide my-4 pl-10 pt-5" id="profile-text">Профиль</h1>

          <div className="w-[95%] rounded-lg flex  gap-5 items-start justify-start mx-auto h-[85%] bg-gray-200 py-5 px-5" id="pr-cont">
            <div className="w-[300px] h-full bg-gray-100 rounded-lg py-5 px-3">
              <h1 className="text-3xl font-extrabold text-center text-green-950 tracking-wide" id="profile-navigation">Навигация</h1>
              <div className="w-full h-[90%] bg-gray-200 rounded-lg flex flex-col gap-3 items-center justify-between py-3">
                <div className="w-full flex flex-col items-center gap-3">
                  <Link href={'/'} className="w-[95%] h-[50px] flex gap-2 items-center justify-center cursor-pointer bg-[#edf3f6] text-yellow-700 font-bold rounded">
                    <Image src="/logo.png" alt="Luxique Logo" width={40} height={35} id="pr-main-img" />
                    Главная
                  </Link>
                  <Link href={'/cart'} className="w-[95%] h-[50px] flex items-center justify-center bg-green-800 text-white font-bold rounded" id="cart-pr-btn">
                    Перейти в корзину
                  </Link>
              {userRole !== 'admin' && userRole !== 'director' && (
  <Link href="/time" className="w-[95%] h-[50px] flex items-center justify-center bg-white text-green-900 gap-3 font-bold rounded">
    <Image src="/time.png" alt="Time Icon" width={30} height={30} id="pr-time-img" />
    Мои заказы
  </Link>
)}

                  <Link href={'/search'} className="w-[95%] h-[50px] flex items-center justify-center bg-[#3a503f] text-white gap-3 font-bold rounded">
                    <Image src="/search.png" alt="Search Icon" width={30} height={30} id="pr-search-img" />
                    Поиск
                  </Link>
{(userRole === 'admin' || userRole === 'director') && (
                    <button onClick={openAdminModal} className="w-[95%] h-[50px] flex gap-3 items-center justify-center bg-white text-green-900 font-bold rounded" >
                      <Image src={"/admin.png"} alt="Admin" width={40} height={40} className="rounded" id="admin-img"/>
                      администрация
                    </button>
                  )}



{(userRole === 'seller'  || userRole === 'director') && (
                    <Link       href={`/seller/${email}`}
                    className="w-[95%] h-[50px] flex gap-3 items-center justify-center bg-white text-green-900 font-bold rounded" >
                      Страница продавца
                    </Link>
                  )}
                </div>
                <Link href="/api/auth/signout" className="w-[95%] h-[50px] flex items-center justify-center bg-red-600 text-white font-bold rounded">
                  Выйти
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex  gap-5" id="profile-info">
                <Image
                  src={image || '/user.png'}
                  alt="User Avatar"
                  width={200}
                  height={200}
                  className="rounded border w-[200px] h-[200px]"
                />
                <div id="pr-text-cont">
                  <h1 className="text-[30px] font-bold ">{name || 'Нет имени'}</h1>
                  <p className="text-gray-600  text-[20px]">{email}</p>
                  <p className="text-gray-600  text-[20px]">{phone}</p>
 <p
      className="text-gray-600 text-[20px] cursor-pointer"
      onClick={() => setShowPassword(true)}
    >
      Пароль:{' '}
      <span className={showPassword ? '' : 'blur-[3px] select-none'}>
        {userPassword}
      </span>
    </p>                  <p className="text-gray-600  text-[20px]">{region}</p>
                  <p className="text-gray-800  text-[20px] font-semibold">Роль: {userRole}</p>
                </div>
              </div>

          
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
