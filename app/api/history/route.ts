import { NextResponse } from 'next/server';
import { getSupabaseServerClient, getSupabaseTableName } from '@/app/lib/supabase-server';

const isApproverRole = (role: string | null) => role === 'admin' || role === 'spv';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const namaDriver = url.searchParams.get('nama_driver');
    const role = url.searchParams.get('role');

    if (!namaDriver && !isApproverRole(role)) {
      return NextResponse.json({ message: 'Parameter nama_driver diperlukan untuk user biasa.' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const table = getSupabaseTableName();
    let query = supabase.from(table).select('*');

    if (!isApproverRole(role)) {
      query = query.eq('nama_driver', namaDriver);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ message: `Gagal mengambil riwayat dari tabel ${table}.`, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: String(error) }, { status: 500 });
  }
}
