import React from 'react';
import Image from 'next/image';

const PricingMonitoringPage = () => {
  return (
    <div className="pt-[80px] min-h-screen flex flex-col items-start justify-center px-[5%]">
      <div className="w-full lg:w-[50%] flex flex-col lg:flex-row items-center justify-center gap-8">
        <div className="w-full max-w-[600px]">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B3F37] mb-4">
            Документация - Мониторинг
          </h1>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B3F37] mb-4">
            Как следить за ценами?
          </h1>
          <p className="text-base sm:text-lg text-[#333] mb-4">
            Эффективное ценообразование — ключ к успеху на платформе. Следите за изменением стоимости товаров,
            чтобы оставаться конкурентоспособными и привлекать больше покупателей.
          </p>
          <ul className="list-disc list-inside text-base sm:text-lg text-[#333] space-y-2">
            <li>
              <strong>Используйте инструменты мониторинга:</strong> следите за рыночными ценами и предложениями конкурентов с помощью встроенных аналитических инструментов платформы. Это поможет вам своевременно реагировать на изменения.
            </li>
            <li>
              <strong>Устанавливайте конкурентные цены:</strong> анализируйте средние цены на аналогичные товары, но не снижайте стоимость ниже себестоимости — это может привести к убыткам.
            </li>
            <li>
              <strong>Регулярно обновляйте цены:</strong> проверяйте актуальность своих цен как минимум раз в неделю. Если стоимость закупки товара изменилась или появились новые предложения от конкурентов, корректируйте цены.
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4 flex-shrink-0">
          <Image src="/monitoring.webp" alt="Мониторинг цен" width={250} height={250} className="w-[200px] sm:w-[250px] md:w-[300px]" />
          <Image src="/price.png" alt="Мониторинг цен" width={250} height={250} className="w-[200px] sm:w-[250px] md:w-[300px]" />
        </div>
      </div>
    </div>
  );
};

export default PricingMonitoringPage;
