"use client";

import React, { useState } from "react";
import {toast} from "sonner";

type SellerModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SellerModal({ isOpen, onClose }: SellerModalProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [showCheckBoxes, setShowCheckBoxes] = useState(false);
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);

  if (!isOpen) return null;

  const handleCheckEmail = async () => {
    setEmailError("");
    setUserId(null);
    setShowCheckBoxes(false);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Введите корректный email");
      return;
    }

    try {
      const res = await fetch(`/api/users?email=${email}`);
      const data = await res.json();

      if (!res.ok || !data.user) {
        toast.error("Пользователь не найден");
        return;
      }

      const user = data.user;

      if (user.role !== "buyer") {
        toast.error("Вы уже зарегистрированы как продавец или админ");
        return;
      }

      setUserId(user.id);
      setShowCheckBoxes(true);
      toast.success("Email подтверждён. Подтвердите условия");
    } catch (err) {
      console.error(err);
      toast.error("Ошибка при проверке email");
    }
  };

  const handleBecomeSeller = async () => {
    if (!agree1 || !agree2) {
      toast.error("Вы должны принять все условия");
      return;
    }

    if (!userId) {
      toast.error("ID пользователя не найден");
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          role: "seller",
        }),
      });

      if (res.ok) {
        toast.success("Теперь вы продавец");
        onClose();
        setEmail("");
        setAgree1(false);
        setAgree2(false);
        setUserId(null);
        setShowCheckBoxes(false);
      } else {
        toast.error("Не удалось обновить роль");
      }
    } catch  {
      toast.error("Ошибка при обновлении роли");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"           >
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 text-2xl hover:text-black"
        >
          &times;
        </button>

        <h2 className="text-lg font-semibold mb-4">Заявка на продавца</h2>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Введите email:
        </label>

        <div className="flex gap-2">
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleCheckEmail}
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
          >
            Проверить
          </button>
        </div>
        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}

        {showCheckBoxes && (
          <>
            <div className="mt-4 space-y-2">
              <label className="flex items-start text-sm text-gray-700 gap-2">
                <input
                  type="checkbox"
                  checked={agree1}
                  onChange={(e) => setAgree1(e.target.checked)}
                />
                Я ознакомился с правилами продажи и условиями использования
              </label>

              <label className="flex items-start text-sm text-gray-700 gap-2">
                <input
                  type="checkbox"
                  checked={agree2}
                  onChange={(e) => setAgree2(e.target.checked)}
                />
                Я принимаю ответственность за товары, размещённые от моего имени
              </label>
            </div>

            <button
              onClick={handleBecomeSeller}
              className="mt-4 w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
            >
              Стать продавцом
            </button>
          </>
        )}
      </div>
    </div>
  );
}
