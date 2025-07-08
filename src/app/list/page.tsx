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
};

export default function AddExpensePage() {
    
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);  // 追加：認証チェック＆データ取得待ち用
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
          setLoading(false); // データ取得完了でloadingをfalseに
        })
        .catch((err) => {
          console.error("❌ API エラー:", err);
          setExpenses([]);
          setLoading(false);
        });
    }, 500);

    return () => clearTimeout(delay);
  }, [search, router]);

  if (loading) {
    // 認証チェック＆データ取得中はローディングなど表示
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

      <ExpenseList expenses={expenses} />
    </div>
  );
}
