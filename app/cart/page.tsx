'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { useModal } from "../../components/ModalProvider";
import PaymentModal from "../../components/CartModalSummary"

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
    quantity: number;
  sellerId: number; // ✅ добавляем сюда

}



interface CartItem {
  id: number;
  quantity: number;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
    const { openPaymentModal } = useModal();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)


  useEffect(() => {
    const storedCart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(storedCart);

    const ids = storedCart.map(item => item.id);
    if (ids.length > 0) {
      fetch(`/api/products`)
        .then(res => res.json())
        .then((allProducts: Product[]) => {
          const filtered = allProducts.filter(product => ids.includes(product.id));
          setProducts(filtered);
        })
        .catch(err => console.error('Ошибка загрузки товаров:', err));
    }
  }, []);
// удалаем прогдукт Handleremove
const handleRemove = (id: number) => {
  setLoading(true);

  setTimeout(() => {
    const cartCopy = [...cartItems];
    const indexToRemove = cartCopy.findIndex(item => item.id === id);

    if (indexToRemove !== -1) {
      cartCopy.splice(indexToRemove, 1); 

      setCartItems(cartCopy);
      localStorage.setItem('cart', JSON.stringify(cartCopy));

      const updatedIds = cartCopy.map(item => item.id);
      const updatedProducts = products.filter(product => updatedIds.includes(product.id));
      setProducts(updatedProducts);

      const removedProduct = products.find(p => p.id === id);
      toast.error(`Удалён из корзины: ${removedProduct?.title || 'Продукт'}`);
    }

    setLoading(false);
  }, 800);
};


//Общая цена тут 
const getTotalPrice = () => {
  return cartItems.reduce((total, cartItem) => {
    const product = products.find(p => p.id === cartItem.id);
    if (!product) return total;

    const quantity = Number(cartItem.quantity) || 1;

    const price = Number(product.price);
    if (isNaN(price)) return total;

    return total + price * quantity;
  }, 0);
};

//Этот код превращает корзину cartItems, где у каждого товара есть quantity, в массив реальных
const expandedProducts = cartItems.flatMap(item => {
  const product = products.find(p => p.id === item.id);
  if (!product) return [];
  return Array(item.quantity).fill(product);
});



//Общое количесвто товаров корзине
const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className='w-[100%] h-[100vh] flex flex-col items-center justify-end'>
      <div className='w-[100%] h-[95%]'>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-6 h-[65%]">
            <Image
              src="/shopocat 1.png"
              alt="Luxique Logo"
              width={134}
              height={134}
              className="w-[134px] h-[134px] mb-4"
            />
            <h1 className="text-2xl font-semibold mb-2 text-gray-800">
              В корзине пока нет товаров
            </h1>
            <Link href={"/"}>
              <button
                className="bg-[#335246] text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-opacity-90 transition cursor-pointer"
              >
                На главную
              </button>
            </Link>
          </div>
        ) : (
   <div id="cart-container" className="w-[90%] h-[90%] bg-[#f4f5f5] mx-auto rounded-lg shadow-[0_5px_12px_rgba(0,0,0,0.2)]">
  <h1 id="cart-title" className="text-4xl font-extrabold text-start text-green-950 tracking-wide my-4 pl-10 pt-5">
    Корзина товаров
  </h1>

  {loading ? (
    <div id="loading-spinner" className="flex justify-center items-center h-[80%]">
      <div className="w-12 h-12 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
    </div>
  ) : (
    <>
      <div id="cart-content" className="w-[100%] h-[100%] flex">
        <div id="product-list" className="w-[65%] h-[90%] pt-3 px-5 overflow-y-auto">
         {expandedProducts.map((product, index) => (
  <div
    key={index}
    className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-4 mb-4"
    id="product"
  >
    <Image
      src={product.image}
      alt={product.title}
      width={96}
      height={96}
      style={{ objectFit: 'contain' }}
      id={`product-img`}
    />
    <div className="flex-1">
      <div className="font-bold text-lg">{product.title}</div>
      <div className="text-gray-600">{product.price} $</div>
    </div>
    <button
      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
      onClick={() => handleRemove(product.id)} 
    >
      Удалить
    </button>
  </div>
))}


             <div id="summary-box" className="w-[25%] h-[250px] bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.1)] flex flex-col justify-around">
<h2
  className="text-green-950 mt-4 px-6"
  style={{
    fontFamily: 'Gilroy',
    fontWeight: 600,
    fontSize: '32px',
    lineHeight: '100%',
    letterSpacing: '0%',
  }}
  id='total'
>
  Общая сумма: {getTotalPrice().toFixed(2)} $
</h2>


  <div className="flex flex-col gap-1">
    <h2 id="cart-count" className="text-xl font-semibold text-green-900 mt-2 px-6">
В корзине: {totalQuantity} {totalQuantity === 1 ? 'товар' : 'товаров'}
    </h2>
    <h2 className="text-xl font-semibold text-green-900 px-6">Вид оплаты: наличными</h2>
  </div>

  <button
    id="checkout-button"
    className="w-[80%] h-[40px] bg-green-900 text-white rounded-lg mx-auto cursor-pointer text-sm" // Уменьшенная кнопка и шрифт
onClick={() => setIsPaymentOpen(true)}
  >
    Перейти к оплате
  </button>
</div>

        </div>

        
             <div id="summary-box2" className="w-[25%] h-[250px] bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.1)] flex flex-col justify-around">
<h2
  className="text-green-950 mt-4 px-6"
  style={{
    fontFamily: 'Gilroy',
    fontWeight: 600,
    fontSize: '32px',
    lineHeight: '100%',
    letterSpacing: '0%',
  }}
  id='total'
>
  Общая сумма: {getTotalPrice().toFixed(2)} $
</h2>


  <div className="flex flex-col gap-1">
    <h2 id="cart-count" className="text-xl font-semibold text-green-900 mt-2 px-6">
      В корзине: {cartItems.length} {cartItems.length === 1 ? 'товар' : 'товаров'}
    </h2>
    <h2 className="text-xl font-semibold text-green-900 px-6">Вид оплаты: наличными</h2>
  </div>

  <button
    id="checkout-button"
    className="w-[90%] h-[40px] bg-green-900 text-white rounded-lg mx-auto cursor-pointer text-sm" // Уменьшенная кнопка и шрифт
onClick={() => setIsPaymentOpen(true)}
  >
    Перейти к оплате
  </button>
</div>


      </div>
    </>
  )}
</div>

        )}

      </div>

       {/* модальный блок для оплаты и заказов  */}
      <PaymentModal
  open={isPaymentOpen}
  onClose={() => setIsPaymentOpen(false)}
  products={products}
  cartItems={cartItems}
/>

    </div>
  );
};

export default CartPage;
