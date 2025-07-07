'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import TotalExpenses from "../components/TotalExpenses";
import ExpenseChart from "../components/Chart";

export default function AddExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // ダークモード状態の復元
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

  // 認証チェックと支出データ取得
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
        setExpenses([]);
        setLoading(false);
        router.push('/hello');
      });
  }, [router]);

  // ダークモード切替トグル（例）
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
    <div className="bg-gray-50 dark:bg-gray-900 px-4 flex justify-center min-h-screen text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-4xl py-1">
        

        <h1 className="text-5xl font-extrabold mt-14 mb-1 text-center">
          支出の合計
        </h1>
        <div className="flex flex-col md:flex-row md:space-x-30 space-y-6 md:space-y-0">
          <div className="w-full md:w-1/2">
            <TotalExpenses expenses={expenses} />
          </div>
          <div className="w-full md:w-1/2 mt-4">
            <ExpenseChart expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
}
