'use client';

import React from 'react';

export default function MyTeamsPage() {
  // ここでは仮にチームデータの配列を用意（実際はAPIなどから取得）
  const teams = [
    { id: 1, name: 'Team Alpha' },
    { id: 2, name: 'Team Beta' },
    { id: 3, name: 'Team Gamma' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">My Teams</h1>
      <ul className="max-w-3xl mx-auto space-y-4">
        {teams.map((team) => (
          <li
            key={team.id}
            className="p-4 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-semibold">{team.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              チームの説明やメンバー情報などをここに表示できます。
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
