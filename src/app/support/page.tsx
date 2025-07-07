'use client';

import React, { useState, useContext } from 'react';
import { DarkModeContext } from '../../../context/DarkModeContext';

export default function ContactForm() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API送信などの処理
    setSubmitted(true);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen">
      <button
        onClick={toggleDarkMode}
        className="mb-6 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      >
        {darkMode ? 'ライトモードに切替' : 'ダークモードに切替'}
      </button>

      <h2 className="text-3xl font-bold mb-6">お問い合わせ</h2>

      {submitted && (
        <div className="rounded-md bg-green-50 dark:bg-green-900 p-4 mb-6">
          <p className="text-sm font-medium text-green-800 dark:text-green-300">
            送信が完了しました。ありがとうございます！
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            お名前
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="山田 太郎"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            メールアドレス
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="example@example.com"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            メッセージ
          </label>
          <textarea
            name="message"
            id="message"
            rows={4}
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="ご質問・ご要望をご記入ください"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            送信
          </button>
        </div>
      </form>
    </div>
  );
}
