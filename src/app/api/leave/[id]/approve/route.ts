import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { decision } = await request.json(); // 'APPROVED' | 'REJECTED'
    const { id } = params;

    return NextResponse.json({
      success: true,
      leaveId: id,
      status: decision,
      message: `Leave request ${id} updated to ${decision}`
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update leave request" }, { status: 400 });
  }
}
