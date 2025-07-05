import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './globals.css';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="flex flex-col min-h-screen">
        <Header/>
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}