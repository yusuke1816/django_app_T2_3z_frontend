'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import TotalExpenses from "../components/TotalExpenses";
import ExpenseChart from "../components/Chart";

export default function AddExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const access = localStorage.getItem('access');
    if (!access) {
      router.push("/hello");
      return;
    }

    fetch("http://localhost:8000/api/expenses/", {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch expenses");
        return res.json();
      })
      .then((data) => {
        const normalized = data.map((item: any) => ({
          ...item,
          amount: parseFloat(item.amount),
        }));
        setExpenses(normalized);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ fetch エラー:", error);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setExpenses([]);
        setLoading(false);
        router.push('/hello');
      });
  }, [router]);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
      setDarkMode(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      
      {/* サイドメニュー */}
      <aside className="w-64 bg-white dark:bg-gray-700 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-300 dark:border-gray-600">
          メニュー
        </h2>
        <nav className="flex flex-col space-y-3 mt-4">
  <Link href="/teams" className="hover:underline">my teams</Link>
  <Link href="/friends" className="hover:underline">frends</Link>
</nav>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 px-8 py-12">
        <h1 className="text-5xl font-extrabold mb-8 text-center">支出の合計</h1>
        <div className="flex flex-col md:flex-row md:space-x-30 space-y-6 md:space-y-0">
          <div className="w-full md:w-1/2">
            <TotalExpenses expenses={expenses} />
          </div>
          <div className="w-full md:w-1/2 mt-4 md:mt-0">
            <ExpenseChart expenses={expenses} />
          </div>
        </div>
      </main>
    </div>
  );
}
