import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return NextResponse.json({
    success: true,
    attendanceId: `ATT-${Date.now()}`,
    checkIn: now,
    status: 'PRESENT',
    message: 'Checked in successfully'
  });
}
