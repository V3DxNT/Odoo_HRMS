import { NextResponse } from 'next/server';
import { mockUsers, createMockToken } from '@/lib/mockDb';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = mockUsers.find((u) => u.email === email);

    // Mock validation
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const tokenPayload = {
      userId: user.id,
      role: user.role,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`
    };

    const token = createMockToken(tokenPayload);

    const response = NextResponse.json({ success: true, user: tokenPayload }, { status: 200 });

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'dayflow_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
