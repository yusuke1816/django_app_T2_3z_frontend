'use client';

import { useState, useContext } from 'react';
import { DarkModeContext } from '../../../context/DarkModeContext';

export default function LoginPage() {
  const { darkMode } = useContext(DarkModeContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const contentType = res.headers.get('Content-Type');

      if (!res.ok) {
        // エラーの内容をJSONでパースできるか確認
        if (contentType?.includes('application/json')) {
          const errorData = await res.json();
          console.error('エラー内容:', errorData);
          throw new Error(errorData.detail || 'ログインに失敗しました');
        } else {
          const errorText = await res.text();
          console.error('HTMLエラー:', errorText);
          throw new Error('サーバーに接続できませんでした。しばらくしてからお試しください。');
        }
      }

      const data = await res.json();
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      window.location.href = '/';
    } catch (err: any) {
      console.error('ログイン失敗:', err);
      setError('ユーザー名またはパスワードが正しくありません');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`max-w-md mx-auto mt-10 p-6 rounded-md shadow-md ${
        darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'
      }`}
    >
      <h1 className="text-2xl font-bold mb-4">ログイン</h1>

      {error && (
        <div
          role="alert"
          className={`
            mb-4 flex items-center gap-2 rounded-md px-4 py-3 text-sm font-medium shadow-md
            ${
              darkMode
                ? 'bg-red-800 text-red-200 ring-1 ring-red-500'
                : 'bg-red-100 text-red-700 ring-1 ring-red-400'
            }
            animate-fadeIn
          `}
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"
            />
          </svg>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            ユーザー名
          </label>
          <input
            id="username"
            type="text"
            className={`mt-1 block w-full rounded px-3 py-2 text-sm border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-200 focus:border-green-500 focus:ring-green-500'
                : 'bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:border-green-600 focus:ring-green-600'
            }`}
            placeholder="ユーザー名を入力"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            className={`mt-1 block w-full rounded px-3 py-2 text-sm border ${
              darkMode
                ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-200 focus:border-green-500 focus:ring-green-500'
                : 'bg-white border-gray-300 placeholder-gray-500 text-gray-900 focus:border-green-600 focus:ring-green-600'
            }`}
            placeholder="パスワードを入力"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
    </main>
  );
}
