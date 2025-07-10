'use client';

import ExpenseForm from '../../components/ExpenseForm';

interface Expense {
  id: number;
  title: string;
  amount: string;
  currency: string;
  category: string;
  date: string;
  user_id: string;
}

export default function DeleteForm() {
  return (
    <>
      <ExpenseForm />
    </>
  );
}
