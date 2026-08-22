import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/rbac';
import { db } from '@/lib/db';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = requireAdmin();
    const { approved, comment } = await req.json();

    const leave = db.approveLeaveRequest(params.id, admin.userId, approved, comment);
    if (!leave) {
      return NextResponse.json({ error: { message: 'Leave request not found' } }, { status: 404 });
    }

    return NextResponse.json({ success: true, leave });
  } catch (error: any) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
