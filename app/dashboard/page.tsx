"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Ambil data user dari localStorage yang sudah kita set saat login
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/'); // Jika belum login, tendang balik ke halaman login
    } else {
      const userData = JSON.parse(user);
      setUserName(userData.nama_lengkap ?? userData.username ?? '');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white border-b border-slate-100 p-6 flex justify-between items-center">
        <div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Dashboard</p>
          <h1 className="text-xl font-bold text-slate-900">Halo, {userName}</h1>
        </div>
        <button 
          onClick={() => { localStorage.clear(); router.push('/'); }}
          className="text-sm font-semibold text-red-500 hover:text-red-700"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        <h2 className="text-slate-500 text-xs font-bold uppercase mb-4 tracking-wider">Menu Utama</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div 
            onClick={() => router.push('/sertim')}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all cursor-pointer w-full group"
          >
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            {/* Ikon File */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-bold text-slate-800">Sertim</h3>
          <p className="text-slate-400 text-xs mt-1">Input data sertifikat tim</p>
        </div>

        <div 
          onClick={() => router.push('/history')}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all cursor-pointer w-full group"
        >
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-6 8h6m-6 4h6m-8 4h10a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h2" />
            </svg>
          </div>
          <h3 className="font-bold text-slate-800">History</h3>
          <p className="text-slate-400 text-xs mt-1">Lihat riwayat sertim kamu</p>
        </div>
      </div>
      </main>
    </div>
  );
}