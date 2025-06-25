'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  userId: string;
}
interface User {
  id: number
  email: string
  name?: string
  role: string
  phone: string
}
interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const categories = ['electronics', "women's clothing", 'jewelery', "men's clothing"];

export default function EditProductModal({ isOpen, onClose, product, setProducts }: Props) {
  const { data: session } = useSession();

  const [count, setCount] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setPrice(String(product.price));
      setDescription('');
      setCategory('');
      setCount('');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = async () => {
    if (!title || !price || !category) return toast.error('⚠️ Заполните обязательные поля');

    try {
      const res = await fetch('/api/users');
      const { users } = await res.json();
      const currentUser = users.find((u: User) => u.email?.toLowerCase() === session?.user?.email?.toLowerCase());

      if (!currentUser) {
        toast.error('❌ Пользователь не найден');
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('userId', String(currentUser.id));

      const parsedCount = parseInt(count);
      const ratingWrapper = {
        rating: {
          rating: 0,
          count: isNaN(parsedCount) ? 0 : parsedCount,
        },
      };
      formData.append('rating', JSON.stringify(ratingWrapper.rating));

      if (imageFile) formData.append('image', imageFile);

      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        body: formData,
      });

      const responseText = await response.text();
      console.log('Ответ от API:', responseText);

      if (!response.ok) {
        toast.error('❌ Ошибка при обновлении');
        return;
      }

      const updatedProduct = JSON.parse(responseText);
      setProducts(prev => prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));

      toast.success('✅ Продукт успешно обновлён');
      onClose();
    } catch (error) {
      console.error('💥 Ошибка обновления:', error);
      toast.error('Ошибка при обновлении');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[90%] max-w-md rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-xl font-bold text-green-900">Редактировать продукт</h2>

        <div className="flex flex-col gap-1 ">
          <label className="text-sm text-green-900 font-medium">Изображение</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-900" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-green-900 font-medium">Название</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
            placeholder="Введите название"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-green-900 font-medium">Описание</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
            placeholder="Введите описание"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-green-900 font-medium">Цена</label>
          <input
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
            placeholder="Введите цену"
          />
        </div>

        <input
          type="number"
          placeholder="Количество"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm text-green-900 font-medium">Категория</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-900"
          >
            <option value="">Выберите категорию</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-1 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-green-900 border border-green-900 hover:bg-green-50"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-green-900 text-white hover:bg-green-800"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
