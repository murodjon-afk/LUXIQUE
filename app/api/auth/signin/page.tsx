"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SignInWithPhone() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [phone, setPhone] = useState<string>("");
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
useEffect(() => {
  if (status === "authenticated" && session?.user?.email) {
    const phoneFromLS = localStorage.getItem("userPhone") || ""
   
    const password = phoneFromLS.replace(/^\+998/, "").replace(/-/g, "")

    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.user.email,
        name: session.user.name || "Без имени",
        password: password || "defaultpass123",
        phone: phoneFromLS,
        role: "buyer"
      })
    })
      .then(async (res) => {
        const data = await res.json()
        if (res.status === 201) {
                      router.push("/profile") 

        } else if (res.status === 200 && data.message === "User already exists") {
                      router.push("/profile") 

        } else {
          console.error("❌ Ошибка при создании пользователя:", data)
        }
      })
      .catch((err) => {
        console.error("❌ Ошибка при создании пользователя:", err)
      })
  }
}, [status, session ,router])



  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, "").substring(0, 9);
    const parts = [];
    if (cleaned.length > 0) parts.push(cleaned.substring(0, 2));
    if (cleaned.length > 2) parts.push(cleaned.substring(2, 5));
    if (cleaned.length > 5) parts.push(cleaned.substring(5, 7));
    if (cleaned.length > 7) parts.push(cleaned.substring(7, 9));
    return parts.join("-");
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsConfirmed(e.target.checked);
  };

  const verifyCodeAndSignIn = () => {
    localStorage.setItem("userPhone", "+998" + phone);
    signIn("google");
  };

  const isPhoneComplete = phone.replace(/\D/g, "").length === 9;
  const isButtonEnabled = isPhoneComplete && isConfirmed;

  if (status === "loading") return <div>Загрузка...</div>;
  if (status === "authenticated")  return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ); ;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full" id="signin-bg">
      <div className="w-[400px] h-[600px] bg-white rounded-[25px] px-5 py-5 flex flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <Image src="/logo.png" alt="Luxique Logo" width={40} height={40} className="w-[60px] h-[50px]" />
            <p className="text-lg md:text-2xl lg:text-[30px] text-yellow-700">Luxique</p>
          </Link>
          <h1 className="text-[30px] text-start text-[#243344] font-[500] mt-5">Введите номер</h1>
          <h1 className="text-[20px] text-start text-gray-600 font-[500] pb-5">
            Введите верный номер телефона, чтобы мы могли связаться с вами
          </h1>
          <div className="flex items-center border p-2 my-2 h-[50px] rounded-[5px] border-[#b3bcc5] border-[2px] bg-white">
            <span className="text-gray-600 pr-2">+998</span>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="00-000-00-00"
              className="outline-none flex-1"
              maxLength={12}
              required
            />
          </div>
          <button
            onClick={verifyCodeAndSignIn}
            className={`text-[#243344] font-[600] text-[20px] px-4 py-2 w-[100%] rounded-lg h-[50px] flex gap-1 items-center justify-center border border-black mt-4 ${
              !isButtonEnabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            disabled={!isButtonEnabled}
          >
            <Image src="/gog.png" alt="Google" width={40} height={40} className="w-[40px] h-[40px]" />
            Войти
          </button>
        </div>

        <label className="flex items-center gap-2 text-gray-700 text-sm mt-4 select-none">
          <input
            type="checkbox"
            checked={isConfirmed}
            onChange={handleCheckboxChange}
            className="w-5 h-5 rounded border border-gray-400 cursor-pointer"
          />
          <span>Подтверждаю, что ознакомлен с политикой безопасности и соглашаюсь с условиями.</span>
        </label>
      </div>
    </div>
  );
}
