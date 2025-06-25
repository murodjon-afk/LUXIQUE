'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  LineChart,
  Line,
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
  rating: number
}

type CategoryRating = {
  category: string
  averageRating: number
}

const RatingChart = () => {
  const [data, setData] = useState<CategoryRating[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/products')
        if (!res.ok) throw new Error('Ошибка загрузки продуктов')
        const products: Product[] = await res.json()

        const categoryMap = new Map<string, { totalRating: number; count: number }>()

        for (const product of products) {
          const { category, rating } = product
          if (!categoryMap.has(category)) {
            categoryMap.set(category, { totalRating: rating, count: 1 })
          } else {
            const current = categoryMap.get(category)!
            categoryMap.set(category, {
              totalRating: current.totalRating + rating,
              count: current.count + 1
            })
          }
        }

        const chartData: CategoryRating[] = Array.from(categoryMap.entries()).map(([category, stats]) => ({
          category,
averageRating:
  stats.count > 0 && !isNaN(stats.totalRating)
    ? parseFloat((stats.totalRating / stats.count).toFixed(2))
    : 0
        }))

        setData(chartData)
      } catch  {
console.log("ОШибка");

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
        <CardTitle>Сравнение рейтинга по категориям</CardTitle>
      </CardHeader>
      <CardContent className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="averageRating"
              stroke="#f59e0b"
              name="Средний рейтинг"
              dot={{ r: 6, stroke: '#b45309', strokeWidth: 2, fill: '#facc15' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default RatingChart
