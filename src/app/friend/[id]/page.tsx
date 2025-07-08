'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Expense = {
  id: string;
  title: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
};

type Friend = {
  id: number;
  username: string;
};

export default function FriendDetailPage() {
  const { id } = useParams();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
  const [friends, setFriends] = useState<Friend[]>([]);

  // loading と handleUnfriend の仮定義（必要に応じて実装してください）
  const loading = false;
  const handleUnfriend = (friendId: number) => {
    console.log(`Unfriend ${friendId}`);
  };

  // 支出データ取得
  useEffect(() => {
    const fetchExpenses = async () => {
      const access = localStorage.getItem('access');
      if (!access) {
        setMessage('ログインが必要です');
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/${id}/expenses/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        if (!res.ok) throw new Error('支出データ取得失敗');
        const data: Expense[] = await res.json();
        setExpenses(data);
      } catch (err: any) {
        setMessage(err.message);
      }
    };

    fetchExpenses();
  }, [id]);

  // フレンド一覧取得
  useEffect(() => {
    const fetchFriends = async () => {
      const access = localStorage.getItem('access');
      if (!access) {
        setMessage('ログインが必要です');
        return;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/`, {
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

  // 対象のフレンドをfriendsから取得（ID型の違いに注意）
  const currentFriend = friends.find((f) => String(f.id) === String(id));

  const totalAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const totalsByCategory = expenses
    .filter((e) => e.currency === 'JPY' || !e.currency)
    .reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

  const categories = Object.keys(totalsByCategory);
  const amounts = Object.values(totalsByCategory);
  const totalAmountForChart = amounts.reduce((a, b) => a + b, 0);

  const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  const pieSegments = (() => {
    const radius = 100;
    let cumulativePercent = 0;
    return amounts.map((value) => {
      const percent = value / totalAmountForChart;
      const startPercent = cumulativePercent;
      cumulativePercent += percent;

      const startX = radius + radius * Math.cos(2 * Math.PI * startPercent - Math.PI / 2);
      const startY = radius + radius * Math.sin(2 * Math.PI * startPercent - Math.PI / 2);
      const endX = radius + radius * Math.cos(2 * Math.PI * cumulativePercent - Math.PI / 2);
      const endY = radius + radius * Math.sin(2 * Math.PI * cumulativePercent - Math.PI / 2);
      const largeArcFlag = percent > 0.5 ? 1 : 0;

      return [
        `M ${radius} ${radius}`,
        `L ${startX} ${startY}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        'Z',
      ].join(' ');
    });
  })();

  const dailyData = (() => {
    const filtered = expenses.filter((e) => e.currency === 'JPY' || !e.currency);
    const grouped = filtered.reduce<Record<string, number>>((acc, e) => {
      acc[e.date] = (acc[e.date] || 0) + e.amount;
      return acc;
    }, {});
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, amount]) => ({ date, amount }));
  })();

  return (
    <div className="p-6 max-w-7xl mx-auto text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">
        {currentFriend ? `${currentFriend.username} の支出` : `フレンドID: ${id} の支出`}
      </h1>

      

      {message && <p className="text-red-500">{message}</p>}

      <div className="flex flex-col md:flex-row gap-8">
        {/* 左：合計 + 支出リスト */}
        <div className="flex-1">
          <div className="bg-green-700 text-white text-xl font-extrabold p-4 rounded text-right mb-6">
            合計: {totalAmount.toLocaleString()} 円
          </div>

          {expenses.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">支出はありません</p>
          ) : (
            <ul className="space-y-4">
              {expenses.map((e) => (
                <li key={e.id} className="border-b pb-2">
                  <p className="font-semibold">{e.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {e.category} / {e.date}
                  </p>
                  <p className="font-mono">
                    {Number(e.amount).toLocaleString()} {e.currency}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 右：グラフ */}
        <div className="w-full md:w-[400px]">
          <div className="flex justify-center space-x-4 mb-4">
            {(['bar', 'pie', 'line'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-4 py-2 rounded ${
                  chartType === type
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {type === 'bar' ? '棒グラフ' : type === 'pie' ? '円グラフ' : '折れ線グラフ'}
              </button>
            ))}
          </div>

          {categories.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">グラフデータがありません</p>
          ) : chartType === 'bar' ? (
            <div className="space-y-4">
              {categories.map((category, i) => {
                const amount = totalsByCategory[category];
                const maxAmount = Math.max(...amounts);
                const barWidth = maxAmount ? (amount / maxAmount) * 100 : 0;
                return (
                  <div key={category} className="flex items-center space-x-4">
                    <div className="w-24 font-medium capitalize">{category}</div>
                    <div className="flex-1 bg-gray-200 rounded h-6 overflow-hidden dark:bg-gray-700">
                      <div
                        className="h-6"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: colors[i % colors.length],
                        }}
                        title={`${amount.toLocaleString()} 円`}
                      />
                    </div>
                    <div className="w-20 text-right font-mono">
                      {amount.toLocaleString()} 円
                    </div>
                  </div>
                );
              })}
            </div>
          ) : chartType === 'pie' ? (
            <div className="flex flex-col items-center">
              <svg width="240" height="240" viewBox="0 0 200 200" className="mb-4">
                {pieSegments.map((d, i) => (
                  <path key={i} d={d} fill={colors[i % colors.length]} />
                ))}
                <circle cx={100} cy={100} r={60} fill="#fff" />
              </svg>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                {categories.map((category, i) => (
                  <li key={category} className="flex items-center space-x-2">
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: colors[i % colors.length] }}
                    />
                    <span>{category}</span>
                    <span className="ml-2 font-mono">
                      {totalsByCategory[category].toLocaleString()} 円
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="w-full">
              <svg viewBox="0 0 300 200" className="w-full h-[200px]">
                <polyline
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  points={dailyData
                    .map((item, index) => {
                      const x = (index / (dailyData.length - 1)) * 280 + 10;
                      const y =
                        180 - (item.amount / Math.max(...dailyData.map((d) => d.amount))) * 160;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />
              </svg>
              <div className="text-xs text-center mt-2 text-gray-600 dark:text-gray-400">
                {dailyData.map((d) => d.date).join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
