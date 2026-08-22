import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/rbac';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const sessionUser = getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ user: null });
    }

    const dbUser = db.getUserById(sessionUser.userId);
    if (!dbUser) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: dbUser.id,
        employeeId: dbUser.employeeId,
        email: dbUser.email,
        role: dbUser.role,
        status: dbUser.status,
        fullName: dbUser.profile?.fullName,
        phone: dbUser.profile?.phone,
        address: dbUser.profile?.address,
        department: dbUser.profile?.department,
        designation: dbUser.profile?.designation,
        dateOfJoining: dbUser.profile?.dateOfJoining,
        profileImageUrl: dbUser.profile?.profileImageUrl,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ user: null });
  }
}
