'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';  
import {
  Dialog,
  DialogPanel,
} from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ListBulletIcon,
  PlusCircleIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

export default function Header() {
  const router = useRouter(); 
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    router.push('/hello');
  };

  return (
    <header className="bg-white shadow">
      <nav className="mx-auto flex max-w-5xl items-center justify-between p-4 sm:px-6 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex items-center gap-2 lg:flex-1">
          <BanknotesIcon className="h-6 w-6 text-green-600" />
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-green-500 transition-colors">
            Money Manager
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">メニューを開く</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden lg:flex lg:gap-x-6 text-gray-700 font-medium items-center">
          {isLoggedIn ? (
            <>
              <Link href="/" className="flex items-center gap-1 hover:text-green-500 transition-colors">
                <HomeIcon className="h-5 w-5" />
                ホーム
              </Link>
              <Link href="/list" className="flex items-center gap-1 hover:text-green-500 transition-colors">
                <ListBulletIcon className="h-5 w-5" />
                支出一覧
              </Link>
              <Link href="/add" className="flex items-center gap-1 hover:text-green-500 transition-colors">
                <PlusCircleIcon className="h-5 w-5" />
                支出追加
              </Link>
              <Link href="/settings" className="flex items-center gap-1 hover:text-green-500 transition-colors">
                <Cog6ToothIcon className="h-5 w-5" />
                設定
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                ログアウト
              </button>
              <UserCircleIcon className="h-6 w-6 text-green-600" />
            </>
          ) : (
            <Link href="/auth" className="flex items-center gap-1 hover:text-green-500 transition-colors">
              <UserIcon className="h-5 w-5" />
              ログイン
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile drawer */}
      <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white p-6 sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BanknotesIcon className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold">Money Manager</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">メニューを閉じる</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 space-y-4">
            {isLoggedIn ? (
              <>
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-gray-900 hover:text-green-500">
                  <HomeIcon className="h-5 w-5" />
                  ホーム
                </Link>
                <Link href="/list" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-gray-900 hover:text-green-500">
                  <ListBulletIcon className="h-5 w-5" />
                  支出一覧
                </Link>
                <Link href="/add" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-gray-900 hover:text-green-500">
                  <PlusCircleIcon className="h-5 w-5" />
                  支出追加
                </Link>
                <Link href="/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-gray-900 hover:text-green-500">
                  <Cog6ToothIcon className="h-5 w-5" />
                  設定
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-gray-900 hover:text-green-500 bg-transparent border-none cursor-pointer"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  ログアウト
                </button>
                <UserCircleIcon className="h-6 w-6 text-green-600" />
              </>
            ) : (
              <Link href="/auth" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-gray-900 hover:text-green-500">
                <UserIcon className="h-5 w-5" />
                ログイン
              </Link>
            )}
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
