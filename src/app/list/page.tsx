"use client";

import { useState, useEffect } from "react";
import ExpenseList from "../../components/ExpenseList";

type Expense = {
  id: number;
  title: string;
  amount: number;
  date: string;
  category:string;
};

export default function AddExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      fetch(`http://localhost:8000/api/expenses/?q=${search}`)
        .then((res) => res.json())
        .then((data) => setExpenses(data));
    }, 500); // ← 入力後500ms待つ
  
    return () => clearTimeout(delay); // タイマーをクリアして連打を防ぐ
  }, [search]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="タイトルで検索"
        className="w-full mb-4 px-4 py-2 border rounded-md"
      />

      <ExpenseList expenses={expenses} />
    </div>
  );
}
