import { NextResponse } from 'next/server';
import { getSessionUser, requireAdmin } from '@/lib/auth/rbac';
import { db } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { employeeId: string } }) {
  try {
    const session = getSessionUser();
    if (!session) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const targetUserId = params.employeeId === 'me' ? session.userId : params.employeeId;

    if (session.role === 'EMPLOYEE' && targetUserId !== session.userId) {
      return NextResponse.json({ error: { message: 'Forbidden' } }, { status: 403 });
    }

    const payroll = db.getPayrollByUserId(targetUserId);
    return NextResponse.json({ payroll });
  } catch (error: any) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { employeeId: string } }) {
  try {
    const admin = requireAdmin();
    const { baseSalary, allowances, deductions } = await req.json();

    const payroll = db.updatePayroll(
      params.employeeId,
      admin.userId,
      Number(baseSalary),
      Number(allowances || 0),
      Number(deductions || 0)
    );

    return NextResponse.json({ success: true, payroll });
  } catch (error: any) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
