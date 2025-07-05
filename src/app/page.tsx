'use client';

import { useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import TotalExpenses from "../components/TotalExpenses";
import ExpenseChart from "../components/Chart";

export default function AddExpensePage() {
  const [expenses, setExpenses] = useState([]);
  

  useEffect(() => {
    console.log("🔍 useEffect 実行された");
  
    fetch("http://localhost:8000/api/expenses/")
      .then((res) => {
        console.log("🌐 fetch レスポンス:", res);
        if (!res.ok) throw new Error("Failed to fetch expenses");
        return res.json();
      })
      .then((data) => {
        // amount を number に変換する
        const normalized = data.map((item:any) => ({
          ...item,
          amount: parseFloat(item.amount),
        }));
        console.log("✅ 正常化後のデータ:", normalized);
        setExpenses(normalized);
      })
      .catch((error) => {
        console.error("❌ fetch エラー:", error);
        setExpenses([]);
      });
  }, []);
  
  
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-5xl font-extrabold mb-12 text-center text-gray-900">
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
