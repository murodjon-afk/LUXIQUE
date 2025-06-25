"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "next-auth/react"
type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
 rating: {
    rate: number;
    count: number;
  };  
  createdAt: string;
  updatedAt: string;
  userId: number | null;
};

export default function Home() {
    const { data: session } = useSession()
    const [userRole, setUserRole] = useState('')
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const cheapProducts = [...products].sort((a, b) => a.price - b.price);
const newProducts = [...products].sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
);
const popularProducts = [...products].sort((a, b) => {
  const ratingA = a.rating?.rate ?? 0;
  const ratingB = b.rating?.rate ?? 0;
  return ratingB - ratingA;
});
    useEffect(() => {
      const fetchUserRole = async () => {
        try {
          if (session?.user?.email) {
            const res = await fetch(`/api/users?email=${session.user.email}`)
            if (!res.ok) throw new Error('Ошибка получения роли пользователя')
            const data = await res.json()
            setUserRole(data.user?.role || 'Неизвестно')
          }
        } catch (err) {
          console.error('Ошибка при получении роли:', err)
          setUserRole('Ошибка')
        }
      }
  
      fetchUserRole()
    }, [session])
  
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      if (!res.ok) {
        console.error('Ошибка загрузки продуктов');
        return;
      }
      const data = await res.json();
      setProducts(data);
      setLoading(false)
    };

    fetchProducts();
  }, []);

  const href = userRole === 'banned' ? "" : "/cart"

