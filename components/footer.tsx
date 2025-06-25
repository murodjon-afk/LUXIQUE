"use client";

import React from "react";
import Image from "next/image";
import Link from 'next/link';
import SellerModal from "./SellerModal"; 
import { useEffect ,useState } from "react";
import { useSession } from "next-auth/react"
import { toast } from "sonner";
export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: session } = useSession()
    const [userRole, setUserRole] = useState('')

 useEffect(() => {
      const fetchUserRole = async () => {
        try {
          if (session?.user?.email) {
            const res = await fetch(`/api/users?email=${session.user.email}`)
            if (!res.ok) throw new Error('Ошибка получения роли пользователя')
            const data = await res.json()
            setUserRole(data.user?.role || 'Неизвестно')
          }
        } catch (err) {
          console.error('Ошибка при получении роли:', err)
          setUserRole('Ошибка')
        }
      }
  
      fetchUserRole()
    }, [session])

  return (
    <>
      <footer className="bg-gradient-to-r from-[#a4835b] to-[#003c38] text-white px-8 py-12 text-sm">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Логотип */}
          <div className="space-y-2">
            <Image src="/logo.png" alt="Luxique logo" width={40} height={40} />
<p className="text-xs text-gray-300">
  © 2025 &quot;Luxique&quot;<br />Все права защищены
</p>
            <a href="#" className="text-gray-400 hover:text-white underline">
              Политика конфиденциальности
            </a>
          </div>

          {/* Навигация */}
          <div>
            <h4 className="font-bold mb-2">Навигация</h4>
            <ul className="space-y-1 text-gray-300">
              <li><a href="https://docs.google.com/forms/d/1gYAxrRDn0XfgjP-cJywT01mo2xXezHIc7K3IyRfft2w/preview" className="hover:text-white">Как стать админом</a></li>
              <li><a href="#" className="hover:text-white">Новости</a></li>
              <li><a href="#" className="hover:text-white">Доставка</a></li>
              <li><a href="#" className="hover:text-white">О нас</a></li>
              <li><a href="#" className="hover:text-white">Контакты</a></li>
            </ul>
          </div>

          {/* Продавцам */}
          <div>
            <h4 className="font-bold mb-2">Для продавцов</h4>
            <ul className="space-y-1 text-gray-300">
              <li>
              <button
  onClick={() => { if (userRole === 'banned') { toast.error('Вы забанены и не можете стать продавцом') 
   return 
    } setIsModalOpen(true)}}> как стать продавцом</button>

              </li>
              <li>
                <Link href="/for-sellers/pricing-monitoring" className="hover:text-white">
                  как следить за ценами
                </Link>
              </li>
              <li>
                <Link href="/for-sellers/what-to-sell" className="hover:text-white">
                  Что продавать ?
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="font-bold mb-2">Контакты</h4>
            <address className="not-italic text-gray-300 space-y-1">
              <p>город Самарканд</p>
              <p>+998 ** *** ** **</p>
              <p>
                <a href="mailto:o.alambik@gmail.com" className="hover:text-white">
                  Luxique.instagramm.com
                </a>
              </p>
            </address>
            <div className="flex space-x-3 mt-2">
              <a href="#" className="hover:text-white"><i className="fab fa-twitter"></i></a>
              <a href="#" className="hover:text-white"><i className="fab fa-facebook"></i></a>
              <a href="#" className="hover:text-white"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </footer>

      <SellerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
