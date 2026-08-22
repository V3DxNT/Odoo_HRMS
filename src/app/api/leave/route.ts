import { NextResponse } from 'next/server';
import { initialLeaveRequests } from '@/lib/dashboardMock';

// In-memory store for leave requests
let leaveStore = [...initialLeaveRequests];

export async function GET() {
  return NextResponse.json({ success: true, leaveRequests: leaveStore });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, startDate, endDate, remarks, employeeName } = body;

    const newRequest = {
      id: `LV-${Math.floor(100 + Math.random() * 900)}`,
      employeeName: employeeName || "David Lee",
      employeeAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      department: "Engineering",
      type: type || "Vacation",
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date().toISOString().split('T')[0],
      days: 2,
      reason: remarks || "Personal time off request.",
      status: "PENDING" as const,
      submittedAt: "Just now"
    };

    leaveStore.unshift(newRequest);

    return NextResponse.json({ success: true, leaveRequest: newRequest }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to apply for leave" }, { status: 400 });
  }
}
