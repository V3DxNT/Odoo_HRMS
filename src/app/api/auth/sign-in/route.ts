import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { mockUsers, createMockToken } from '@/lib/mockDb';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedPassword = (password || '').trim();

    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    // Mock validation
    if (!user || user.password !== normalizedPassword) {
      return NextResponse.json({ error: "Invalid credentials. Try admin@company.com / password123" }, { status: 401 });
    }

    const tokenPayload = {
      userId: user.id,
      role: user.role,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
      department: user.department,
      designation: user.designation
    };

    const token = createMockToken(tokenPayload);

    // Set cookie using next/headers cookies() for maximum compatibility
    const cookieStore = cookies();
    cookieStore.set('dayflow_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    const response = NextResponse.json({ success: true, user: tokenPayload, token }, { status: 200 });

    // Also set on response cookies
    response.cookies.set('dayflow_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
