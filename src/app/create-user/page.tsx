'use client'

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next/navigation';

// フォームデータの型
interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpForm() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    // バリデーション
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // リクエストデータをJSON形式で準備
    const requestData = {
      username,
      email,
      password,
      confirm_password: confirmPassword,  // 変数名が異なる場合
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // JSONとして送信することを指定
        },
        body: JSON.stringify(requestData),  // requestDataをJSONに変換
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        router.push('/hello'); 
          // 成功メッセージ
      } else {
        const errorData = await response.json();
        if (errorData.username) {
          alert(errorData.username[0]);  // 例: "同じユーザー名が既に登録済みです。"
        } else if (errorData.email) {
          alert(errorData.email[0]);
        } else if (errorData.password) {
          alert(errorData.password[0]);
        } else {
          alert(errorData.detail || '登録に失敗しました');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error with the request');
    }
  };

  return (
    <form className="px-20 mt-15 mb-10" onSubmit={handleSubmit}>
      <div className="space-y-12">
        {/* Sign Up Section */}
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">Sign Up</h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Fill in your details to create an account. We will never share your information without your permission.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Username */}
            <div className="sm:col-span-4">
              <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="janesmith"
                  className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email Address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@domain.com"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="sm:col-span-4">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="********"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="sm:col-span-4">
              <label htmlFor="confirm-password" className="block text-sm/6 font-medium text-gray-900">
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="********"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-5">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </div>
      </div>
    </form>
  );
}
