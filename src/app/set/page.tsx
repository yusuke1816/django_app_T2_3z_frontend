'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Cog6ToothIcon, MoonIcon, BellIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotification, setEmailNotification] = useState(true);
  const [language, setLanguage] = useState('ja');
  const router = useRouter();

  useEffect(() => {
    const access = localStorage.getItem('access');
    if (!access) {
      router.push('/hello');
    }
  }, [router]);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex justify-center items-center gap-2">
          <Cog6ToothIcon className="h-8 w-8 text-gray-500" />
          設定
        </h1>
        <p className="text-gray-600">アプリの各種設定を変更できます。</p>
      </div>

      <div className="space-y-8">
        {/* テーマ設定 */}
        <section className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <MoonIcon className="h-6 w-6 text-indigo-500" />
            <h2 className="text-xl font-semibold">テーマ設定</h2>
          </div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span className="text-gray-700">ダークモードを有効にする</span>
          </label>
          <p className="mt-2 text-sm text-gray-500">
            現在のモード: {darkMode ? '🌙 ダークモード' : '☀️ ライトモード'}
          </p>
        </section>

        {/* 通知設定 */}
        <section className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <BellIcon className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-semibold">通知設定</h2>
          </div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={emailNotification}
              onChange={() => setEmailNotification(!emailNotification)}
              className="form-checkbox h-5 w-5 text-yellow-500"
            />
            <span className="text-gray-700">メール通知を受け取る</span>
          </label>
          <p className="mt-2 text-sm text-gray-500">
            {emailNotification ? '📧 メール通知が有効です。' : '🔕 メール通知は無効です。'}
          </p>
        </section>

        {/* 言語設定 */}
        <section className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <GlobeAltIcon className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold">言語設定</h2>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          >
            <option value="ja">日本語</option>
            <option value="en">English</option>
            <option value="zh">中文</option>
            <option value="ko">한국어</option>
          </select>
          <p className="mt-2 text-sm text-gray-500">
            選択中の言語: {language === 'ja' ? '🇯🇵 日本語' : language === 'en' ? '🇺🇸 English' : language === 'zh' ? '🇨🇳 中文' : '🇰🇷 한국어'}
          </p>
        </section>
      </div>
    </main>
  );
}
