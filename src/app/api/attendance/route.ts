import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/rbac';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const session = getSessionUser();
    if (!session) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userIdFilter = searchParams.get('userId');

    // If employee, force filter to self
    const targetUserId = session.role === 'EMPLOYEE' ? session.userId : (userIdFilter || undefined);

    const records = db.getAttendance(targetUserId);
    const todayRecord = db.getTodayAttendance(session.userId);

    return NextResponse.json({ records, todayRecord });
  } catch (error: any) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
