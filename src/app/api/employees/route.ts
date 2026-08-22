import { NextResponse } from 'next/server';
import { getSessionUser, requireAdmin } from '@/lib/auth/rbac';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = getSessionUser();
    if (!session) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const users = db.getUsers();
    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const admin = requireAdmin();
    const { email, fullName, department, designation, role } = await req.json();

    if (!email || !fullName) {
      return NextResponse.json({ error: { message: 'Email and Full Name are required' } }, { status: 400 });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: { message: 'Employee with this email already exists' } }, { status: 400 });
    }

    const newId = `usr_emp_${Date.now()}`;
    const empId = `EMP-${1000 + db.getUsers().length + 1}`;

    const newUser = db.createUser({
      id: newId,
      employeeId: empId,
      email,
      role: role || 'EMPLOYEE',
      status: 'INVITED',
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: {
        id: `prof_${Date.now()}`,
        userId: newId,
        fullName,
        department: department || 'Engineering',
        designation: designation || 'Specialist',
        dateOfJoining: new Date().toISOString().split('T')[0],
        profileImageUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300`,
        updatedAt: new Date().toISOString(),
      },
    });

    db.createAuditLog(
      admin.userId,
      admin.fullName,
      'EMPLOYEE_INVITED',
      'User',
      newId,
      `Invited new employee ${fullName} (${email}) to ${department || 'Engineering'}`
    );

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
