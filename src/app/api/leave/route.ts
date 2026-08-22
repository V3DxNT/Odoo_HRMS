import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/rbac';
import { db } from '@/lib/db';
import { summarizeLeaveRequest } from '@/lib/gemini';
import { LeaveType } from '@/lib/types';

export async function GET(req: Request) {
  try {
    const session = getSessionUser();
    if (!session) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userIdFilter = searchParams.get('userId');

    const targetUserId = session.role === 'EMPLOYEE' ? session.userId : (userIdFilter || undefined);
    const leaves = db.getLeaves(targetUserId);
    const balance = db.getLeaveBalance(session.userId);

    return NextResponse.json({ leaves, balance });
  } catch (error: any) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = getSessionUser();
    if (!session) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const body = await req.json();
    const { type, startDate, endDate, remarks } = body;

    if (!type || !startDate || !endDate) {
      return NextResponse.json({ error: { message: 'Type, start date, and end date are required' } }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const dbUser = db.getUserById(session.userId);
    const userName = dbUser?.profile?.fullName || session.fullName || session.email;
    const userDepartment = dbUser?.profile?.department || 'Engineering';

    // Auto-generate AI summary of leave request remarks
    const aiSummary = await summarizeLeaveRequest(remarks || `${type} leave application`, userName);

    const leave = db.createLeaveRequest({
      userId: session.userId,
      userName,
      userDepartment,
      userAvatar: dbUser?.profile?.profileImageUrl,
      type: type as LeaveType,
      startDate,
      endDate,
      daysCount,
      remarks: remarks || '',
      aiSummary,
    });

    return NextResponse.json({ success: true, leave });
  } catch (error: any) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
