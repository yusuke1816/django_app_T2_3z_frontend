'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

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

  const [loading, setLoading] = useState(false);
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

    if (password !== confirmPassword) {
      toast.error('パスワードが一致しません');
      return;
    }

    const requestData = {
      username,
      email,
      password,
      confirm_password: confirmPassword,
    };

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error('サーバーからのHTMLエラーレスポンス:', text);
        toast.error('エラーが発生しました（詳細は開発者ツールで確認）');
        return;
      }

      if (response.ok) {
        toast.success(data.message || '登録に成功しました');
        router.push('/hello');
      } else {
        if (data.username) {
          toast.error(data.username[0]);
        } else if (data.email) {
          toast.error(data.email[0]);
        } else if (data.password) {
          toast.error(data.password[0]);
        } else {
          toast.error(data.detail || '登録に失敗しました');
        }
      }
    } catch (error) {
      console.error('通信エラー:', error);
      toast.error('通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="px-20 mt-15 mb-10" onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">サインアップ</h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            アカウントを作成するために情報を入力してください。あなたの許可なしに情報を共有することはありません。
          </p>
  
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                ユーザー名
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
  
            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                メールアドレス
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
  
            <div className="sm:col-span-4">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                パスワード
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
  
            <div className="sm:col-span-4">
              <label htmlFor="confirm-password" className="block text-sm/6 font-medium text-gray-900">
                パスワード（確認）
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
  
        <div className="pt-5">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex justify-center rounded-md py-2 px-3 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? '登録中...' : '登録'}
          </button>
        </div>
      </div>
    </form>
  );
  
}
