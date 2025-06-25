'use client'

import { useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner'

interface User {
  id: number
  email: string
  name?: string
  role: string
  phone: string
}

export default function UsersTable() {
const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
const [isEditOpen, setIsEditOpen] = useState(false)
const [editRole, setEditRole] = useState('');



const [editUser, setEditUser] = useState<User | null>(null); // выбранный пользователь
const [editName, setEditName] = useState('');
const [editPhone, setEditPhone] = useState('');


  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data.users || [])
    }

    fetchUsers()
  }, [])

const handleBanUser = async (id: number) => {
  const userToBan = users.find(user => user.id === id);

    if (userToBan?.role === 'director') {
    toast.error('Вы не можете забанить Директора');
    return;
  }

  try {
    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        role: 'banned',
      }),
    });

    if (!res.ok) throw new Error('Не удалось забанить пользователя');

    const updatedUser = await res.json();

    setUsers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, role: updatedUser.role } : user
      )
    );

    toast.success('Пользователь забанен');
  } catch (err) {
    console.error(err);
    toast.error('Ошибка при бане пользователя');
  }
};


const handleUnbanUser = async (id: number) => {
  try {
    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        role: 'buyer',
      }),
    })

    if (!res.ok) throw new Error('Не удалось разбанить пользователя')

    const updatedUser = await res.json()

    setUsers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, role: updatedUser.role } : user
      )
    )

    toast.success('Пользователь разбанен')
  } catch (err) {
    console.error(err)
    toast.error('Ошибка при разбане пользователя')
  }
}



const openEditModal = (user: User) => {
  setEditUser(user)
  setEditName(user.name || '')
  setEditPhone(user.phone)
  setIsEditOpen(true)
  setEditRole(user.role); // Добавить эту строку

}


