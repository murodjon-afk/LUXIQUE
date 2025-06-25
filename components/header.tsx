"use client";
import { useState, useEffect } from "react";
import { useModal } from "./ModalProvider"; // Уточни путь, если ModalProvider в другом каталоге
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react"

const Header = () => {
  const [userRole, setUserRole] = useState('')

const { openDeliveryModal, openAboutModal, openContactsModal } = useModal();
  const { data: session ,status} = useSession()

 
  const [cartLength, setCartLength] = useState<number>(0);
  const href = session ? "/profile" : "/api/auth/signin"
    const userImage = session?.user?.image || "/user.png";
useEffect(() => {
  const updateCartLength = () => {
    try {
      const cart = localStorage.getItem('cart')
      if (cart) {
        const cartItems = JSON.parse(cart)
        const totalQuantity = cartItems.reduce(
          (acc: number, item: { quantity?: number }) => acc + (item.quantity ?? 1),
          0
        )
        setCartLength(totalQuantity)
      } else {
        setCartLength(0)
      }
    } catch (err) {
      console.error('Ошибка чтения из корзины:', err)
      setCartLength(0)
    }
  }

  updateCartLength()

  window.addEventListener('storage', updateCartLength) // если хочешь отслеживать изменения в других вкладках

  return () => {
    window.removeEventListener('storage', updateCartLength)
  }
}, [])
useEffect(() => {
  const fetchUserRole = async () => {
    if (!session?.user?.email) return

    try {
      const res = await fetch(`/api/users?email=${session.user.email}`)
      if (!res.ok) throw new Error('Ошибка получения роли пользователя')

      const data = await res.json()
      setUserRole(data.user?.role || 'Неизвестно')
    } catch (err) {
      console.error('Ошибка при получении роли:', err)
      setUserRole('Ошибка')
    }
  }

  fetchUserRole()
}, [session?.user?.email])

   if (status === "loading") {
    return <><div>Loading...</div></>;
  }
  
  return (
    <header
      className="
        w-full max-w-[100%] bg-[#EDF3F6] mx-auto flex items-center justify-around 
        p-2 md:px-6 lg:px-10 
        top-2 md:top-4 lg:top-6
        left-0 right-0 z-50 
        h-[60px] md:h-[70px] lg:h-[80px]
      "
    >
      {/* Логотип */}
      <Link href="/" className="flex items-center gap-3 cursor-pointer">
        <Image
          src="/logo.png"
          alt="Luxique Logo"
          width={50}
          height={50}
          className="w-[40px] h-[35px] md:w-[50px] md:h-[45px] lg:w-[70px] lg:h-[60px]"
        />
        <p className="text-lg md:text-2xl lg:text-[30px] text-yellow-700">
          Luxique
        </p>
      </Link>

      {/* Навигация */}
      <nav className="flex md:flex gap-5 lg:gap-5" id="nav">
       <Link
  href={userRole === 'banned' ? '#' : '/search'}
  onClick={(e) => {
    if (userRole === 'banned') {
      e.preventDefault()
      toast.error('Вы забанены и не можете пользоваться этим разделом')
    }
  }}
  className={`w-[80px] lg:w-[100px] h-[40px] text-xs lg:text-base rounded-[10px] flex items-center justify-center gap-1 lg:gap-2 transition
   
     bg-[#3a503f] text-white hover:shadow-[0_0_10px_4px_#6c807b,0_0_20px_10px_#637a73]
  `}
>
  Поиск
</Link>
        <button
          onClick={openDeliveryModal}
          className="w-[80px] lg:w-[100px] h-[40px] text-xs lg:text-base text-white bg-[#3a503f] rounded-[10px] flex items-center justify-center gap-1 lg:gap-2 hover:shadow-[0_0_10px_4px_#6c807b,0_0_20px_10px_#637a73] transition"
        >
          О Доставке
        </button>
         <button
          onClick={openAboutModal}
          className="w-[80px] lg:w-[100px] h-[40px] text-xs lg:text-base text-white bg-[#3a503f] rounded-[10px] flex items-center justify-center gap-1 lg:gap-2 hover:shadow-[0_0_10px_4px_#6c807b,0_0_20px_10px_#637a73] transition"
        >
          О нас
        </button>
      <button
          onClick={openContactsModal}
          className="w-[80px] lg:w-[100px] h-[40px] text-xs lg:text-base text-white bg-[#3a503f] rounded-[10px] flex items-center justify-center gap-1 lg:gap-2 hover:shadow-[0_0_10px_4px_#6c807b,0_0_20px_10px_#637a73] transition"
        >
          Контакты
        </button>
      </nav>

      {/* Иконки */}
      <div className="flex gap-10 ">
        <Link  className="hidden md:inline text-white"  href={userRole === 'banned' ? '#' : '/order'}   onClick={(e) => { if (userRole === 'banned') {e.preventDefault() ; toast.error('Вы забанены и не можете пользоваться этим разделом')}}}> 
          <Image
            src="/time.png"
            alt="Time Icon"
            width={30}
            height={30}
            className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] lg:w-[35px] lg:h-[35px]"
          />
        </Link>

        <Link  className="hidden md:inline text-white   " href={ href}   >
          <Image
            src={userImage}
            alt="User Icon"
            width={30}
            height={30}
            className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] lg:w-[35px] lg:h-[35px] "
          />
        </Link>

        <Link  className="hidden md:inline text-white" href={userRole === 'banned' ? '#' : '/cart'}   onClick={(e) => { if (userRole === 'banned') {e.preventDefault() ; toast.error('Вы забанены и не можете пользоваться этим разделом')}}}>
          <div className="flex items-end">
            <Image
              src="/shopping.png"
              alt="Cart Icon"
              width={30}
              height={30}
              className="w-[25px] h-[25px] md:w-[30px] md:h-[30px] lg:w-[35px] lg:h-[35px]"
            />
            <div className="w-[20px] h-[20px] bg-green-800 relative right-2 top-1 rounded-[3px] flex items-center justify-center">
              {cartLength}
            </div>
          </div>
        </Link>
      </div>

      {/* Настройки и меню */}
      <div className="flex gap-5" id="menu-buttons-container">
        <Link
          id="search-button"
          className="w-[50px] lg:w-[100px] h-[40px] text-xs lg:text-base text-white bg-[#3a503f] rounded-[10px] flex items-center justify-center gap-1 lg:gap-2 hover:shadow-[0_0_10px_4px_#6c807b,0_0_20px_10px_#637a73] transition"
          href={userRole === 'banned' ? '#' : '/search'}   onClick={(e) => { if (userRole === 'banned') {e.preventDefault() ; toast.error('Вы забанены и не можете пользоваться этим разделом')}}}
        >
          <Image
            src="/search.png"
            alt="Search Icon"
            width={20}
            height={20}
            className="w-[20px] h-[20px]"
          />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger id="settings-trigger">
            <Image
              src="/settings.png"
              alt="Settings"
              width={50}
              height={50}
              className="w-[40px] h-[35px] md:w-[50px] md:h-[45px] lg:w-[70px] lg:h-[60px]"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent id="settings-content" className="flex gap-3">
            <button
              onClick={openDeliveryModal}
              className="w-[80px] lg:w-[100px] h-[40px] text-xs lg:text-base text-white bg-[#3a503f] rounded-[10px] flex items-center justify-center gap-1 lg:gap-2 hover:shadow-[0_0_10px_4px_#6c807b,0_0_20px_10px_#637a73] transition"
            >
              О Доставке
            </button>
         <button
          onClick={openAboutModal}
          className="w-[80px] lg:w-[100px] h-[40px] text-xs lg:text-base text-white bg-[#3a503f] rounded-[10px] flex items-center justify-center gap-1 lg:gap-2 hover:shadow-[0_0_10px_4px_#6c807b,0_0_20px_10px_#637a73] transition"
        >
          О нас
        </button>
            <button
          onClick={openContactsModal}
          className="w-[80px] lg:w-[100px] h-[40px] text-xs lg:text-base text-white bg-[#3a503f] rounded-[10px] flex items-center justify-center gap-1 lg:gap-2 hover:shadow-[0_0_10px_4px_#6c807b,0_0_20px_10px_#637a73] transition"
        >
          Контакты
        </button>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger id="menu-trigger">
            <Image
              src="/menu.png"
              alt="Menu"
              width={50}
              height={50}
              className="w-[40px] h-[35px] md:w-[50px] md:h-[45px] lg:w-[70px] lg:h-[60px]"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            id="menu-content"
            className="bg-white w-[90px] flex flex-col gap-5 items-center justify-center p-4 rounded-md"
          >
            <Link  className="text-green-850 block mb-2" href={userRole === 'banned' ? '#' : '/order'}   onClick={(e) => { if (userRole === 'banned') {e.preventDefault() ; toast.error('Вы забанены и не можете пользоваться этим разделом')}}}>
              <Image src="/time.png" alt="Time Icon" width={30} height={30} />
              Time
            </Link>

            <Link href={href} className="text-green-850 block mb-2"   >
              <Image             src={userImage} alt="User Icon" width={30} height={30} />
              User
            </Link>

            <Link  className="text-green-850 block" href={userRole === 'banned' ? '#' : '/cart'}   onClick={(e) => { if (userRole === 'banned') {e.preventDefault() ; toast.error('Вы забанены и не можете пользоваться этим разделом')}}}>
              <Image src="/shopping.png" alt="Cart Icon" width={30} height={30} />
              Cart
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
