"use client";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export type Order = {
  id: string;
  status: string;
  buyerId: number;
  sellerId: number;
  productIds: number[];
};

interface User {
  id: number;
  name?: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  total: number;
}

interface ExtendedOrder extends Order {
  buyer?: User;
  seller?: User;
  products?: Product[];
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ExtendedOrder | null>(null);
  const [newStatus, setNewStatus] = useState("started");

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("/api/orders");
      const data: ExtendedOrder[] = await res.json();
      setOrders(data);
    };

    fetchOrders();
  }, []);

  const deleteOrder = async (id: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Ошибка при удалении");

      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (err) {
      console.error("Ошибка при удалении заказа:", err);
      alert("Не удалось удалить заказ");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const value = `${order.id} ${order.status} ${order.buyer?.name ?? ""}`.toLowerCase();
    return value.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-[95%] mx-auto mt-6 h-[90%] overflow-auto rounded-lg shadow bg-white p-4">
      <input
        type="text"
        placeholder="Поиск по ID, статусу или покупателю..."
        className="mb-4 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="flex" id="ad-ord-tabel">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead className="bg-green-100 text-green-900 text-left text-sm">
            <tr className="h-[45px]">
              <th className="px-4 py-2">Покупатель</th>
              <th className="px-4 py-2">Продавец</th>
              <th className="px-4 py-2">Статус</th>
              <th className="px-4 py-2">Продуктов</th>
              <th className="px-4 py-2">Действие</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700 backdrop-blur-sm bg-white/60">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50 h-[60px]">
                  <td className="px-4 py-2">{order.buyer?.name || "—"}</td>
                  <td className="px-4 py-2">{order.seller?.name || "—"}</td>
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-4 py-2">{order.products?.length || 0}</td>
                  <td className="px-4 py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="cursor-pointer">Edit</DropdownMenuTrigger>
                      <DropdownMenuContent className="flex flex-col gap-2 px-2 py-2">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition cursor-pointer"
                          onClick={() => {
                            setSelectedOrder(order);
                            setNewStatus(order.status);
                            setIsEditOpen(true);
                          }}
                        >
                          Изменить
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition cursor-pointer"
                          onClick={() => deleteOrder(order.id)}
                        >
                          Отменить заказ
                        </button>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-400">
                  Нет заказов
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6" id="ad-ord-block">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="border rounded-lg shadow-sm p-4 bg-white flex flex-col justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Заказ</p>
                <p className="text-xs text-gray-600 mt-1">
                  👤 Покупатель: {order.buyer?.name || "—"}
                </p>
                <p className="text-xs text-gray-600">🏪 Продавец: {order.seller?.name || "—"}</p>
                <p className="text-xs text-gray-600">📦 Продуктов: {order.products?.length || 0}</p>
                <p className="text-xs font-medium mt-1 text-green-600">Статус: {order.status}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  className="flex-1 bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition"
                  onClick={() => {
                    setSelectedOrder(order);
                    setNewStatus(order.status);
                    setIsEditOpen(true);
                  }}
                >
                  Изменить
                </button>
                <button
                  className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition"
                  onClick={() => deleteOrder(order.id)}
                >
                  Отменить заказ
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400">Нет заказов</p>
        )}
      </div>

      {isEditOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg space-y-4">
            <h2 className="text-lg font-semibold">Редактировать статус заказа</h2>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Статус заказа:</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border px-3 py-2 rounded-md text-sm"
              >
                <option value="started">В процессе</option>
                <option value="ready">Готов</option>
                <option value="delivered">Доставлен</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                Отмена
              </button>

              <button
                onClick={async () => {
                  try {
                    const res = await fetch("/api/orders", {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        id: selectedOrder.id,
                        status: newStatus,
                      }),
                    });

                    if (!res.ok) throw new Error("Не удалось обновить заказ");

                    setOrders((prev) =>
                      prev.map((order) =>
                        order.id === selectedOrder.id ? { ...order, status: newStatus } : order
                      )
                    );

                    setIsEditOpen(false);
                    setSelectedOrder(null);
                    toast.success("Статус обновлён");
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
  );
}
