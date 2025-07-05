'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotification, setEmailNotification] = useState(true);
  const [language, setLanguage] = useState('ja');

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">設定</h1>
      <p className="text-gray-700 mb-8">
        ここではアプリの設定を変更できます。
      </p>

      {/* テーマ設定 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">テーマ設定</h2>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="form-checkbox"
          />
          ダークモードを有効にする
        </label>
        <p className="mt-2 text-sm text-gray-500">
          現在のモード: {darkMode ? 'ダークモード' : 'ライトモード'}
        </p>
      </section>

      {/* 通知設定 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">通知設定</h2>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={emailNotification}
            onChange={() => setEmailNotification(!emailNotification)}
            className="form-checkbox"
          />
          メール通知を受け取る
        </label>
        <p className="mt-2 text-sm text-gray-500">
          {emailNotification ? 'メール通知が有効です。' : 'メール通知は無効です。'}
        </p>
      </section>

      {/* 言語選択 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">言語設定</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="ja">日本語</option>
          <option value="en">English</option>
          <option value="zh">中文</option>
          <option value="ko">한국어</option>
        </select>
        <p className="mt-2 text-sm text-gray-500">
          選択中の言語: {language === 'ja' ? '日本語' : language === 'en' ? 'English' : language === 'zh' ? '中文' : '한국어'}
        </p>
      </section>
    </main>
  );
}
