'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

type Product = {
  id: number
  title: string
  price: number
  category: string
}

type CategoryStats = {
  category: string
  count: number
  averagePrice: number
}

const CategoryChart = () => {
  const [data, setData] = useState<CategoryStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/products')
        if (!res.ok) throw new Error('Ошибка загрузки продуктов')
        const products: Product[] = await res.json()

        const categoryMap = new Map<string, { totalPrice: number; count: number }>()

        for (const product of products) {
          const { category, price } = product
          if (!categoryMap.has(category)) {
            categoryMap.set(category, { totalPrice: price, count: 1 })
          } else {
            const current = categoryMap.get(category)!
            categoryMap.set(category, {
              totalPrice: current.totalPrice + price,
              count: current.count + 1
            })
          }
        }

        const chartData: CategoryStats[] = Array.from(categoryMap.entries()).map(([category, stats]) => ({
          category,
          count: stats.count,
          averagePrice: parseFloat((stats.totalPrice / stats.count).toFixed(2))
        }))

        setData(chartData)
      } catch  {
 console.log("Ошибка");
 
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-6 text-muted">Загрузка данных...</div>

  return (
    <Card className="w-full max-w-5xl mx-auto p-4">
      <CardHeader>
        <CardTitle>Сравнение категорий товаров</CardTitle>
      </CardHeader>
      <CardContent className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#10b981" name="Кол-во товаров" />
            <Bar dataKey="averagePrice" fill="#3b82f6" name="Средняя цена ($)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default CategoryChart
