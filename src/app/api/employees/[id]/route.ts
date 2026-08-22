import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/rbac';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = getSessionUser();
    if (!session) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const user = db.getUserById(params.id);
    if (!user) {
      return NextResponse.json({ error: { message: 'Employee not found' } }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = getSessionUser();
    if (!session) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    if (session.role === 'EMPLOYEE' && session.userId !== params.id) {
      return NextResponse.json({ error: { message: 'Forbidden' } }, { status: 403 });
    }

    const body = await req.json();
    const profile = db.updateProfile(params.id, body);

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
