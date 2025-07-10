'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ExpenseList from "../../components/ExpenseList";

type Expense = {
  id: number;
  title: string;
  amount: number;
  date: string;
  category: string;
  currency?: string;
};

export default function AddExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const router = useRouter();

  useEffect(() => {
    const access = localStorage.getItem("access");

    if (!access) {
      router.push("/hello");
      return;
    }

    const delay = setTimeout(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expenses/?q=${search}`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("データ取得に失敗しました");
          return res.json();
        })
        .then((data) => {
          setExpenses(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ API エラー:", err);
          setExpenses([]);
          setLoading(false);
        });
    }, 500);

    return () => clearTimeout(delay);
  }, [search, router]);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("access");
    if (!token) return;
    if (!confirm("本当に削除しますか？")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expenses/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // ← 修正
        },
      });

      if (!res.ok) throw new Error("削除に失敗しました");

      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="タイトルで検索"
        className="w-full mb-4 px-4 py-2 border rounded-md"
      />

      <ExpenseList
        expenses={expenses}
        onEdit={(expense) => setSelectedExpense(expense)}
        onDelete={(id) => handleDelete(id)}
      />
    </div>
  );
}
