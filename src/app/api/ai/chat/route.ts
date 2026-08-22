import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/rbac';
import { chatWithHRAssistant } from '@/lib/gemini';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = getSessionUser();
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: { message: 'Message is required' } }, { status: 400 });
    }

    const userName = session?.fullName || 'Employee';
    const balance = session ? db.getLeaveBalance(session.userId) : undefined;
    const balanceStr = balance ? `Paid: ${balance.PAID.remaining} days, Sick: ${balance.SICK.remaining} days, Unpaid: ${balance.UNPAID.remaining} days` : undefined;

    const reply = await chatWithHRAssistant(message, userName, balanceStr);

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
