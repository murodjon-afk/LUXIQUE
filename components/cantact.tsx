"use client";
import { useModal } from "./ModalProvider";
import React from "react";
import Link from "next/link";
import Image from "next/image";
const ContactsModal = () => {
  const { contactsOpen, closeContactsModal } = useModal();

  if (!contactsOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-500" onClick={closeContactsModal}>
      <div className="bg-white rounded-lg p-6 w-[400px] relative shadow-lg" id="contact-mod">
        <button onClick={closeContactsModal} className="absolute top-2 right-2 text-black text-2xl font-bold hover:text-red-600 transition">
          &times;
        </button>
         <div className="flex flex-col items-center">
             < div className="flex items-center gap-3 cursor-pointer">
        <Image
          src="/logo.png"
          alt="Luxique Logo"
          width={50}
          height={50}
          className="w-[40px] h-[35px] md:w-[50px] md:h-[45px] lg:w-[70px] lg:h-[60px]"
        />
        <p className="text-lg md:text-2xl lg:text-[30px] text-yellow-700">
          Luxique
        </p>
      </div>
        <h2 className="text-xl font-semibold mb-3 text-center">Контакты</h2>
        <div className="">
             <div className="flex flex-col gap-6 justify-start   w-[300px] items-start p-6">
     <Link href="https://x.com/LuxuryWatchGuy1" className="flex  items-center gap-2">
  <Image src="/x.png" alt="luXique" width={60} height={60} />
  <span>Luxique.x.com</span>
</Link>

<Link href="https://www.instagram.com/luxury_mens_sam?igsh=amdhcmdoOGR5eTNo" className="flex  items-center gap-2">
  <Image src="/instagram.png" alt="luXique" width={60} height={60} />
  <span>Luxique.instagram.com</span>
</Link>

<Link href="https://www.facebook.com/groups/209002125098911" className="flex  items-center gap-2">
  <Image src="/facebook.png" alt="luXique" width={60} height={60} />

  <span>Luxique.facebook.com</span>
</Link>


<Link href="https://www.youtube.com/@Luxiquecollection" className="flex  items-center gap-2">
  <Image src="/youtube.png" alt="luXique" width={60} height={60} />

  <span>Luxique.youtube.com</span>
</Link>

    </div>
        </div>
         </div>
      </div>
    </div>
  );
};

export default ContactsModal;
