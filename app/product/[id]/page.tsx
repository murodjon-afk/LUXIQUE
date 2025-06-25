"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  rating: [];
  category: string;
};
type ProductWithQuantity = Product & { quantity: number };

const addToCart = (product: Product) => {
  const cart: ProductWithQuantity[] = JSON.parse(localStorage.getItem("cart") || "[]");

  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  toast.success("Продукт добавлен в корзину");
  window.dispatchEvent(new Event("cartUpdated"));
};




export default function ProductPage() {
  const params = useParams();
  const id = params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [allProduct ,setAllProducts]= useState<Product[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProductAndSimilar = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Ошибка загрузки продукта");
        const data = await res.json();
        setProduct(data);
    
        // Загружаем все продукты
  const allRes = await fetch("/api/products");
const allProducts: Product[] = await allRes.json();

setAllProducts(allProduct);

        // Находим похожие
        const similar = allProducts.filter(
          (p) => p.category === data.category && p.id !== data.id
        );

        let result = [...similar];

        // Добавим недостающие из других категорий
        const needCount = 5 - result.length;
        if (needCount > 0) {
          const others = allProducts
            .filter((p) => p.category !== data.category && p.id !== data.id)
            .slice(0, needCount);
          result = [...result, ...others];
        }

        setSimilarProducts(result);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndSimilar();
  }, [id , allProduct]);

  
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }  if (error) return <p>Ошибка: {error}</p>;
  if (!product) return <p>Продукт не найден</p>;

  return (
    <>
    <div className="w-full h-screen flex flex-col items-center justify-end bg-gray-50">
      <div className="w-full h-[95%] ">
        <div className="w-[90%] h-[90%] bg-white mx-auto rounded-lg shadow-[0_5px_12px_rgba(0,0,0,0.2)] py-10 px-10 " id="cont-bas">
          <h1 className="text-4xl font-extrabold text-start text-green-950 tracking-wide pb-10">
            Каталог продукта
          </h1>
          <div className="h-full flex gap-5 " id="basket-cont">
            <Image
              src={product.image}
              alt={product.title}
              width={200}
              height={200}
              className="rounded-3xl border w-[450px] h-[80%]"
              id="basket-img"
            />
            <div className="py-6 flex flex-col gap-5">
              <h1 className="text-3xl font-bold" id="basket-title">{product.title}</h1>
              <h1 className="text-3xl font-bold text-black" id="basket-price">{product.price} $</h1>
              <h1 className="text-3xl text-[#ACACAC] w-[500px] leading-relaxed" id="basket-desc">
                {product.description.length > 100
                  ? product.description.slice(0, 100) + "..."
                  : product.description}
              </h1>
              <div className="flex gap-5">
    
                <div className="text-m font-semibold text-white mb-2 w-[220px] h-[40px] flex items-center justify-center rounded-lg bg-green-900" id="basket-ctg">
                  Категория: {product.category}
                </div>
              </div>
              <button
                className="w-[400px] h-[60px] bg-green-900 text-white text-xl rounded-lg cursor-pointer"
                onClick={() => addToCart(product)}
                id="basket-btn"
              >
                Добавить В корзину
              </button>
            </div>
          </div>

          
        </div>
      </div>
    </div>
      <div className="w-full mb-12  flex items-center justify-center bg-gray-50">
        <div className="w-[95%] h-[80%] px-10 " id="similar-carusel">
            <h2 className="text-3xl font-bold text-green-950 mb-6 px-5 ">Похожие товары</h2>
<div
  className="flex gap-1 flex-col  py-4 rounded-lg">   
       <Carousel id="new-arrivals-carousel" className="w-full">
      <CarouselContent id="new-arrivals-carousel-content">
        {similarProducts.map((product) => (
            
            <CarouselItem key={product.id} id={`new-arrivals-item-${product.id}`} className="basis-1/4 p-4 flex">
              
              <div id={`new-arrivals-card-${product.id}`} className="relative p-6 flex flex-col h-[500px] justify-between w-[500px]">
                
                <div id={`new-arrivals-image-wrapper-${product.id}`} className="relative w-full h-[80%]">
                  <Link href={`/product/${product.id}`}>
                    <Image
                    id={`new-arrivals-image-${product.id}`}
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-fill rounded-[7px]"
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

            
            </div>
          </div>
    </>
  );
}
