'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

const categories = [
  { id: 'food', label: '食費', emoji: '🍙' },
  { id: 'transport', label: '交通費', emoji: '🚃' },
  { id: 'entertainment', label: '娯楽', emoji: '🎮' },
  { id: 'other', label: 'その他', emoji: '📦' },
];

export default function ExpenseForm() {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    currency: 'JPY',
    category: 'food',
    date: '',
    user_id: '', // ユーザーIDをフォームに追加
  });

  const [username, setUsername] = useState<string | null>(null); // 追加

  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const access = localStorage.getItem('access'); // トークン取得

    if (!access) {
      setUsername(null);
      return;
    }

    fetch('http://localhost:8000/api/users/me/', {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
      .then(res => (res.ok ? res.json() : Promise.reject('認証エラー')))
      .then(data => {
        setUsername(data.username);
        setForm(prev => ({ ...prev, user_id: data.id })); // APIのユーザーIDをフォームにセット
      })
      .catch(() => {
        setUsername(null);
      });

    // カテゴリドロップダウンの外クリック検知
    const onClickOutside = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);

    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []); // 初回レンダリング時のみ実行

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
    const token = localStorage.getItem('access'); // JWT トークン取得

    try {
      const res = await fetch('http://localhost:8000/api/expenses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // 認証情報を追加
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('サーバーエラー:', errorText);
        throw new Error('送信に失敗しました');
      }

      const contentType = res.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        alert(`登録成功: ${JSON.stringify(data)}`);
      } else {
        const errorText = await res.text();
        alert(`サーバーからの応答がJSONではありません: ${errorText}`);
      }

      setForm({
        title: '',
        amount: '',
        currency: 'JPY',
        category: 'food',
        date: '',
        user_id: '',
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  const selectedCategory = categories.find(c => c.id === form.category);

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md space-y-6 mt-18">
      <h2 className="text-xl font-bold text-gray-800 mb-4">支出を追加</h2>

      {/* ユーザー名表示 */}
      <div className="text-sm font-medium text-gray-700">
        <p>ユーザー名: <span className="font-semibold">{username ?? 'ログインしてください'}</span></p>
      </div>

      {/* ユーザーIDの表示 */}
      <div className="text-sm font-medium text-gray-700">
        <p>ユーザーID: <span className="font-semibold">{form.user_id}</span></p>
      </div>
      {/* 内容 */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          内容
        </label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm"
        />
      </div>

      {/* 金額 + 通貨 */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          金額
        </label>
        <div className="flex items-center rounded-md border border-gray-300 bg-white pl-3 py-2 shadow-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
            required
            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none
              [&::-webkit-inner-spin-button]:appearance-none
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-moz-appearance]:textfield
            "
          />
          <div className="relative">
            <select
              id="currency"
              name="currency"
              aria-label="Currency"
              value={form.currency}
              onChange={handleChange}
              className="appearance-none rounded-md bg-transparent py-1 pr-7 pl-3 text-gray-500 focus:outline-none sm:text-sm"
            >
              <option value="JPY">JPY</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 h-5 w-5 text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* カテゴリー */}
      <div className="relative" ref={catRef}>
        <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
        <button
          type="button"
          onClick={() => setCatOpen(open => !open)}
          aria-haspopup="listbox"
          aria-expanded={catOpen}
          className="flex w-full cursor-pointer items-center justify-between rounded-md border border-gray-300 bg-white py-2 px-3 text-left text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
        >
          <span className="flex items-center gap-2">
            <span className="text-xl">{selectedCategory?.emoji}</span>
            <span>{selectedCategory?.label}</span>
          </span>
          <ChevronDownIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
        </button>

        {catOpen && (
          <ul
            role="listbox"
            tabIndex={-1}
            className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg focus:outline-none sm:text-sm"
          >
            {categories.map(cat => (
              <li
                key={cat.id}
                role="option"
                aria-selected={cat.id === form.category}
                className={`cursor-pointer select-none py-2 px-3 ${
                  cat.id === form.category ? 'bg-green-600 text-white' : 'text-gray-900 hover:bg-green-100'
                }`}
                onClick={() => handleCategorySelect(cat.id)}
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
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          日付
        </label>
        <input
          id="date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 shadow-sm placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm"
        />
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
      >
        登録する
      </button>
    </form>
  );
}
