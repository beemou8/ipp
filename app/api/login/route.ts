import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/app/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Username dan password wajib diisi.' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 401 });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return NextResponse.json({ message: 'Password salah' }, { status: 401 });
    }

    return NextResponse.json({
      message: 'Login berhasil',
      user: {
        username: user.username,
        nama_lengkap: user.nama_lengkap ?? user.username,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
