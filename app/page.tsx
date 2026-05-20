"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        setError(result?.message ?? 'Login gagal');
        return;
      }

      localStorage.setItem('user', JSON.stringify(result.user));
      router.push('/dashboard');
    } catch (err) {
      setLoading(false);
      setError('Terjadi kesalahan saat login. Silakan coba lagi.');
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Masuk ke Sertim</h1>
        <p className="text-sm text-slate-500 mb-6">Gunakan akun kamu untuk mengakses dashboard.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Username
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none"
              type="text"
              autoComplete="username"
              required
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </main>
  );
}
