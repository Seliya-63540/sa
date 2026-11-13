import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CustomerBottomNav } from '../components/layout/CustomerBottomNav';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <CustomerBottomNav />
    </div>
  );
};
