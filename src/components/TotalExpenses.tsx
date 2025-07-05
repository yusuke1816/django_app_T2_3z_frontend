'use client';

import React, { useEffect, useState } from 'react';

type Expense = {
  id: string;
  title: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
};

type Props = {
  expenses: Expense[];
};

export default function MainPage({ expenses }: Props) {
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    fetch('http://localhost:8000/api/expenses/total-jpy/')
      .then(res => res.json())
      .then(data => {
        setTotalAmount(Number(data.totalAmount)); // サーバー側のkeyが "totalAmount" である前提
      })
      .catch(err => {
        console.error('❌ 合計取得エラー:', err);
      });
  }, []);

  return (
    <div className="bg-gray-50 py-12 sm:py-16 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-900">
       

        <div className="max-w-md rounded-lg bg-green-700 p-6 shadow-lg text-white">
          <p className="text-lg font-medium">JPY 合計金額</p>
          <p className="mt-2 text-5xl font-extrabold">
            {totalAmount.toLocaleString()} 円
          </p>
        </div>

        <ul className="mt-12 space-y-6 max-w-md">
          {expenses.map(exp => (
            <li key={exp.id} className="flex justify-between border-b border-gray-300 pb-2">
              <div>
                <p className="font-semibold">{exp.title}</p>
                <p className="text-sm text-gray-500">{exp.category} / {exp.date}</p>
              </div>
              <p className="font-mono">{Number(exp.amount).toLocaleString()} {exp.currency}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
