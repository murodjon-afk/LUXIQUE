"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  userId: number | null;
};
const AllProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) {
          throw new Error("Ошибка загрузки продуктов");
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "" || product.category === selectedCategory;
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

const addToCart = (product:Product) => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated')); 
};

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <>
      <div className="w-full h-screen flex flex-col items-center justify-end">
        <div className="w-full h-[95%]">
          <div
            id="cart-container"
            className="w-[90%] h-[90%] bg-[#f4f5f5] mx-auto rounded-lg shadow-[0_5px_12px_rgba(0,0,0,0.2)] overflow-y-auto p-4 flex flex-col"
          >
            <div className="">
              <h1 className="text-4xl font-extrabold text-start text-green-950 tracking-wide pl-0 pb-3 pt-5">
                Поиск
              </h1>
              <DropdownMenu >
                <DropdownMenuTrigger className="px-4 py-4 bg-gray-200 rounded-md cursor-pointer select-none my-2">
                  {selectedCategory
                    ? `Категория: ${selectedCategory}`
                    : "Фильтр по категориям"}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Фильтр по категориям</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setSelectedCategory("")}
                    className={`cursor-pointer ${
                      selectedCategory === "" ? "font-bold text-green-700" : ""
                    }`}
                  >
                    Все категории
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedCategory("electronics")}
                    className={`cursor-pointer ${
                      selectedCategory === "electronics"
                        ? "font-bold text-green-700"
                        : ""
                    }`}
                  >
                    Техника
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedCategory("jewelery")}
                    className={`cursor-pointer ${
                      selectedCategory === "jewelery"
                        ? "font-bold text-green-700"
                        : ""
                    }`}
                  >
                    Ювелирные изделия
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedCategory("men's clothing")}
                    className={`cursor-pointer ${
                      selectedCategory === "men's clothing"
                        ? "font-bold text-green-700"
                        : ""
                    }`}
                  >
                    Мужская одежда
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedCategory("women's clothing")}
                    className={`cursor-pointer ${
                      selectedCategory === "women's clothing"
                        ? "font-bold text-green-700"
                        : ""
                    }`}
                  >
                    Женская одежда
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <input
              type="text"
              placeholder="Поиск продуктов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-6"
            />

            <div className="flex justify-start px-10 " id="search-grid2">
              <div
                className="inline-grid grid-cols-[repeat(5, 1fr)] w-full gap-8  "
                id="search-grid"

              >
                {filteredProducts.length > 0 ? (
                 filteredProducts.map((product) => (
    <div
      key={product.id}
      id="sr-prod"
      className="relative p-2 flex flex-col h-[450px] justify-between w-full bg-white rounded-lg shadow-md"
    >
      <Link href={`/product/${product.id}`} className="h-[70%]">
        <div
          id={`product-image-wrapper-${product.id}`}
          className="relative w-full h-full"
        >
          <Image
            id="sr-img"
            src={product.image}
            alt={product.title}
            fill
            className="object-fill rounded"
          />
        </div>
        <div id={`product-info-${product.id}`} className="mt-3">
          <h3
            id={`product-title-${product.id}`}
            className="text-lg font-semibold"
          >
            {product.title.length > 30
              ? product.title.slice(0, 25) + "..."
              : product.title}
          </h3>
          <p
            id={`product-price-${product.id}`}
            className="text-[#536d65] font-bold"
          >
            ${product.price}
          </p>
        </div>
      </Link>

      <button
        id="sr-btn"
        onClick={() => addToCart(product)}
        className="flex items-center gap-2 text-white cursor-pointer text-[18px]"
        style={{
          background: "linear-gradient(90deg, #2e4b3c 0%, #6f837e 100%)",
          padding: "10px 20px",
          borderRadius: "6px",
          marginTop: "12px",
          justifyContent: "center",
        }}
        type="button"
      >
        Добавить в корзину
        <Image
          id="sr-btn-img"
          src="/shopping.png"
          alt="Корзина"
          width={24}
          height={24}
          className="object-contain"
        />
      </button>
    </div>
  ))
                ) : (
                 <>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-between gap-4 p-4">
       <Image
    src="/undefined.png"
    alt="Luxique Logo"
    width={134}
    height={134}
    id="search-img"
  />
 <h1 className="text-2xl font-semibold mb-2 text-gray-800 " id="search-text">
    Нет продуктов, соответствующих поиску.
  </h1>      </div>
   
                 </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProductsPage;
