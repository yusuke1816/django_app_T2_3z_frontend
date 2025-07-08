'use client';

import React, { useEffect, useState } from 'react';

type FriendRequest = {
  id: number;
  from_user: {
    id: number;
    username: string;
  };
};

export default function FriendRequestsPage() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    const access = localStorage.getItem('access');
    if (!access) {
      setMessage('ログインが必要です');
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/requests/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      if (!res.ok) throw new Error('申請一覧の取得に失敗しました');
      const data: FriendRequest[] = await res.json();
      setRequests(data);
    } catch (err: any) {
      setMessage(err.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 承認・拒否API呼び出し
  const respondRequest = async (requestId: number, accept: boolean) => {
    const access = localStorage.getItem('access');
    if (!access) {
      setMessage('ログインが必要です');
      return;
    }
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/request/${requestId}/respond/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accept }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || '処理に失敗しました');
      }
      setMessage(accept ? '申請を承認しました' : '申請を拒否しました');
      // 処理が終わったらリスト更新
      fetchRequests();
    } catch (err: any) {
      setMessage(err.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-lg font-bold mb-4">フレンド申請一覧</h2>

      {loading && <p>読み込み中...</p>}
      {message && <p className="mb-4 text-sm text-red-500">{message}</p>}
      {requests.length === 0 && !loading && <p>申請はありません</p>}

      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {requests.map((req) => (
          <li key={req.id} className="flex justify-between items-center p-2 border border-gray-300 rounded dark:border-gray-600">
            <span className="text-gray-900 dark:text-gray-100">{req.from_user.username} さんからの申請</span>
            <div className="space-x-2">
              <button
                disabled={loading}
                onClick={() => respondRequest(req.id, true)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                承認
              </button>
              <button
                disabled={loading}
                onClick={() => respondRequest(req.id, false)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                拒否
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
