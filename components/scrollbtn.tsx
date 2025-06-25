'use client'
//тут кнопка для если вы когда уже пролистали весь сайт минимум один section то появляеться эта кнопка и переводить к началу сайта 
import React, { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    showButton && (
      <button
        onClick={scrollToTop}
        className="fixed cursor-pointer right-5 top-1/2 transform -translate-y-1/2 z-50 bg-[#3a503f] text-white px-4 py-2 rounded-none shadow-lg hover:bg-[#56735d] transition"
        style={{
          width: '60px', 
          height: '60px', 
        }}
      >
        ↑
      </button>
    )
  );
};

export default ScrollToTopButton;
