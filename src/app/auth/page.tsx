'use client';

import { useState, useContext } from 'react';
import { DarkModeContext } from '../../../context/DarkModeContext';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

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
      const res = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'ログインに失敗しました');
      }

      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);

      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました');
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
        <p
          className={`mb-4 text-sm p-2 rounded ${
            darkMode ? 'bg-red-700 text-red-200' : 'bg-red-100 text-red-600'
          }`}
        >
          {error}
        </p>
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
