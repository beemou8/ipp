import { NextResponse } from 'next/server';
import { getSupabaseServerClient, getSupabaseTableName } from '@/app/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const {
      nama_driver,
      kode_member,
      no_trx,
      jenis_pin,
      alasan,
      foto_toko_url,
      diterima_ditolak_oleh,
    } = await req.json();

    if (!nama_driver || !kode_member || !no_trx || !jenis_pin || !alasan) {
      return NextResponse.json({ message: 'Semua field wajib diisi.' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const table = getSupabaseTableName();

    const { data, error } = await supabase.from(table).insert([
      {
        nama_driver,
        kode_member,
        no_trx,
        jenis_pin,
        alasan,
        foto_toko_url,
        status: 'pending',
        diterima_ditolak_oleh: diterima_ditolak_oleh || null,
      },
    ]);

    if (error) {
      return NextResponse.json({ message: 'Gagal menyimpan data.', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Data berhasil ditambahkan.', data });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status, diterima_ditolak_oleh } = await req.json();

    if (!id || !status || !diterima_ditolak_oleh) {
      return NextResponse.json({ message: 'id, status, dan nama approver wajib diisi.' }, { status: 400 });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ message: 'Status harus approved atau rejected.' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const table = getSupabaseTableName();

    const { data, error } = await supabase
      .from(table)
      .update({ status, diterima_ditolak_oleh })
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ message: 'Gagal memperbarui status.', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Status berhasil diperbarui.', data });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: String(error) }, { status: 500 });
  }
}
