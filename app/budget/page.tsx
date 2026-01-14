'use client';

import { useEffect, useState } from 'react';

export default function BudgetPage() {
  /** ===== 模拟登录用户（后续可替换为 Supabase user.id） ===== */
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');

  /** ===== 基础数据 ===== */
  const income = 5000;

  const categories = [
    { key: 'food', label: '🍚 餐饮' },
    { key: 'transport', label: '🚇 出行' },
    { key: 'entertainment', label: '🎮 娱乐' },
    { key: 'shopping', label: '🛍 购物' },
    { key: 'health', label: '💊 健康' },
    { key: 'utilities', label: '💡 日常账单' },
  ];

  const [percentages] = useState({
    food: 30,
    transport: 20,
    entertainment: 10,
    shopping: 5,
    health: 5,
    utilities: 5,
  });

  const [expenses, setExpenses] = useState<Record<string, number>>({});

  /** ===== AI 记账状态 ===== */
  const [description, setDescription] = useState('');
  const [aiCategory, setAiCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [isCorrecting, setIsCorrecting] = useState(false);

  /** ===== 本地持久化（模拟云端） ===== */
  useEffect(() => {
    const savedUser = localStorage.getItem('user_email');
    if (savedUser) {
      setUserEmail(savedUser);
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      const saved = localStorage.getItem(`expenses_${userEmail}`);
      if (saved) {
        setExpenses(JSON.parse(saved));
      }
    }
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem(`expenses_${userEmail}`, JSON.stringify(expenses));
    }
  }, [expenses, userEmail]);

  /** ===== 登录 ===== */
  const handleLogin = () => {
    if (!emailInput) return;
    localStorage.setItem('user_email', emailInput);
    setUserEmail(emailInput);
  };

  /** ===== AI 猜分类（占位，后续换大模型） ===== */
  const guessCategoryByText = (text: string) => {
    if (text.includes('麦') || text.includes('吃') || text.includes('饭')) return 'food';
    if (text.includes('滴滴') || text.includes('地铁')) return 'transport';
    if (text.includes('电影') || text.includes('游戏')) return 'entertainment';
    return null;
  };

  /** ===== 添加花销 ===== */
  const handleAddExpense = () => {
    if (!aiCategory || !amount) return;

    setExpenses(prev => ({
      ...prev,
      [aiCategory]: (prev[aiCategory] || 0) + Number(amount),
    }));

    setDescription('');
    setAmount('');
    setAiCategory(null);
    setIsCorrecting(false);
  };

  /** ===== 未登录界面 ===== */
  if (!userEmail) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-300 to-pink-300">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-center">💗 欢迎你，亲爱的</h1>
          <p className="text-sm text-gray-600 text-center">
            输入邮箱即可开始内测（暂不发送邮件）
          </p>
          <input
            type="email"
            value={emailInput}
            onChange={e => setEmailInput(e.target.value)}
            placeholder="你的邮箱"
            className="border rounded px-4 py-2 w-full"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-teal-600 text-white py-2 rounded-lg"
          >
            进入我的财务空间 💕
          </button>
        </div>
      </main>
    );
  }

  /** ===== 已登录主界面 ===== */
  return (
    <main className="min-h-screen bg-gradient-to-r from-teal-300 via-purple-300 to-pink-300 flex justify-center py-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg space-y-6">
        <p className="text-sm text-gray-500 text-center">
          👋 你好，{userEmail}
        </p>

        <h1 className="text-2xl font-bold text-center text-purple-700">
          本月财务小管家
        </h1>

        {/* ===== AI 对话式输入区 ===== */}
        <div>
          <input
            type="text"
            value={description}
            onChange={e => {
              const text = e.target.value;
              setDescription(text);
              setAiCategory(guessCategoryByText(text));
            }}
            placeholder="跟我说你花了什么～"
            className="border rounded px-4 py-2 w-full mb-2"
          />

          <p className="text-sm text-gray-600 mb-2">
            🤖 我猜你这是：
            <strong className="ml-1">
              {categories.find(c => c.key === aiCategory)?.label || '还没想清楚'}
            </strong>
          </p>

          {aiCategory && !isCorrecting && (
            <div className="flex gap-2 mb-3">
              <button
                onClick={handleAddExpense}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg"
              >
                ✅ 对的
              </button>

              <button
                onClick={() => setIsCorrecting(true)}
                className="border px-4 py-2 rounded-lg"
              >
                ✏️ 不对，我改一下
              </button>
            </div>
          )}

          {isCorrecting && (
            <div className="grid grid-cols-3 gap-3 mb-3">
              {categories.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => {
                    setAiCategory(cat.key);
                    setIsCorrecting(false);
                  }}
                  className="border rounded-lg px-3 py-2 text-sm"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {aiCategory && (
            <div className="flex gap-2">
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="金额"
                className="border rounded px-4 py-2 w-full"
              />
              <button
                onClick={handleAddExpense}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg"
              >
                记下 💕
              </button>
            </div>
          )}
        </div>

        {/* ===== 预算进度区 ===== */}
        <div>
          <h2 className="font-semibold text-xl mb-2 text-teal-600">📝 预算进度</h2>

          {categories.map(cat => {
            const budget = Math.round(income * (percentages[cat.key as keyof typeof percentages] / 100));
            const used = expenses[cat.key as keyof typeof expenses] || 0;
            const percent = budget ? Math.min(100, Math.round((used / budget) * 100)) : 0;

            return (
              <div key={cat.key} className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>{cat.label}</span>
                  <span>{used} / {budget}</span>
                </div>
                <div className="w-full bg-gray-200 h-3 rounded">
                  <div
                    className={`h-3 rounded ${percent > 80 ? 'bg-red-400' : 'bg-green-400'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
