'use client';

import React, { useEffect, useState } from 'react';

type Expense = {
    id: string;
    title: string;
    amount: number;
    currency?: string;  // ? をつけて optional にする
    category: string;
    date: string;
  };
  

type Props = {
  expenses: Expense[];
};

export default function MainPage({ expenses }: Props) {
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem('access'); // トークン取得
    if (!token) {
      console.warn("トークンなし: ログインしてください");
      return;
    }

    fetch('http://localhost:8000/api/expenses/total-jpy/', {
      headers: {
        Authorization: `Bearer ${token}`, // 🔥 認証追加
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("取得失敗");
        return res.json();
      })
      .then(data => {
        console.log("APIレスポンス totalAmount:", data.totalAmount);
        setTotalAmount(Number(data.totalAmount));
      })
      
      .catch(err => {
        console.error('❌ 合計取得エラー:', err);
      });
  }, []);

  return (
    <div className="py-15 sm:py-16 min-h-screen text-gray-900 dark:text-white">
  <div className="mx-auto max-w-7xl px-6 lg:px-8">

    <div className="max-w-md rounded-lg bg-green-700 p-6 shadow-lg text-white">
      <p className="text-lg font-medium">JPY 合計金額</p>
      <p className="mt-2 text-5xl font-extrabold">
        {totalAmount.toLocaleString()} 円
      </p>
    </div>

    <ul className="mt-12 space-y-6 max-w-md">
      {expenses.map(exp => (
        <li
          key={exp.id}
          className="flex justify-between border-b border-gray-300 pb-2
                     dark:border-gray-600"
        >
          <div>
            <p className="font-semibold">{exp.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {exp.category} / {exp.date}
            </p>
          </div>
          <p className="font-mono">{Number(exp.amount).toLocaleString()} {exp.currency}</p>
        </li>
      ))}
    </ul>
  </div>
</div>

  );
}
