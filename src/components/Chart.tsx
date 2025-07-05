import React, { useState } from 'react';

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
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  // currency === 'JPY' の支出に絞ってカテゴリーごとの合計を計算
  const totalsByCategory = expenses
    .filter(exp => exp.currency === 'JPY' || !exp.currency) // currencyが無いものも含める
    .reduce<Record<string, number>>((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

  const categories = Object.keys(totalsByCategory);
  const amounts = Object.values(totalsByCategory);

  const totalAmount = amounts.reduce((a, b) => a + b, 0);

  function createPieSegments(data: number[]) {
    const radius = 120;
    let cumulativePercent = 0;
    return data.map((value) => {
      const percent = value / totalAmount;
      const startPercent = cumulativePercent;
      cumulativePercent += percent;

      const startX = radius + radius * Math.cos(2 * Math.PI * startPercent - Math.PI / 2);
      const startY = radius + radius * Math.sin(2 * Math.PI * startPercent - Math.PI / 2);
      const endX = radius + radius * Math.cos(2 * Math.PI * cumulativePercent - Math.PI / 2);
      const endY = radius + radius * Math.sin(2 * Math.PI * cumulativePercent - Math.PI / 2);
      const largeArcFlag = percent > 0.5 ? 1 : 0;

      const pathData = [
        `M ${radius} ${radius}`,
        `L ${startX} ${startY}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        'Z',
      ].join(' ');

      return pathData;
    });
  }

  const pieSegments = createPieSegments(amounts);

  const colors = [
    '#10B981', // 緑
    '#3B82F6', // 青
    '#F59E0B', // 黄
    '#EF4444', // 赤
    '#8B5CF6', // 紫
  ];

  return (
    <div className="max-w-xl mt-12">
      <div className="mb-6 space-x-4">
        <button
          className={`px-4 py-2 rounded ${
            chartType === 'bar' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setChartType('bar')}
        >
          棒グラフ
        </button>
        <button
          className={`px-4 py-2 rounded ${
            chartType === 'pie' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setChartType('pie')}
        >
          円グラフ
        </button>
      </div>

      {categories.length === 0 ? (
        <p>データがありません</p>
      ) : chartType === 'bar' ? (
        <div className="space-y-4">
          {categories.map((category, i) => {
            const amount = totalsByCategory[category];
            const maxAmount = Math.max(...amounts);
            const barWidth = maxAmount ? (amount / maxAmount) * 100 : 0;
            return (
              <div key={category} className="flex items-center space-x-4">
                <div className="w-24 font-medium text-gray-700 capitalize">{category}</div>
                <div className="flex-1 bg-gray-200 rounded h-6 overflow-hidden">
                  <div
                    className="h-6"
                    style={{ width: `${barWidth}%`, backgroundColor: colors[i % colors.length] }}
                    title={`${amount.toLocaleString()} 円`}
                  />
                </div>
                <div className="w-20 text-right font-mono text-gray-800">{amount.toLocaleString()} 円</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <svg width={300} height={300} viewBox="0 0 240 240" className="mb-4">
            {pieSegments.map((d, i) => (
              <path key={i} d={d} fill={colors[i % colors.length]} />
            ))}
            <circle cx={120} cy={120} r={75} fill="white" />
          </svg>
          <ul className="space-y-1 text-gray-700">
            {categories.map((category, i) => (
              <li key={category} className="flex items-center space-x-2 capitalize">
                <span
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: colors[i % colors.length] }}
                />
                <span>{category}</span>
                <span className="font-mono ml-2">{totalsByCategory[category].toLocaleString()} 円</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
