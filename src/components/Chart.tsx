'use client';

import React, { useState, useContext } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';
import { parseISO, format } from 'date-fns';

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

export default function ExpenseChart({ expenses }: Props) {
  const { darkMode } = useContext(DarkModeContext);
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');

  const totalsByCategory = expenses
    .filter(exp => exp.currency === 'JPY' || !exp.currency)
    .reduce<Record<string, number>>((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

  const categories = Object.keys(totalsByCategory);
  const amounts = Object.values(totalsByCategory);
  const totalAmount = amounts.reduce((a, b) => a + b, 0);

  const pieSegments = (() => {
    const radius = 120;
    let cumulativePercent = 0;
    return amounts.map((value) => {
      const percent = value / totalAmount;
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

  // 折れ線用: 日付＋カテゴリで集計
  const categorySeries: Record<string, Record<string, number>> = {};
  expenses.forEach((exp) => {
    if (exp.currency !== 'JPY' && exp.currency) return;
    const dateStr = format(parseISO(exp.date), 'yyyy-MM-dd');
    if (!categorySeries[exp.category]) categorySeries[exp.category] = {};
    categorySeries[exp.category][dateStr] = (categorySeries[exp.category][dateStr] || 0) + exp.amount;
  });

  const allDates = Array.from(
    new Set(expenses.map((exp) => format(parseISO(exp.date), 'yyyy-MM-dd')))
  ).sort();

  const maxY = Math.max(
    ...Object.values(categorySeries).flatMap((series) => Object.values(series))
  );

  const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];
  const textColor = darkMode ? 'text-white' : 'text-gray-700';
  const textColorDark = darkMode ? 'text-gray-300' : 'text-gray-800';
  const bgColorBtnActive = 'bg-green-600 text-white';
  const bgColorBtnInactive = darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700';

  return (
    <div className={`max-w-xl w-full mt-12 ${darkMode ? 'bg-gray-900 p-4 rounded' : ''}`}>
      <div className="mb-6 space-x-4 text-center">
        {['bar', 'pie', 'line'].map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded ${
              chartType === type ? bgColorBtnActive : bgColorBtnInactive
            }`}
            onClick={() => setChartType(type as any)}
          >
            {type === 'bar' ? '棒グラフ' : type === 'pie' ? '円グラフ' : '折れ線グラフ'}
          </button>
        ))}
      </div>

      {categories.length === 0 ? (
        <p className={`${textColor}`}>データがありません</p>
      ) : chartType === 'bar' ? (
        <div className="space-y-4 w-full">
          {categories.map((category, i) => {
            const amount = totalsByCategory[category];
            const maxAmount = Math.max(...amounts);
            const barWidth = maxAmount ? (amount / maxAmount) * 100 : 0;
            return (
              <div key={category} className="flex items-center space-x-4 w-full">
                <div className={`w-24 font-medium capitalize ${textColorDark}`}>{category}</div>
                <div className="flex-1 bg-gray-200 rounded h-6 overflow-hidden dark:bg-gray-700">
                  <div
                    className="h-6"
                    style={{ width: `${barWidth}%`, backgroundColor: colors[i % colors.length] }}
                    title={`${amount.toLocaleString()} 円`}
                  />
                </div>
                <div className={`w-20 text-right font-mono ${textColorDark}`}>
                  {amount.toLocaleString()} 円
                </div>
              </div>
            );
          })}
        </div>
      ) : chartType === 'pie' ? (
        <div className="flex flex-col items-center w-full">
          <svg
            width="100%"
            height="300"
            viewBox="0 0 240 240"
            className="mb-4 max-w-xs"
            preserveAspectRatio="xMidYMid meet"
          >
            {pieSegments.map((d, i) => (
              <path key={i} d={d} fill={colors[i % colors.length]} />
            ))}
            <circle cx={120} cy={120} r={75} fill={darkMode ? '#111827' : 'white'} />
          </svg>
          <ul className={`space-y-1 ${textColorDark}`}>
            {categories.map((category, i) => (
              <li key={category} className="flex items-center space-x-2 capitalize">
                <span
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: colors[i % colors.length] }}
                />
                <span>{category}</span>
                <span className="font-mono ml-2">
                  {totalsByCategory[category].toLocaleString()} 円
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <svg
            className="rounded shadow mx-auto"
            viewBox="0 0 400 200"
            preserveAspectRatio="xMidYMid meet"
            width="100%"
            height="200"
          >
            {Object.entries(categorySeries).map(([category, series], catIdx) => {
              const points = allDates.map((date, i) => {
                const x = (i / (allDates.length - 1)) * 380 + 10;
                const y = 180 - ((series[date] || 0) / maxY) * 160;
                return `${x},${y}`;
              });

              return (
                <g key={category}>
                  <polyline
                    fill="none"
                    stroke={colors[catIdx % colors.length]}
                    strokeWidth="2"
                    points={points.join(' ')}
                  />
                  {points.map((point, i) => {
                    const [x, y] = point.split(',');
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={3}
                        fill={colors[catIdx % colors.length]}
                      />
                    );
                  })}
                </g>
              );
            })}
          </svg>

          <ul className={`mt-4 flex justify-around flex-wrap gap-4 ${textColorDark}`}>
            {Object.keys(categorySeries).map((category, i) => (
              <li key={category} className="flex items-center gap-2 capitalize">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: colors[i % colors.length] }}
                />
                <span>{category}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
