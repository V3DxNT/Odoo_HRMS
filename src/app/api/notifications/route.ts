import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/rbac';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = getSessionUser();
    if (!session) {
      return NextResponse.json({ notifications: [] });
    }

    const notifications = db.getNotifications(session.userId);
    return NextResponse.json({ notifications });
  } catch (error: any) {
    return NextResponse.json({ notifications: [] });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();
    if (id) {
      db.markNotificationRead(id);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
