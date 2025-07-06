'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import TotalExpenses from "../components/TotalExpenses";
import ExpenseChart from "../components/Chart";

export default function AddExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);  // 認証チェック・データ取得の完了待ち用
  const router = useRouter();

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
      });
  }, [router]);

  if (loading) {
    // 認証チェック or データ取得中は何も表示しない or ローディング表示
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 px-4 flex justify-center">
      <div className="w-full max-w-4xl py-1">
        <h1 className="text-5xl font-extrabold mt-14 mb-1 text-center text-gray-900">
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
