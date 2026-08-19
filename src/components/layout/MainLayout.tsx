import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { UpdateBannerPopup } from '../UpdateBannerPopup';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFF] relative overflow-hidden font-sans">
      {/* Soft Background Gradients */}
      <div className="fixed top-[-10%] right-[-10%] w-[70%] aspect-square rounded-full blur-[120px] opacity-20 bg-gradient-to-br from-purple-400 to-pink-300 -z-10 animate-pulse" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full blur-[120px] opacity-20 bg-gradient-to-tr from-blue-400 to-cyan-300 -z-10" />
      <div className="fixed top-[20%] left-[10%] w-[40%] aspect-square rounded-full blur-[100px] opacity-10 bg-orange-200 -z-10" />

      <Header />
      <UpdateBannerPopup />
      
      <main className="container mx-auto px-4 py-6 pb-32 md:pb-8 max-w-7xl">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
};
