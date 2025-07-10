'use client';

import React, { useContext } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';

type Expense = {
  id: number;
  title: string;
  amount: number;
  date: string;
  category: string;
};

type Props = {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
};

const categories = [
  { id: 'food', label: '食費', emoji: '🍙' },
  { id: 'transport', label: '交通費', emoji: '🚃' },
  { id: 'entertainment', label: '娯楽', emoji: '🎮' },
  { id: 'other', label: 'その他', emoji: '📦' },
];

const categoryEmojiMap: Record<string, string> = categories.reduce((acc, cur) => {
  acc[cur.id] = cur.emoji;
  return acc;
}, {} as Record<string, string>);

export default function ExpenseList({ expenses, onEdit, onDelete }: Props) {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <ul
      role="list"
      className={`divide-y rounded-lg border ${
        darkMode ? 'divide-gray-700 border-gray-700' : 'divide-gray-100 border-gray-200'
      }`}
    >
      {expenses.map((expense) => (
        <li
          key={expense.id}
          className={`flex justify-between gap-x-6 px-4 py-4 transition ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex min-w-0 gap-x-4">
            {/* カテゴリーアイコン */}
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${
                darkMode ? 'bg-gray-600' : 'bg-gray-100'
              }`}
            >
              {categoryEmojiMap[expense.category] || '❓'}
            </div>

            <div className="min-w-0 flex-auto">
              <p className={`text-sm font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {expense.title}
              </p>
              <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                日付: {expense.date}
              </p>
            </div>
          </div>

          <div className="shrink-0 sm:flex sm:flex-col sm:items-end space-y-2">
            <p className="text-sm font-semibold text-green-600">
              ¥{expense.amount.toLocaleString()}
            </p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onEdit(expense)}
                className="text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                編集
              </button>
              <button
                onClick={() => onDelete(expense.id)}
                className="text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
              >
                削除
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