const addToCart = (product: Product) => {
  if (userRole === 'banned') {
    toast.error('Вы забанены и не можете добавлять продукты в корзину');
    return;
  }

  // Получаем текущую корзину
  const cart: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');

  // Просто добавляем новый экземпляр продукта в массив, не проверяя на существование
  cart.push(product);

  localStorage.setItem('cart', JSON.stringify(cart));

  toast.success("Продукт добавлен в корзину");
  window.dispatchEvent(new Event('cartUpdated'));
};



 if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <>
      {/* Блок Хит продаж */}
    <div
  className="w-full h-[100vh] bg-black"
  style={{
    backgroundImage: "url('/BG.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
  <div className="flex flex-col items-start justify-center h-full gap-5 px-[10%] md:px-[8%] sm:px-[5%]">
    <h1 className="text-white text-[80px]" id="hit">Хит продаж с Luxique</h1>
    <p className="text-white text-[30px]" id="promo-text">Покупайте качественные товары</p>
    <Link href={"/search"}
      className="bg-custom-gradient text-white w-[327px] h-[50px] cursor-pointer text-[18px] flex items-center justify-center"
      id="catalog-button"
    >
      Перейти в Каталог
    </Link>
  </div>
</div>







<div id="new-arrivals" className="w-full bg-white flex flex-col items-center pb-5">
  <h1 id="new-arrivals-title" className="text-[50px] pb-5 pt-10">Лучшие Продажы</h1>

  <div id="new-arrivals-container" className="w-[80%] px-4 relative">
    <Carousel id="new-arrivals-carousel" className="w-full">
      <CarouselContent id="new-arrivals-carousel-content">
        {products.map((product) => (
            
            <CarouselItem key={product.id} id={`new-arrivals-item-${product.id}`} className="basis-1/4 p-4 flex">
              
              <div id={`new-arrivals-card-${product.id}`} className="relative p-6 flex flex-col h-[500px] justify-between w-[500px]">
                
                <div id={`new-arrivals-image-wrapper-${product.id}`} className="relative w-full h-[80%]">
                  <Link href={`/product/${product.id}`}>
                    <Image
                    id={`new-arrivals-image-${product.id}`}
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-fill rounded"
                  />
                  </Link>
                
                </div>
                <div id={`new-arrivals-info-${product.id}`}>
                                    <Link href={`/product/${product.id}`}>

                  <h3 id={`new-arrivals-title-${product.id}`} className="text-lg font-semibold cursor-pointer">
                    {product.title.length > 30
                      ? product.title.slice(0, 25) + '...'
                      : product.title}
                  </h3>
                  <p id={`new-arrivals-price-${product.id}`} className="text-[#536d65] font-bold">${product.price}</p>
                                    </Link>

                </div>
                <Button
                  id={`new-arrivals-add-btn-${product.id}`}
                  onClick={() => addToCart(product)}
                  className="flex items-center gap-2 text-white cursor-pointer text-[18px]"
                  style={{
                    background: 'linear-gradient(90deg, #2e4b3c 0%, #6f837e 100%)',
                    padding: '10px 20px'
                  }}
                >
                  Добавить в корзину
                  <Image
                    id={`new-arrivals-add-icon-${product.id}`}
                    src="/shopping.png"
                    alt={product.title}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </Button>
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>

     <CarouselPrevious
        id="carousel-previous"
        className="w-[60px] h-[40px] rounded-[0px] text-white hover:text-white transition absolute top-1/2 transform -translate-y-1/2"
        style={{
          left: '-4.5rem',
          background: 'linear-gradient(90deg, #2e4b3c 0%, #595b45 100%)',
        }}
      />
      <CarouselNext
        id="carousel-next"
        className="w-[60px] h-[40px] rounded-[0px] text-white hover:text-white transition absolute top-1/2 transform -translate-y-1/2"
        style={{
          right: '-4.5rem',
          background: 'linear-gradient(90deg, #2e4b3c 0%, #595b45 100%)',
        }}
      />
    </Carousel>
  </div>
<Link href={href}>
   
    <button
    id="go-to-cart-btn"
    className="text-white w-[327px] h-[50px] cursor-pointer text-[18px] mx-auto bg-custom-gradient"
  >
    Перейти в корзину
  </button>
   </Link>
</div>




<div id="new-arrivals" className="w-full bg-[#f4f5f5] flex flex-col items-center pb-5">
  <h1 id="new-arrivals-title" className="text-[50px] pb-5 pt-10">НОВИНКИ</h1>

  <div id="new-arrivals-container" className="w-[80%] px-4 relative">
    <Carousel id="new-arrivals-carousel" className="w-full">
      <CarouselContent id="new-arrivals-carousel-content">
        {newProducts
          .filter((product) => product.createdAt)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((product) => (
            
            <CarouselItem key={product.id} id={`new-arrivals-item-${product.id}`} className="basis-1/4 p-4 flex">
              
              <div id={`new-arrivals-card-${product.id}`} className="relative p-6 flex flex-col h-[500px] justify-between w-[500px]">
                
                <div id={`new-arrivals-image-wrapper-${product.id}`} className="relative w-full h-[80%]">
                  <Link href={`/product/${product.id}`}>
                    <Image
                    id={`new-arrivals-image-${product.id}`}
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-fill rounded"
                  />
                  </Link>
                
                </div>
                <div id={`new-arrivals-info-${product.id}`}>
                                    <Link href={`/product/${product.id}`}>

                  <h3 id={`new-arrivals-title-${product.id}`} className="text-lg font-semibold cursor-pointer">
                    {product.title.length > 30
                      ? product.title.slice(0, 25) + '...'
                      : product.title}
                  </h3>
                  <p id={`new-arrivals-price-${product.id}`} className="text-[#536d65] font-bold">${product.price}</p>
                                    </Link>

                </div>
                <Button
                  id={`new-arrivals-add-btn-${product.id}`}
                  onClick={() => addToCart(product)}
                  className="flex items-center gap-2 text-white cursor-pointer text-[18px]"
                  style={{
                    background: 'linear-gradient(90deg, #2e4b3c 0%, #6f837e 100%)',
                    padding: '10px 20px'
                  }}
                >
                  Добавить в корзину
                  <Image
                    id={`new-arrivals-add-icon-${product.id}`}
                    src="/shopping.png"
                    alt={product.title}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </Button>
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>

     <CarouselPrevious
        id="carousel-previous"
        className="w-[60px] h-[40px] rounded-[0px] text-white hover:text-white transition absolute top-1/2 transform -translate-y-1/2"
        style={{
          left: '-4.5rem',
          background: 'linear-gradient(90deg, #2e4b3c 0%, #595b45 100%)',
        }}
      />
      <CarouselNext
        id="carousel-next"
        className="w-[60px] h-[40px] rounded-[0px] text-white hover:text-white transition absolute top-1/2 transform -translate-y-1/2"
        style={{
          right: '-4.5rem',
          background: 'linear-gradient(90deg, #2e4b3c 0%, #595b45 100%)',
        }}
      />
    </Carousel>
  </div>
<Link href={href}>
   
    <button
    id="go-to-cart-btn"
    className="text-white w-[327px] h-[50px] cursor-pointer text-[18px] mx-auto bg-custom-gradient"
  >
    Перейти в корзину
  </button>
   </Link>
</div>


  <div
      style={{
        backgroundImage: `url('/banner.png')`, // Укажи путь к картинке
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        color: 'white',
        fontSize: '2rem',
        fontWeight: 'bold',
      }}
      className="px-10 flex flex-col gap-5"
    >
  <div className="">
        <h1 id="text2">Покупайте не товар, а качество с Luxique</h1>
      <p id="text3">следуйте за новостями чтобы узнать о новинка и скидках</p>
  </div>
<button
  className="bg-custom-gradient text-white w-[327px] h-[50px] cursor-pointer text-[18px]"
  onClick={() => window.location.href = 'https://www.instagram.com/luxury_mens_sam?igsh=amdhcmdoOGR5eTNo'}

  id="btn-instagramm"
>
  узнать новости в соцсетях
</button>

    </div>

<div id="new-arrivals" className="w-full bg-white flex flex-col items-center pb-5">
  <h1 id="new-arrivals-title" className="text-[50px] pb-5 pt-10">Популярные</h1>

  <div id="new-arrivals-container" className="w-[80%] px-4 relative">
    <Carousel id="new-arrivals-carousel" className="w-full">
      <CarouselContent id="new-arrivals-carousel-content">
        {popularProducts.map((product) => (
            
            <CarouselItem key={product.id} id={`new-arrivals-item-${product.id}`} className="basis-1/4 p-4 flex">
              
              <div id={`new-arrivals-card-${product.id}`} className="relative p-6 flex flex-col h-[500px] justify-between w-[500px]">
                
                <div id={`new-arrivals-image-wrapper-${product.id}`} className="relative w-full h-[80%]">
                  <Link href={`/product/${product.id}`}>
                    <Image
                    id={`new-arrivals-image-${product.id}`}
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-fill rounded"
                  />
                  </Link>
                
                </div>
                <div id={`new-arrivals-info-${product.id}`}>
                                    <Link href={`/product/${product.id}`}>

                  <h3 id={`new-arrivals-title-${product.id}`} className="text-lg font-semibold cursor-pointer">
                    {product.title.length > 30
                      ? product.title.slice(0, 25) + '...'
                      : product.title}
                  </h3>
                  <p id={`new-arrivals-price-${product.id}`} className="text-[#536d65] font-bold">${product.price}</p>
                                    </Link>

                </div>
                <Button
                  id={`new-arrivals-add-btn-${product.id}`}
                  onClick={() => addToCart(product)}
                  className="flex items-center gap-2 text-white cursor-pointer text-[18px]"
                  style={{
                    background: 'linear-gradient(90deg, #2e4b3c 0%, #6f837e 100%)',
                    padding: '10px 20px'
                  }}
                >
                  Добавить в корзину
                  <Image
                    id={`new-arrivals-add-icon-${product.id}`}
                    src="/shopping.png"
                    alt={product.title}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </Button>
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>

     <CarouselPrevious
        id="carousel-previous"
        className="w-[60px] h-[40px] rounded-[0px] text-white hover:text-white transition absolute top-1/2 transform -translate-y-1/2"
        style={{
          left: '-4.5rem',
          background: 'linear-gradient(90deg, #2e4b3c 0%, #595b45 100%)',
        }}
      />
      <CarouselNext
        id="carousel-next"
        className="w-[60px] h-[40px] rounded-[0px] text-white hover:text-white transition absolute top-1/2 transform -translate-y-1/2"
        style={{
          right: '-4.5rem',
          background: 'linear-gradient(90deg, #2e4b3c 0%, #595b45 100%)',
        }}
      />
    </Carousel>
  </div>
<Link href={href}>
   
    <button
    id="go-to-cart-btn"
    className="text-white w-[327px] h-[50px] cursor-pointer text-[18px] mx-auto bg-custom-gradient"
  >
    Перейти в корзину
  </button>
   </Link>
</div>

<div id="new-arrivals" className="w-full bg-[#f4f5f5] flex flex-col items-center pb-5">
  <h1 id="new-arrivals-title" className="text-[50px] pb-5 pt-10">Выгода для вас</h1>

  <div id="new-arrivals-container" className="w-[80%] px-4 relative">
    <Carousel id="new-arrivals-carousel" className="w-full">
      <CarouselContent id="new-arrivals-carousel-content">
        {cheapProducts?.map((product) => (
            
            <CarouselItem key={product.id} id={`new-arrivals-item-${product.id}`} className="basis-1/4 p-4 flex">
              
              <div id={`new-arrivals-card-${product.id}`} className="relative p-6 flex flex-col h-[500px] justify-between w-[500px]">
                
                <div id={`new-arrivals-image-wrapper-${product.id}`} className="relative w-full h-[80%]">
                  <Link href={`/product/${product.id}`}>
                    <Image
                    id={`new-arrivals-image-${product.id}`}
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-fill rounded"
                  />
                  </Link>
                
                </div>
                <div id={`new-arrivals-info-${product.id}`}>
                                    <Link href={`/product/${product.id}`}>

                  <h3 id={`new-arrivals-title-${product.id}`} className="text-lg font-semibold cursor-pointer">
                    {product.title.length > 30
                      ? product.title.slice(0, 25) + '...'
                      : product.title}
                  </h3>
                  <p id={`new-arrivals-price-${product.id}`} className="text-[#536d65] font-bold">${product.price}</p>
                                    </Link>

                </div>
                <Button
                  id={`new-arrivals-add-btn-${product.id}`}
                  onClick={() => addToCart(product)}
                  className="flex items-center gap-2 text-white cursor-pointer text-[18px]"
                  style={{
                    background: 'linear-gradient(90deg, #2e4b3c 0%, #6f837e 100%)',
                    padding: '10px 20px'
                  }}
                >
                  Добавить в корзину
                  <Image
                    id={`new-arrivals-add-icon-${product.id}`}
                    src="/shopping.png"
                    alt={product.title}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </Button>
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>

     <CarouselPrevious
        id="carousel-previous"
        className="w-[60px] h-[40px] rounded-[0px] text-white hover:text-white transition absolute top-1/2 transform -translate-y-1/2"
        style={{
          left: '-4.5rem',
          background: 'linear-gradient(90deg, #2e4b3c 0%, #595b45 100%)',
        }}
      />
      <CarouselNext
        id="carousel-next"
        className="w-[60px] h-[40px] rounded-[0px] text-white hover:text-white transition absolute top-1/2 transform -translate-y-1/2"
        style={{
          right: '-4.5rem',
          background: 'linear-gradient(90deg, #2e4b3c 0%, #595b45 100%)',
        }}
      />
    </Carousel>
  </div>
<Link href={href}>
   
    <button
    id="go-to-cart-btn"
    className="text-white w-[327px] h-[50px] cursor-pointer text-[18px] mx-auto bg-custom-gradient"
  >
    Перейти в корзину
  </button>
   </Link>
</div>


<div className="bg-white flex flex-col items-center justify-center py-10">
<h1
  style={{
    fontFamily: 'Lighthaus',
    fontWeight: 400,
    fontSize: '50px',
    lineHeight: '75%',
    letterSpacing: '0%',
    textAlign: 'center'
  }}
>
  ПОЧЕМУ НУЖНО ВЫБРАТЬ НАС
</h1>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6  px-[10%]">
  {/* Карточка 1 */}
  <div className="flex flex-col items-start gap-4 p-4 ">
    <div className="w-[80px] h-[80px] flex items-center justify-center" style={{ background: 'linear-gradient(278.32deg, #0B3F37 -7.03%, #CB8D62 136.33%)' }}>
      <Image src="/lux.png" alt="sale" width={48} height={48} />
    </div>
    <h3 className="text-lg font-semibold text-[#031412]">Изысканность</h3>
    <p className="text-sm text-[#031412]">
      Мы предлагаем товары премиального качества, сочетающие стиль, практичность и современные технологии для вашего комфорта и удовольствия.
    </p>
  </div>

  {/* Карточка 2 */}
  <div className="flex flex-col items-start gap-4 p-4 ">
    <div className="w-[80px] h-[80px] flex items-center justify-center" style={{ background: 'linear-gradient(278.32deg, #0B3F37 -7.03%, #CB8D62 136.33%)' }}>
      <Image src="/true-money.png" alt="sale" width={48} height={48} />
    </div>
    <h3 className="text-lg font-semibold text-[#031412]">Честная оплата</h3>
    <p className="text-sm text-[#031412]">
      Мы ценим доверие клиентов, поэтому предлагаем только честные цены без скрытых комиссий и переплат.
    </p>
  </div>

  {/* Карточка 3 */}
  <div className="flex flex-col items-start gap-4 p-4 ">
    <div className="w-[80px] h-[80px] flex items-center justify-center" style={{ background: 'linear-gradient(278.32deg, #0B3F37 -7.03%, #CB8D62 136.33%)' }}>
      <Image src="/potion.png" alt="sale" width={48} height={48} />
    </div>
    <h3 className="text-lg font-semibold text-[#031412]">Большой ассортимент</h3>
    <p className="text-sm text-[#031412]">
      У нас вы найдете всё: от модной одежды и аксессуаров до современной техники и ювелирных украшений для любого стиля жизни.
    </p>
  </div>

  {/* Карточка 4 */}
  <div className="flex flex-col items-start gap-4 p-4 ">
    <div className="w-[80px] h-[80px] flex items-center justify-center" style={{ background: 'linear-gradient(278.32deg, #0B3F37 -7.03%, #CB8D62 136.33%)' }}>
      <Image src="/hands.png" alt="sale" width={48} height={48} />
    </div>
    <h3 className="text-lg font-semibold text-[#031412]">Доставка по всему миру</h3>
    <p className="text-sm text-[#031412]">
      Мы доставляем заказы в любую точку мира быстро и надежно, чтобы вы могли наслаждаться покупками без задержек.
    </p>
  </div>

  {/* Карточка 5 */}
  <div className="flex flex-col items-start gap-4 p-4 ">
    <div className="w-[80px] h-[80px] flex items-center justify-center" style={{ background: 'linear-gradient(278.32deg, #0B3F37 -7.03%, #CB8D62 136.33%)' }}>
      <Image src="/shield.png" alt="sale" width={48} height={48} />
    </div>
    <h3 className="text-lg font-semibold text-[#031412]">Гарантия качества</h3>
    <p className="text-sm text-[#031412]">
      Все наши товары проходят строгий контроль качества, чтобы вы получали только лучшие продукты.
    </p>
  </div>

  {/* Карточка 6 */}
  <div className="flex flex-col items-start gap-4 p-4 ">
    <div className="w-[80px] h-[80px] flex items-center justify-center" style={{ background: 'linear-gradient(278.32deg, #0B3F37 -7.03%, #CB8D62 136.33%)' }}>
      <Image src="/potion 1.png" alt="sale" width={48} height={48} />
    </div>
    <h3 className="text-lg font-semibold text-[#031412]">Удобство в использовании</h3>
    <p className="text-sm text-[#031412]">
      Наши товары продуманы до мелочей для легкости использования и максимального комфорта в повседневной жизни.
    </p>
  </div>

  {/* Карточка 7 */}
  <div className="flex flex-col items-start gap-4 p-4 ">
    <div className="w-[80px] h-[80px] flex items-center justify-center" style={{ background: 'linear-gradient(278.32deg, #0B3F37 -7.03%, #CB8D62 136.33%)' }}>
      <Image src="/world.png" alt="sale" width={48} height={48} />
    </div>
    <h3 className="text-lg font-semibold text-[#031412]">Забота об окружающей среде</h3>
    <p className="text-sm text-[#031412]">
      Мы стремимся снизить воздействие на природу и поддерживаем проекты по охране окружающей среды.
    </p>
  </div>

  {/* Карточка 8 */}
  <div className="flex flex-col items-start gap-4 p-4 ">
    <div className="w-[80px] h-[80px] flex items-center justify-center" style={{ background: 'linear-gradient(278.32deg, #0B3F37 -7.03%, #CB8D62 136.33%)' }}>
      <Image src="/star.png" alt="sale" width={48} height={48} />
    </div>
    <h3 className="text-lg font-semibold text-[#031412]">Аутентичность</h3>
    <p className="text-sm text-[#031412]">
      Каждый товар имеет свою историю и уникальность, которые делают вашу покупку особенной.
    </p>
  </div>
</div>


</div>
    

    </>
  );
}
 
                   
               