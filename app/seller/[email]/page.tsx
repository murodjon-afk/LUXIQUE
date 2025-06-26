'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import EditProductModal from '../../../components/EditProductModal' 
import AddProductModal from '@/components/AddProductModal'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { toast } from 'sonner';
interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  userId: string;
}

export default function SellerDashboard() {
    const [isOpen, setIsOpen] = useState(false)
const [isEditOpen, setIsEditOpen] = useState(false)
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
const openEditModal = (product: Product) => {
  setSelectedProduct(product)
  setIsEditOpen(true)
}

  const { data: session, status } = useSession();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      if (status === 'loading') return;
      if (!session?.user?.email) return router.push('/');

      try {
        const userRes = await fetch('/api/users');
        const userData = await userRes.json();
        const users: User[] = Array.isArray(userData) ? userData : userData.users;

        const foundUser = users.find((u) => u.email === session.user?.email);
        if (!foundUser || foundUser.role !== 'seller' &&  foundUser.role !== 'director'  ) return router.push('/');

        setUser(foundUser);

        const prodRes = await fetch('/api/products');
        const prodData = await prodRes.json();
        const allProducts: Product[] = Array.isArray(prodData) ? prodData : prodData.products;

        const myProducts = allProducts.filter((p) => p.userId === foundUser.id);
        setProducts(myProducts);
      } catch (err) {
        console.error('Ошибка:', err);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status, router]);

const handleRemove = async (id: string) => {
  try {
    const res = await fetch('/api/products', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Ошибка от сервера:', text);
      toast.error(`Не удалось удалить продукт с ID: ${id}`);
      return;
    }

    const removedProduct = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success(`Удалён продукт: ${removedProduct?.title || id}`);
  } catch (error) {
    console.error('Ошибка при fetch:', error);
    toast.error('Произошла ошибка при удалении');
  }
};


  const filtered = products.filter((p) =>
    `${p.title} ${p.price}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-6 bg-gray-50 h-[100vh] w-[100%]">
      <div className="h-full w-[90%] mx-auto bg-white p-6 rounded-xl shadow-md overflow-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
         <div className="">
  <h1 className="text-xl max-[430px]:text-[15px] sm:text-2xl md:text-3xl font-bold text-gray-800">
    Продавец: {user.name || user.email}
  </h1>
  <p className="text-xs max-[430px]:text-[15px] sm:text-sm md:text-base text-gray-500">
    Роль: {user.role}
  </p>
</div>

          <div className="flex items-center gap-2  max-[430px]:flex-col    max-[430px]:items-start ">
            <input
              type="text"
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
            />
      
            <button
              className="bg-green-900 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm"
                      onClick={() => setIsOpen(true)}

            >
               Добавить
            </button>
          </div>
        </div>

        <div
          id="table-view"
          className={`overflow-auto rounded-lg `}
        >
          <table className="w-full text-left border-collapse bg-white">
            <thead className="bg-blue-100 text-blue-800 text-sm">
              <tr>
                <th className="p-3">Изображение</th>
                <th className="p-3">Название</th>
                <th className="p-3">Цена</th>
                <th className="p-3">Действие</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="p-3">
                      <Image
                        src={p.image}
                        alt={p.title}
                        width={60}
                        height={60}
                        className="rounded object-contain"
                      />
                    </td>
                    <td className="p-3 font-medium">{p.title}</td>
                    <td className="p-3">{p.price} $</td>
                    <td className="p-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger className='cursor-pointer px-5 text-center py-2 text-gray-500 text-xs'>Edit</DropdownMenuTrigger>
                        <DropdownMenuContent className='flex flex-col gap-2 px-1  '>
                          <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition cursor-pointer" onClick={() => openEditModal(p)} >
                            Изменить
                          </button>


                          <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-green-600 transition cursor-pointer"                    onClick={() => handleRemove(p.id)}
 >
                          Удалить
                          </button>
                         
                         

                   


                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400">
                    Нет продуктов
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Карточки */}
        <div
          id="card-view"
          className={`grid grid-cols-2 max-[520px]:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4`}
        >
          {filtered.length > 0 ? (
            filtered.map((p) => (
              <div
                key={p.id}
                className="rounded-xl shadow-sm bg-white p-3 flex flex-col border hover:shadow-md transition"
              >
                <div className="w-full h-36 mb-2 relative">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-contain rounded-md"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">{p.title}</h3>
                <p className="text-green-600 font-bold text-sm">{p.price} $</p>
               <div className="w-[100%] flex gap-1 ">
                  <button
                  className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-xs w-[50%]"
                  onClick={() => handleRemove(p.id)}
                >
                  Удалить
                </button>

                <button
                  className="mt-3 bg-green-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-xs w-[50%] "
onClick={() => openEditModal(p)}
                >
                  Изменить
                </button>
               </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-full">Нет продуктов</p>
          )}
        </div>
      </div>
 <AddProductModal
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
            />

      <EditProductModal
  isOpen={isEditOpen}
  onClose={() => setIsEditOpen(false)}
  product={selectedProduct}
  setProducts={setProducts}
/>

    </div>
  );
}
