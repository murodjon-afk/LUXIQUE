'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import EditProductModal from '@/components/EditProductModal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Product {
  id: string;         // ← строка
  title: string;
  price: number;
  image: string;
  userId: string;
}


export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const openEditModal = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedProduct(product)
    setIsEditOpen(true)
  }

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    }

    fetchProducts()
  }, [])

  const deleteProduct = async (id: number) => {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      throw new Error('Ошибка при удалении')
    }

    // Здесь Number(id) не нужен, потому что id уже number
setProducts(prev => prev.filter(p => Number(p.id) !== id))
  } catch (error) {
    console.error('Ошибка:', error)
    alert('Не удалось удалить продукт')
  }
}


  const filteredProducts = products.filter(product => {
    const value = `${product.title} ${product.price}`.toLowerCase()
    return value.includes(searchTerm.toLowerCase())
  })

  return (
    <div className="w-[95%] mx-auto mt-6 h-[90%] overflow-auto rounded-lg shadow bg-white p-4">
      <input
        type="text"
        placeholder="Поиск по названию или цене..."
        className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Таблица продуктов */}
      <div id='ad-prod-table'>
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead className="bg-green-100 text-green-900 text-left text-sm">
            <tr className="h-[45px]">
              <th className="px-4 py-2">Изображение</th>
              <th className="px-4 py-2">Название</th>
              <th className="px-4 py-2">Цена</th>
              <th className="px-4 py-2">Действие</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700 backdrop-blur-sm bg-white/60">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <tr
                  key={`table-${product.id}`}
                  className="border-b hover:bg-gray-50 h-[80px] cursor-pointer"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  <td className="px-4 py-2">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={60}
                      height={60}
                      className="object-contain rounded"
                    />
                  </td>
                  <td className="px-4 py-2 font-medium">{product.title}</td>
                  <td className="px-4 py-2">{product.price} $</td>
                  <td className="px-4 py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="cursor-pointer text-sm text-green-700">Edit</DropdownMenuTrigger>
                      <DropdownMenuContent className="flex flex-col gap-2 px-2 py-2">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition cursor-pointer"
                          onClick={(e) => openEditModal(product, e)}
                        >
                          Изменить
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
deleteProduct(Number(product.id))
                          }}
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
                <td colSpan={4} className="text-center py-4 text-gray-400">Нет продуктов</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Карточки продуктов */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6" id='ad-prod-block'>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div
              key={`card-${product.id}`}
              className="border rounded-xl shadow-md bg-white p-4 flex flex-col justify-between hover:shadow-lg transition"
            >
              <Image
                src={product.image}
                alt={product.title}
                width={250}
                height={200}
                className="object-contain w-full h-40 mb-2 rounded-md"
              />
              <h3 className="text-sm font-semibold mb-1 text-gray-800 line-clamp-2">{product.title}</h3>
              <p className="text-green-600 text-sm font-bold mb-2">{product.price} $</p>
              <div className="flex justify-between gap-2 mt-auto">
                <button
                  className="flex-1 bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition"
                  onClick={() => openEditModal(product, {} as React.MouseEvent)}
                >
                  Изменить
                </button>
                <button
                  className="flex-1 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition"
                  onClick={() => deleteProduct(Number(product.id))}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400">Нет продуктов</p>
        )}
      </div>

      {/* Модальное окно редактирования */}
      <EditProductModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        product={selectedProduct}
        setProducts={setProducts}
      />
    </div>
  )
}   
