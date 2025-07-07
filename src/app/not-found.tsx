'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';

export default function NotFound() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  return (
    <main className="grid min-h-full place-items-center bg-white dark:bg-gray-900 px-6 py-24 sm:py-32 lg:px-8 text-gray-900 dark:text-gray-100">
      <div className="text-center max-w-xl px-4">
        <button
          onClick={toggleDarkMode}
          className="mb-6 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          {darkMode ? 'ライトモードに切替' : 'ダークモードに切替'}
        </button>

        <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">404</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-7xl">
          ページが見つかりません
        </h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
          お探しのページは存在しないか、移動された可能性があります。
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            ホームに戻る
          </Link>
          <Link
            href="/support"
            className="text-sm font-semibold text-gray-900 dark:text-gray-100"
          >
            サポートに連絡 <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
