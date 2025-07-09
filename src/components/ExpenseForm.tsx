'use client';

import React, { useState, useRef, useEffect, useContext } from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { DarkModeContext } from '../../context/DarkModeContext';
import { useRouter } from 'next/navigation';

const categories = [
  { id: 'food', label: '食費', emoji: '🍙' },
  { id: 'transport', label: '交通費', emoji: '🚃' },
  { id: 'entertainment', label: '娯楽', emoji: '🎮' },
  { id: 'other', label: 'その他', emoji: '📦' },
];

export default function ExpenseForm() {
  const { darkMode } = useContext(DarkModeContext);
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    amount: '',
    currency: 'JPY',
    category: 'food',
    date: '',
    user_id: '',
  });

  const [username, setUsername] = useState<string | null>(null);
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  // 成功表示のための状態を追加
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const access = localStorage.getItem('access');
    if (!access) {
      setUsername(null);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
      .then(res => (res.ok ? res.json() : Promise.reject('認証エラー')))
      .then(data => {
        setUsername(data.username);
        setForm(prev => ({ ...prev, user_id: data.id }));
      })
      .catch(() => {
        setUsername(null);
      });

    const onClickOutside = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCategorySelect = (id: string) => {
    setForm(prev => ({ ...prev, category: id }));
    setCatOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = { ...form, amount: parseFloat(form.amount) };
    const token = localStorage.getItem('access');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expenses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error('送信に失敗しました: ' + errorText);
      }

      const contentType = res.headers.get('Content-Type');
      if (contentType?.includes('application/json')) {
        const data = await res.json();
        // 登録成功時に success を true に
        setSuccess(true);
      }

      setForm({
        title: '',
        amount: '',
        currency: 'JPY',
        category: 'food',
        date: '',
        user_id: form.user_id, // ユーザーIDはリセットしない
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  const selectedCategory = categories.find(c => c.id === form.category);
  return (
    <form
      onSubmit={handleSubmit}
      className={`relative max-w-md mx-auto p-6 rounded-md shadow-md space-y-6 mt-18 ${
        darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
      }`}
    >
      <h2 className="text-xl font-bold mb-4">支出を追加</h2>
      {success && (
        <div
          className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center rounded-md z-50 p-6 ${
            darkMode ? 'bg-gray-900 bg-opacity-90 text-green-200' : 'bg-white bg-opacity-90 text-green-800'
          }`}
        >
          <div className="max-w-sm w-full p-8 rounded-md shadow-lg bg-inherit">
            <div className="text-3xl mb-4">✅ 登録が完了しました！</div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                続けて入力する
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white font-semibold"
              >
                一覧へ戻る
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm font-medium">
        ユーザー名: <span className="font-semibold">{username ?? 'ログインしてください'}</span>
      </div>

      <div className="text-sm font-medium">
        ユーザーID: <span className="font-semibold">{form.user_id}</span>
      </div>

      {/* 内容 */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">内容</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className={`block w-full rounded-md border py-2 px-3 shadow-sm sm:text-sm focus:ring-2 focus:ring-green-500 focus:outline-none ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
        />
      </div>

      {/* 金額 + 通貨 */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium mb-1">金額</label>
        <div
          className={`flex items-center rounded-md border pl-3 py-2 shadow-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
          }`}
        >
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
            required
            className={`block min-w-0 grow py-1.5 pr-3 pl-1 text-base placeholder:text-gray-400 focus:outline-none ${
              darkMode ? 'bg-gray-700 text-gray-100' : 'text-gray-900'
            }`}
          />
          <div className="relative">
            <select
              id="currency"
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className={`appearance-none rounded-md bg-transparent py-1 pr-7 pl-3 focus:outline-none sm:text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}
            >
              <option value="JPY">JPY</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            <ChevronDownIcon
              aria-hidden="true"
              className={`pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 h-5 w-5 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* カテゴリー */}
      <div className="relative" ref={catRef}>
        <label className="block text-sm font-medium mb-1">カテゴリ</label>
        <button
          type="button"
          onClick={() => setCatOpen(prev => !prev)}
          className={`flex w-full items-center justify-between rounded-md border py-2 px-3 text-left shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-gray-100'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-xl">{selectedCategory?.emoji}</span>
            <span>{selectedCategory?.label}</span>
          </span>
          <ChevronDownIcon className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </button>

        {catOpen && (
          <ul
            role="listbox"
            tabIndex={-1}
            className={`absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md border shadow-lg focus:outline-none sm:text-sm ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
          >
            {categories.map(cat => (
              <li
                key={cat.id}
                role="option"
                aria-selected={cat.id === form.category}
                onClick={() => handleCategorySelect(cat.id)}
                className={`cursor-pointer select-none py-2 px-3 ${
                  cat.id === form.category
                    ? 'bg-green-600 text-white'
                    : darkMode
                    ? 'text-gray-100 hover:bg-gray-600'
                    : 'text-gray-900 hover:bg-green-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 日付 */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium mb-1">日付</label>
        <input
          id="date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          className={`block w-full rounded-md border py-2 px-3 shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
        />
      </div>

      {/* 送信 */}
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
      >
        登録する
      </button>
    </form>
  );
}
