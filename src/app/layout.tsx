// app/layout.tsx (RootLayout)
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './globals.css';
import { Toaster } from 'react-hot-toast'
import { DarkModeProvider } from '../../context/DarkModeContext';  // 追加

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="flex flex-col min-h-screen">
        <DarkModeProvider>  {/* ここでラップ */}
          <Header />
          <main className="flex-grow bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {children}
            <Toaster position="top-center" />
          </main>
          <Footer />
        </DarkModeProvider>
      </body>
    </html>
  );
}
