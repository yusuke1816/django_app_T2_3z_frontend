'use client';

import React, { useState } from 'react';

type User = {
  id: number;
  username: string;
};

export default function AddFriendForm() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ユーザー検索API呼び出し
  const handleSearch = async () => {
    if (!query.trim()) {
      setMessage('ユーザー名を入力してください');
      return;
    }

    setLoading(true);
    setMessage(null);

    const access = localStorage.getItem('access');
    if (!access) {
      setMessage('ログインが必要です');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/search/?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      if (!res.ok) throw new Error('ユーザー検索に失敗しました');
      const data: User[] = await res.json();
      setResults(data);
      if (data.length === 0) setMessage('該当ユーザーが見つかりません');
    } catch (err: any) {
      setMessage(err.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // フレンド申請送信API呼び出し
  const sendFriendRequest = async (userId: number) => {
    const access = localStorage.getItem('access');
    if (!access) {
      setMessage('ログインが必要です');
      return;
    }
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/request/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to_user_id: userId }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'フレンド申請送信に失敗しました');
      }
      setMessage('フレンド申請を送りました！');
    } catch (err: any) {
      setMessage(err.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-lg font-bold mb-4">フレンドを追加する</h2>

      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="ユーザー名で検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
          disabled={loading}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          検索
        </button>
      </div>

      {message && <p className="mb-4 text-sm text-red-500">{message}</p>}

      <ul className="space-y-2 max-h-48 overflow-y-auto">
        {results.map((user) => (
          <li key={user.id} className="flex justify-between items-center p-2 border border-gray-300 rounded dark:border-gray-600">
            <span className="text-gray-900 dark:text-gray-100">{user.username}</span>
            <button
              onClick={() => sendFriendRequest(user.id)}
              disabled={loading}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              申請送信
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
