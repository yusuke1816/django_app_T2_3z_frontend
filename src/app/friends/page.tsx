'use client';

import React, { useEffect, useState } from 'react';

type Friend = {
  id: number;
  username: string;
  email: string;
};

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      setError('ログインしてください');
      setLoading(false);
      return;
    }

    fetch('http://localhost:8000/api/friends/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('友達情報の取得に失敗しました');
        return res.json();
      })
      .then(data => {
        setFriends(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">読み込み中...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Friends</h1>
      <ul className="max-w-3xl mx-auto space-y-4">
        {friends.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">友達がいません</p>
        ) : (
          friends.map(friend => (
            <li
              key={friend.id}
              className="p-4 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow"
            >
              <h2 className="text-2xl font-semibold">{friend.username}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{friend.email}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