const filteredUsers = users.filter((user: User) => {
  const value = `${user.name} ${user.email} ${user.phone}`.toLowerCase()
  return value.includes(searchTerm.toLowerCase())
})


  return (
    <div className="w-[95%] mx-auto mt-6">

      {/* 🔍 Поиск */}
      <input
        type="text"
        placeholder="Поиск по имени, email или телефону..."
        className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* ✅ Таблица */}
      <div className="max-h-[400px] overflow-auto rounded-lg shadow bg-white p-4 flex w-full">
        <div className="w-full flex" id='ad-us-table'>
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead className="bg-green-100 text-green-900 text-left text-sm">
              <tr className="h-[45px]">
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Имя</th>
                <th className="px-4 py-2">Роль</th>
                <th className="px-4 py-2">Телефон</th>
                <th className="px-4 py-2">Изменить</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 backdrop-blur-sm bg-white/60">
              {filteredUsers.length > 0 ? (
filteredUsers.map((user: User, index: number) => (
                  <tr key={index} className="border-b h-[50px] hover:bg-gray-50">
                    <td className="px-4">{user.email}</td>
                    <td className="px-4">{user.name}</td>
                    <td className="px-4">{user.role}</td>
                    <td className="px-4 text-gray-500 text-xs">{user.phone}</td>
                    <td>
                      <DropdownMenu>
                        <DropdownMenuTrigger className='cursor-pointer px-5 text-center py-2 text-gray-500 text-xs'>Edit</DropdownMenuTrigger>
                        <DropdownMenuContent className='flex flex-col gap-2 px-2 py-2'>
                          <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition cursor-pointer"   onClick={() => openEditModal(user)}>
                            Изменить
                          </button>
                         



{user.role === 'banned' ? (
 <button className="bg-green-900 text-white px-3 py-1 rounded hover:bg-green-600 transition cursor-pointer"    onClick={() => handleUnbanUser(user.id)}>
Разбанить </button>

    
) : (
 <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition cursor-pointer"  onClick={() => handleBanUser(user.id)}>
Забанить </button>
)}

                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-400">Нет пользователей</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ❌ Альтернативный вид (пока скрыт) */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" id='ad-us-bloack'>
          {filteredUsers.length > 0 ? (
filteredUsers.map((user: User, index: number) => (
              <div key={index} className="bg-white border rounded-lg p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">👤 {user.name || 'Нет имени'}</p>
                  <p className="text-xs text-gray-500">📧 {user.email}</p>
                  <p className="text-xs text-gray-500">📞 {user.phone}</p>
                  <p className="text-xs text-green-600 font-medium mt-1">Роль: {user.role}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition"   onClick={() => openEditModal(user)}>
                    Изменить
                  </button>
                {user.role === 'banned' ? (
 <button className="flex-1 bg-green-900 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition"    onClick={() => handleUnbanUser(user.id)}>
Разбанить </button>

    
) : (
 <button className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition"  onClick={() => handleBanUser(user.id)}>
Забанить </button>
)}

                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-400">Нет пользователей</p>
          )}
        </div>
      </div>
{isEditOpen && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg space-y-4">
      <h2 className="text-lg font-semibold">Редактировать пользователя</h2>

      {/* Имя */}
      <div>
        <label className="block text-sm text-gray-600">Имя:</label>
        <input
          type="text"
          value={editName}
          onChange={(e) => {
            const value = e.target.value;
            const regex = /^[a-zA-Zа-яА-ЯёЁ\s]*$/;
            if (regex.test(value) && value.length <= 20) {
              setEditName(value);
            }
          }}
          pattern="[A-Za-zА-Яа-яЁё\s]{1,20}"
          maxLength={20}
          className="w-full border px-3 py-2 rounded-md text-sm mt-1"
          placeholder="Введите имя"
        />
      </div>

      {/* Телефон */}
      <div>
        <label className="block text-sm text-gray-600">Телефон:</label>
        <input
          type="text"
          value={editPhone}
          onChange={(e) => {
            const raw = e.target.value;
            const digits = raw.replace(/\D/g, "");
            if (digits.length < editPhone.replace(/\D/g, "").length) {
              setEditPhone(raw);
              return;
            }

            const formatPhoneNumber = (value: string): string => {
              const cleaned = value.replace(/\D/g, "").substring(0, 9);
              const parts = [];
              if (cleaned.length > 0) parts.push(cleaned.substring(0, 2));
              if (cleaned.length > 2) parts.push(cleaned.substring(2, 5));
              if (cleaned.length > 5) parts.push(cleaned.substring(5, 7));
              if (cleaned.length > 7) parts.push(cleaned.substring(7, 9));
              return parts.join("-");
            };

            const formatted = formatPhoneNumber(digits);
            setEditPhone(formatted);
          }}
          className="w-full border px-3 py-2 rounded-md text-sm mt-1"
          placeholder="88-460-65-75"
        />
      </div>

      {/* Роль */}
      <div>
        <label className="block text-sm text-gray-600">Роль:</label>
        <select
          value={editRole}
          onChange={(e) => setEditRole(e.target.value)}
          className="w-full border px-3 py-2 rounded-md text-sm mt-1"
        >
          <option value="buyer">Покупатель</option>
          <option value="seller">Продавец</option>
          <option value="admin">Администратор</option>
        </select>
      </div>

      {/* Кнопки */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={() => setIsEditOpen(false)}
          className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Отмена
        </button>

        <button
          onClick={async () => {
            if (!editUser) return;

            const changes: { name?: string; phone?: string; role?: string } = {};
            if (editName !== editUser.name) {
              changes.name = editName;
            }
            if (editPhone !== editUser.phone) {
              changes.phone = editPhone;
            }
            if (editRole !== editUser.role) {
              changes.role = editRole;
            }

            if (Object.keys(changes).length === 0) {
              toast.info("Нет изменений");
              return;
            }

            try {
              const res = await fetch("/api/users", {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: editUser.id,
                  ...changes,
                }),
              });

              if (!res.ok) throw new Error("Не удалось обновить пользователя");


              setUsers((prev) =>
                prev.map((user) =>
                  user.id === editUser.id ? { ...user, ...changes } : user
                )
              );

              toast.success("Пользователь обновлён");
              setIsEditOpen(false);
              setEditUser(null);
            } catch (error) {
              console.error(error);
              toast.error("Ошибка при обновлении");
            }
          }}
          className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Сохранить
        </button>
      </div>
    </div>
  </div>
)}



    </div>
  )
}



