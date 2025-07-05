'use client';

import React from 'react';

type Expense = {
  id: number;
  title: string;
  amount: number;
  date: string;
  category: string;
};

type Props = {
  expenses: Expense[];
};

// フォームと同じカテゴリ一覧
const categories = [
  { id: 'food', label: '食費', emoji: '🍙' },
  { id: 'transport', label: '交通費', emoji: '🚃' },
  { id: 'entertainment', label: '娯楽', emoji: '🎮' },
  { id: 'other', label: 'その他', emoji: '📦' },
];

// id→emoji変換用マップ
const categoryEmojiMap: Record<string, string> = categories.reduce((acc, cur) => {
  acc[cur.id] = cur.emoji;
  return acc;
}, {} as Record<string, string>);

export default function ExpenseList({ expenses }: Props) {
  return (
    <ul role="list" className="divide-y divide-gray-100 border border-gray-200 rounded-lg">
      {expenses.map((expense) => (
        <li
          key={expense.id}
          className="flex justify-between gap-x-6 px-4 py-4 hover:bg-gray-50 transition"
        >
          <div className="flex min-w-0 gap-x-4">
            {/* カテゴリーアイコン（emoji） */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl">
              {categoryEmojiMap[expense.category] || '❓'}
            </div>

            {/* タイトルと日付 */}
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold text-gray-900">{expense.title}</p>
              <p className="mt-1 text-xs text-gray-500">日付: {expense.date}</p>
            </div>
          </div>

          {/* 金額 */}
          <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
            <p className="text-sm font-semibold text-green-600">
              ¥{expense.amount.toLocaleString()}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
