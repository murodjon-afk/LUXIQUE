import React from 'react';
import Image from 'next/image';

const WhatToSellPage = () => {
  return (
    <div className="pt-[70px] sm:pt-[80px] md:pt-[100px] pb-[60px] min-h-screen flex flex-col md:flex-row items-center justify-center gap-8 p-4 sm:p-8 md:p-10 bg-[#f9fafb]">
      <div className="w-full max-w-lg">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0B3F37] mb-4">
          Что продавать?
        </h1>
        <ul className="list-disc list-inside text-sm sm:text-base md:text-lg text-[#333] space-y-2">
          <li>Разрешённые категории: техника, одежда, украшения, аксессуары.</li>
          <li>Запрещённые товары: подделки, запрещённые к обороту товары, нелегальная продукция.</li>
          <li>Рекомендуем размещать популярные товары с высоким спросом.</li>
          <li>Составьте актуальное предложение для покупателей (новинки, скидки, уникальные товары).</li>
        </ul>
      </div>
      <div className="flex-shrink-0">
        <Image
          src="/images.png"
          alt="Что продавать"
          width={300}
          height={300}
          className="w-[200px] sm:w-[300px] md:w-[400px] h-auto"
        />
      </div>
    </div>
  );
};

export default WhatToSellPage;
