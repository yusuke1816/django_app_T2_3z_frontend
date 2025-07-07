'use client';

import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Dialog, DialogPanel } from '@headlessui/react';
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

import { DarkModeContext } from '../../context/DarkModeContext';

export default function Header() {
  const router = useRouter();
  const { darkMode } = useContext(DarkModeContext);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const access = localStorage.getItem('access');
    if (!access) {
      setIsLoggedIn(false);
      setUsername(null);
      return;
    }
    setIsLoggedIn(true);

    fetch('http://localhost:8000/api/users/me/', {
      headers: { Authorization: `Bearer ${access}` },
    })
      .then(res => (res.ok ? res.json() : Promise.reject('認証エラー')))
      .then(data => setUsername(data.username))
      .catch(() => setUsername(null));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    setIsLoggedIn(false);
    setUsername(null);
    router.push('/hello');
  };

  return (
    <header className={`shadow ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <nav
        className={`mx-auto flex max-w-5xl items-center justify-between p-4 sm:px-6 lg:px-8 ${
          darkMode ? 'text-gray-200' : 'text-gray-700'
        }`}
        aria-label="Global"
      >
        <div className="flex items-center gap-2 lg:flex-1">
          <BanknotesIcon className={`${darkMode ? 'text-green-500' : 'text-green-700'} h-6 w-6`} />
          <Link
            href="/"
            className={`text-2xl font-bold hover:text-green-600 transition-colors ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            }`}
          >
            Money Manager
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`${darkMode ? 'text-gray-200' : 'text-gray-700'} -m-2.5 inline-flex items-center justify-center rounded-md p-2.5`}
          >
            <span className="sr-only">メニューを開く</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-6 font-medium items-center">
          {isLoggedIn ? (
            <>
              <Link
                href="/"
                className={`flex items-center gap-1 hover:text-green-600 transition-colors ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                <HomeIcon className="h-5 w-5" />
                ホーム
              </Link>
              <Link
                href="/list"
                className={`flex items-center gap-1 hover:text-green-600 transition-colors ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                <ListBulletIcon className="h-5 w-5" />
                支出一覧
              </Link>
              <Link
                href="/add"
                className={`flex items-center gap-1 hover:text-green-600 transition-colors ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                <PlusCircleIcon className="h-5 w-5" />
                支出追加
              </Link>
              <Link
                href="/set"
                className={`flex items-center gap-1 hover:text-green-600 transition-colors ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                <Cog6ToothIcon className="h-5 w-5" />
                設定
              </Link>
              <button
                onClick={handleLogout}
                className={`flex items-center gap-1 hover:text-red-600 transition-colors bg-transparent border-none cursor-pointer ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                ログアウト
              </button>
              <div className="flex items-center gap-1">
  <UserCircleIcon className={`${darkMode ? 'text-green-500' : 'text-green-700'} h-6 w-6`} />
  {username && (
    <span className={`${darkMode ? 'text-gray-200' : 'text-gray-900'} text-sm font-semibold`}>
      {username} さん
    </span>
  )}
</div>
            </>
          ) : (
            <Link
              href="/auth"
              className={`flex items-center gap-1 hover:text-green-600 transition-colors ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              <UserIcon className="h-5 w-5" />
              ログイン
            </Link>
          )}
        </div>
      </nav>

      {/* モバイルメニュー */}
      <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <DialogPanel
          className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm p-6 sm:ring-1 sm:ring-gray-900/10 ${
            darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BanknotesIcon className={`${darkMode ? 'text-green-500' : 'text-green-700'} h-6 w-6`} />
              <span className="text-xl font-bold">Money Manager</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className={`${darkMode ? 'text-gray-200' : 'text-gray-700'} -m-2.5 rounded-md p-2.5`}
            >
              <span className="sr-only">メニューを閉じる</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 space-y-4">
            {isLoggedIn ? (
              <>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 hover:text-green-600"
                >
                  <HomeIcon className="h-5 w-5" />
                  ホーム
                </Link>
                <Link
                  href="/list"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 hover:text-green-600"
                >
                  <ListBulletIcon className="h-5 w-5" />
                  支出一覧
                </Link>
                <Link
                  href="/add"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 hover:text-green-600"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  支出追加
                </Link>
                <Link
                  href="/set"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 hover:text-green-600"
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                  設定
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 hover:text-red-600 bg-transparent border-none cursor-pointer"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  ログアウト
                </button>
                <div className="flex items-center gap-1">
  <UserCircleIcon className={`${darkMode ? 'text-green-500' : 'text-green-700'} h-6 w-6`} />
  {username && (
    <span className={`${darkMode ? 'text-gray-200' : 'text-gray-900'} text-sm font-semibold`}>
      {username} さん
    </span>
  )}
</div>
              </>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 hover:text-green-600"
              >
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
