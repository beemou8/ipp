"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function SertimPage() {
  const [namaDriver, setNamaDriver] = useState('');
  const [kodeMember, setKodeMember] = useState('');
  const [noTrx, setNoTrx] = useState('');
  const [jenisPin, setJenisPin] = useState('B');
  const [alasan, setAlasan] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }

    const user = JSON.parse(storedUser);
    setNamaDriver(user.nama_lengkap ?? user.username ?? '');
  }, [router]);

  async function uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorResult = await uploadResponse.json();
      throw new Error(errorResult?.message ?? 'Gagal upload foto.');
    }

    const result = await uploadResponse.json();
    return result.url as string;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);
    setLoading(true);

    try {
      let fotoTokoUrl = '';
      if (fotoFile) {
        fotoTokoUrl = await uploadPhoto(fotoFile);
      }

      const response = await fetch('/api/sertim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama_driver: namaDriver,
          kode_member: kodeMember,
          no_trx: noTrx,
          jenis_pin: jenisPin,
          alasan,
          foto_toko_url: fotoTokoUrl,
        }),
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        setErrorMessage(result?.details ?? result?.message ?? 'Gagal menyimpan data.');
        return;
      }

      setStatusMessage('Data berhasil ditambahkan ke database.');
      setKodeMember('');
      setNoTrx('');
      setJenisPin('B');
      setAlasan('');
      setFotoFile(null);
      setFotoPreview('');
    } catch (error) {
      setLoading(false);
      setErrorMessage((error as Error)?.message || 'Terjadi kesalahan server. Silakan coba lagi.');
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setFotoFile(file);
    setFotoPreview(file ? URL.createObjectURL(file) : '');
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Sertim</p>
            <h1 className="text-3xl font-bold text-slate-900">Form Input Database</h1>
          </div>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Kembali ke Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Nama Driver</span>
              <input
                value={namaDriver}
                readOnly
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-900"
                placeholder="Nama driver"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Kode Member</span>
              <input
                value={kodeMember}
                onChange={(e) => setKodeMember(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none"
                placeholder="Masukkan kode member"
                required
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">No. Trx</span>
              <input
                value={noTrx}
                onChange={(e) => setNoTrx(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none"
                placeholder="Masukkan nomor transaksi"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Jenis PIN</span>
              <select
                value={jenisPin}
                onChange={(e) => setJenisPin(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none"
                required
              >
                <option value="B">PIN B</option>
                <option value="T">PIN T</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Alasan</span>
            <textarea
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none"
              rows={4}
              placeholder="Jelaskan alasan input data"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Upload Foto Toko</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none"
            />
          </label>

          {fotoPreview && (
            <img src={fotoPreview} alt="Preview foto toko" className="h-56 w-full rounded-3xl object-cover" />
          )}

          {errorMessage && <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{errorMessage}</div>}
          {statusMessage && <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{statusMessage}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Menyimpan...' : 'Simpan ke Database'}
          </button>
        </form>
      </div>
    </main>
  );
}
