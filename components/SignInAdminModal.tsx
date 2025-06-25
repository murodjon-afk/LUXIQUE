'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useModal } from './ModalProvider'

export default function SignInAdminModal() {
  const router = useRouter()
  const { adminOpen, closeAdminModal } = useModal()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/users?email=${email}`)
      const data = await res.json()

      if (!res.ok || !data.user) {
        setError('Пользователь не найден')
        return
      }
       console.log('RAW DATA:', data)

      const user = data.user
      console.log(user.password);
      
      if (user.password !== password) {
        setError('Неверный пароль')
        return
      }

if (user.role !== 'admin' && user.role !== 'director') {
        setError('Вы не администратор')
        return
      }

      closeAdminModal()
      router.push(`/admin/${user.id}/${encodeURIComponent(user.email)}/${user.role}`)
    } catch (err) {
      console.error(err)
      setError('Произошла ошибка при входе')
    }
  }

  const isValid = email.trim() !== '' && password.trim() !== ''

  if (!adminOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50"           
>
      <div className="w-[400px] h-[600px] bg-white rounded-[25px] px-5 py-5 flex flex-col justify-between shadow-lg relative">
        <button
          onClick={closeAdminModal}
          className="absolute top-3 right-4 text-gray-500 text-xl hover:text-black"
        >
          ×
        </button>
        <div>
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <Image src="/logo.png" alt="Luxique Logo" width={40} height={40} className="w-[60px] h-[50px]" />
            <p className="text-lg md:text-2xl lg:text-[30px] text-yellow-700">Luxique</p>
          </Link>
          <h1 className="text-[30px] text-start text-[#243344] font-[500] mt-5">Вход для администратора</h1>
          <h1 className="text-[18px] text-start text-gray-600 font-[500] pb-5">Введите email и пароль</h1>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
          />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`text-[#243344] font-[600] text-[20px] px-4 py-2 w-[100%] rounded-lg h-[50px] border border-black mt-4 ${
              !isValid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:text-white transition'
            }`}
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  )
}
