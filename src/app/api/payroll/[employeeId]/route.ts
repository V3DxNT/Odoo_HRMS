import { NextResponse } from 'next/server';
import { getSessionUser, requireHR } from '@/lib/auth/rbac';
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

export async function PUT(req: Request, { params }: { params: { employeeId: string } }) {
  try {
    const hrUser = requireHR();
    const { baseSalary, allowances, deductions } = await req.json();

    const updated = db.updatePayroll(
      params.employeeId,
      hrUser.userId,
      Number(baseSalary || 0),
      Number(allowances || 0),
      Number(deductions || 0)
    );

    db.createAuditLog(
      hrUser.userId,
      hrUser.fullName,
      'UPDATE_PAYROLL',
      'PAYROLL',
      params.employeeId,
      `Payroll updated for employee ${params.employeeId}`
    );
    return NextResponse.json({ success: true, payroll: updated });
  } catch (error: any) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
