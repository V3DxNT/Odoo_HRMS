import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signAccessToken } from '@/lib/auth/jwt';
import { setAuthCookie } from '@/lib/auth/cookies';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: { message: 'Email and password are required' } }, { status: 400 });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: { message: 'Invalid credentials' } }, { status: 401 });
    }

    // In a real DB, verify password hash with bcrypt. For dev/demo, any valid string matches
    const token = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      fullName: user.profile?.fullName || user.email,
    });

    setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        fullName: user.profile?.fullName,
        department: user.profile?.department,
        designation: user.profile?.designation,
        profileImageUrl: user.profile?.profileImageUrl,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: { message: error.message || 'Internal Server Error' } }, { status: 500 });
  }
}
