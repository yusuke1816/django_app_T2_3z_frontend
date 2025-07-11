'use client'

import Link from 'next/link'
import { useContext } from 'react'
import { DarkModeContext } from '../../../context/DarkModeContext'

export default function Example() {
  const { darkMode } = useContext(DarkModeContext)

  return (
    <main
      className={`mx-auto max-w-2xl py-16 sm:py-24 lg:py-32 px-6 text-center ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      <div className="hidden sm:mb-8 sm:flex sm:justify-center">
        <div
          className={`relative rounded-full px-3 py-1 text-sm ring-1 hover:ring-opacity-30 ${
            darkMode
              ? 'text-gray-300 ring-gray-700 hover:ring-gray-500'
              : 'text-gray-600 ring-gray-900/10 hover:ring-gray-900/20'
          }`}
        >
          新機能リリースのお知らせ。{' '}
          <a
            href="#"
            className="font-semibold text-green-600 relative"
          >
            詳しく見る <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
      <h1
        className={`text-5xl font-semibold tracking-tight sm:text-7xl ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}
      >
        簡単に<br />
        お金を管理する
      </h1>
      <p
        className={`mt-8 text-lg font-medium sm:text-xl ${
          darkMode ? 'text-gray-300' : 'text-gray-500'
        }`}
      >
        収入や支出を一括管理して、賢く節約。<br />
        あなたの資産をもっと豊かにしましょう。
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link
          href="/auth"
          className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          ログイン
        </Link>
        <Link
          href="/create-user"
          className={`text-sm font-semibold ${
            darkMode ? 'text-gray-300' : 'text-gray-900'
          }`}
        >
          新規登録<span aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  )
}
