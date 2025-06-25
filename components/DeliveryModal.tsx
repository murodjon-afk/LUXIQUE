"use client";
import { useModal } from "./ModalProvider"; // или "./ModalContext"
import React, { useState, useEffect } from "react";
import Image from "next/image";

const regions = [
  "Ташкент", "Самарканд", "Бухара", "Хорезм", "Фергана", "Наманган",
  "Андижан", "Кашкадарья", "Сурхандарья", "Навои", "Джизак", "Сырдарья",
  "Ташкентская область",
];

const DeliveryModal = () => {
  const { deliveryOpen, closeDeliveryModal } = useModal(); // исправили!
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  useEffect(() => {
    if (deliveryOpen) {
      const savedRegion = localStorage.getItem("selectedRegion");
      if (savedRegion) {
        setSelectedRegion(savedRegion);
      }
    }
  }, [deliveryOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedRegion(value);
    localStorage.setItem("selectedRegion", value);
  };

  if (!deliveryOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-500" onClick={closeDeliveryModal}>
      <div className="bg-white rounded-lg p-6 w-[400px] relative shadow-lg" id="dilivery-mod">
        <button onClick={closeDeliveryModal} className="absolute top-2 right-2 text-black text-2xl font-bold hover:text-red-600 cursor-pointer transition">
          &times;
        </button>
        <div className="mb-4 flex justify-center" id="dil-img-cont">
          <Image src="/car.png" alt="Доставка" width={96} height={96} style={{ objectFit: 'contain' }} />
        </div>
        <h2 className="text-xl font-semibold mb-3 text-center">
          Безопасная доставка по всему Узбекистану
        </h2>
        <p className="mb-6 text-center text-gray-700">
          Мы гарантируем сохранность и своевременную доставку ваших заказов в любую область.
        </p>
        <p className="mb-6 text-center text-gray-700">Выберите область доставки:</p>
        <select value={selectedRegion} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded">
          <option value="" disabled>-- Выберите область --</option>
          {regions.map(region => <option key={region} value={region}>{region}</option>)}
        </select>
        <button onClick={closeDeliveryModal} className="mt-6 bg-green-700 text-white px-4 py-2 rounded w-full hover:bg-green-800 transition">
          Выбрать
        </button>
      </div>
    </div>
  );
};

export default DeliveryModal;
