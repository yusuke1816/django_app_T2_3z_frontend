'use client';

import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DarkModeContext } from '../../../context/DarkModeContext';
import { Cog6ToothIcon, MoonIcon, BellIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const supportedLanguages = ['ja', 'en', 'zh', 'ko'];

export default function SettingsPage() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [emailNotification, setEmailNotification] = useState(true);
  const [language, setLanguage] = useState('ja');
  const router = useRouter();

  useEffect(() => {
    const pathLang = window.location.pathname.split('/')[1];
    if (supportedLanguages.includes(pathLang)) {
      setLanguage(pathLang);
    }
  }, []);

  useEffect(() => {
    const access = localStorage.getItem('access');
    if (!access) {
      router.push('/hello');
    }
  }, [router]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);

    const segments = window.location.pathname.split('/');
    if (supportedLanguages.includes(segments[1])) {
      segments[1] = newLang;
    } else {
      segments.splice(1, 0, newLang);
    }
    const newPath = segments.join('/') || '/';

    window.location.href = newPath + window.location.search + window.location.hash;
  };

  return (
    <main className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 flex justify-center items-center gap-2">
          <Cog6ToothIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
          設定
        </h1>
        <p className="text-gray-600 dark:text-gray-400">アプリの各種設定を変更できます。</p>
      </div>

      <div className="space-y-8">
        {/* テーマ設定 */}
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-4">
            <MoonIcon className="h-6 w-6 text-indigo-500" />
            <h2 className="text-xl font-semibold">テーマ設定</h2>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span className="text-gray-700 dark:text-gray-300 select-none">ダークモードを有効にする</span>
          </label>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            現在のモード: {darkMode ? '🌙 ダークモード' : '☀️ ライトモード'}
          </p>
        </section>

        {/* 通知設定 */}
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-4">
            <BellIcon className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-semibold">通知設定</h2>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotification}
              onChange={() => setEmailNotification(!emailNotification)}
              className="form-checkbox h-5 w-5 text-yellow-500"
            />
            <span className="text-gray-700 dark:text-gray-300 select-none">メール通知を受け取る</span>
          </label>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {emailNotification ? '📧 メール通知が有効です。' : '🔕 メール通知は無効です。'}
          </p>
        </section>

        {/* 言語設定 */}
        <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-4">
            <GlobeAltIcon className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold">言語設定</h2>
          </div>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="ja">日本語</option>
            <option value="en">English</option>
            <option value="zh">中文</option>
            <option value="ko">한국어</option>
          </select>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            選択中の言語: {language === 'ja' ? '🇯🇵 日本語' : language === 'en' ? '🇺🇸 English' : language === 'zh' ? '🇨🇳 中文' : '🇰🇷 한국어'}
          </p>
        </section>
      </div>
    </main>
  );
}
