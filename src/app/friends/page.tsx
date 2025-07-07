'use client'

import Link from 'next/link';
import React, { useState, useEffect } from 'react';

type Friend = {
  id: number;
  username: string;
};

export default function FriendList() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      const access = localStorage.getItem('access');
      if (!access) {
        setMessage('ログインが必要です');
        return;
      }
      try {
        const res = await fetch('http://localhost:8000/api/friends/', {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        if (!res.ok) throw new Error('フレンド一覧の取得に失敗しました');
        const data: Friend[] = await res.json();
        setFriends(data);
      } catch (err: any) {
        setMessage(err.message || 'エラーが発生しました');
      }
    };
    fetchFriends();
  }, []);

  const handleUnfriend = async (friendId: number) => {
    const access = localStorage.getItem('access');
    if (!access) {
      setMessage('ログインが必要です');
      return;
    }
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`http://localhost:8000/api/friends/${friendId}/remove/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || '解除に失敗しました');
      }
      setFriends((prev) => prev.filter((f) => f.id !== friendId));
      setMessage('フレンドを解除しました');
    } catch (err: any) {
      setMessage(err.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 min-h-screen text-gray-900 dark:text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg">
          <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">フレンド一覧</h2>

          {message && (
            <p className="mb-4 text-sm text-red-500 dark:text-red-400">{message}</p>
          )}

          {friends.length === 0 && !message && (
            <p className="text-gray-700 dark:text-gray-300">フレンドがいません</p>
          )}

          <ul className="space-y-3 max-h-60 overflow-y-auto mb-6">
            {friends.map((friend) => (
              <li
                key={friend.id}
                className="flex justify-between items-center p-3 border border-gray-300 rounded dark:border-gray-600"
              >
                <Link
                  href={`/friend/${friend.id}`}
                  className="text-blue-600 hover:underline disabled:opacity-50"
                >
                  {friend.username}
                </Link>
                <button
                  disabled={loading}
                  onClick={() => handleUnfriend(friend.id)}
                  className="text-red-600 hover:underline disabled:opacity-50"
                >
                  解除
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
