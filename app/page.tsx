'use client';

import { useState } from 'react';

export default function Home() {
  const [grossSalary, setGrossSalary] = useState('');
  const [netSalary, setNetSalary] = useState<number | null>(null);

  const calculateNetSalary = () => {
    const gross = Number(grossSalary);
    if (!gross) return;

    const taxRate = 0.1;
    const socialRate = 0.08;

    const net = Math.round(
      gross - gross * taxRate - gross * socialRate
    );

    setNetSalary(net);
    localStorage.setItem('monthlyIncome', String(net));
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          税后到手薪资计算
        </h1>

        <label className="block mb-2 text-sm font-medium">
          税前月薪（元）
        </label>

        <input
          type="number"
          value={grossSalary}
          onChange={(e) => setGrossSalary(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4"
          placeholder="例如：15000"
        />

        <button
          onClick={calculateNetSalary}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
        >
          计算税后收入
        </button>

        {netSalary !== null && (
          <div className="mt-6 text-center space-y-4">
            <div>
              <p className="text-gray-500">预计税后到手</p>
              <p className="text-3xl font-bold mt-2">
                ¥ {netSalary}
              </p>
            </div>

            <a
              href="/budget"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              进入月度预算规划 →
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
