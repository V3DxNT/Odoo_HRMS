import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signAccessToken } from '@/lib/auth/jwt';
import { setAuthCookie } from '@/lib/auth/cookies';

export async function POST(req: Request) {
  try {
    const { role } = await req.json(); // 'HR' or 'EMPLOYEE'

    const targetEmail = role === 'HR' ? 'priya@dayflow.hr' : 'arjun@dayflow.hr';
    const user = db.getUserByEmail(targetEmail);

    if (!user) {
      return NextResponse.json({ error: { message: 'Demo account not found' } }, { status: 404 });
    }

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
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
