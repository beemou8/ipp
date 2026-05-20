"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type HistoryItem = {
  id: number;
  nama_driver: string;
  kode_member: string;
  no_trx: string;
  jenis_pin: string;
  alasan: string;
  foto_toko_url: string | null;
  status: string | null;
  diterima_ditolak_oleh: string | null;
  created_at: string | null;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState('user');
  const [namaDriver, setNamaDriver] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();

  const canApprove = role === 'admin' || role === 'spv';

  async function handleStatusUpdate(id: number, status: 'approved' | 'rejected') {
    if (actionLoading) return;
    setActionLoading(true);
    setError(null);

    try {
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      const approver = user?.nama_lengkap ?? user?.username ?? 'admin';

      const response = await fetch('/api/sertim', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status,
          diterima_ditolak_oleh: approver,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result?.message || 'Gagal memperbarui status.');
        setActionLoading(false);
        return;
      }

      setHistory((current) =>
        current.map((item) =>
          item.id === id ? { ...item, status: result.data?.status ?? status, diterima_ditolak_oleh: approver } : item
        )
      );
    } catch (err) {
      setError('Gagal memperbarui status. Silakan coba lagi.');
    } finally {
      setActionLoading(false);
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }

    const user = JSON.parse(storedUser);
    const driverName = user.nama_lengkap ?? user.username ?? '';
    setNamaDriver(driverName);
    setRole(user.role ?? 'user');

    const searchParams = new URLSearchParams();
    if (driverName) {
      searchParams.set('nama_driver', driverName);
    }
    searchParams.set('role', user.role ?? 'user');

    fetch(`/api/history?${searchParams.toString()}`)
      .then(async (response) => {
        const result = await response.json();

        if (!response.ok) {
          setError(result?.message || 'Gagal memuat riwayat.');
          setLoading(false);
          return;
        }

        setHistory(result.data ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError('Gagal memuat riwayat. Silakan coba lagi.');
        setLoading(false);
      });
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">History</p>
            <h1 className="text-3xl font-bold text-slate-900">Riwayat Input Sertim</h1>
          </div>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Kembali ke Dashboard
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Memuat riwayat...</p>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : history.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
            Belum ada riwayat input sertim untuk nama kamu.
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                  <div>
                    <p className="text-sm text-slate-500">{item.created_at ? new Date(item.created_at).toLocaleString('id-ID') : 'Tanggal tidak tersedia'}</p>
                    <h2 className="text-xl font-semibold text-slate-900">{item.kode_member} — {item.no_trx}</h2>
                  </div>
                  <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
                    {item.jenis_pin}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-slate-500">Alasan</p>
                    <p className="mt-1 text-slate-800">{item.alasan}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Status</p>
                    <p className="mt-1 text-slate-800">{item.status ?? 'pending'}</p>
                  </div>
                </div>

                {item.foto_toko_url ? (
                  <img src={item.foto_toko_url} alt="Foto toko" className="mt-4 w-full rounded-3xl object-cover max-h-80" />
                ) : null}

                {canApprove && item.status !== 'approved' && item.status !== 'rejected' ? (
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(item.id, 'approved')}
                      disabled={actionLoading}
                      className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(item.id, 'rejected')}
                      disabled={actionLoading}
                      className="w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Tolak
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
