import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-pink-100">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
          Gương Mặt Diệu Kỳ
        </h1>
        <p className="text-center text-slate-500 mt-1">Biến hóa ảnh chân dung của bạn chỉ với vài cú nhấp chuột</p>
      </div>
    </header>
  );
};

export default Header;