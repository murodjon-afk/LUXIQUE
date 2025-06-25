"use client";
import { useModal } from "./ModalProvider";
import React from "react";
import Image from "next/image";
const AboutModal = () => {
  const { aboutOpen, closeAboutModal } = useModal();

  if (!aboutOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-500" onClick={closeAboutModal}>
      <div className="bg-white rounded-lg p-6 w-[400px]  relative shadow-lg" id="about-mod">
        <button onClick={closeAboutModal} className="absolute top-2 right-2 text-black text-2xl font-bold hover:text-red-600 transition">
          &times;
        </button>
             <Image
                  src="/logo.png"
                  alt="Luxique Logo"
                  width={50}
                  height={50}
                  className="w-[40px] h-[35px] md:w-[50px] md:h-[45px] lg:w-[70px] lg:h-[60px] mx-auto"
                />
        <h2 className="text-xl font-semibold mb-3 text-center">О нас</h2>
        <p className="mb-6 text-center text-gray-700">
Luxique – онлайн-магазин одежды, техники и ювелирных украшений для мужчин и женщин. Мы предлагаем только качественные товары от надежных брендов. У нас вы найдете всё для стиля, красоты и удобства. Luxique – качество, проверенное временем.

        </p>
      </div>
    </div>
  );
};

export default AboutModal;
