import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { decision, reason } = await request.json(); // 'APPROVED' | 'REJECTED', reason
    const { id } = params;

    return NextResponse.json({
      success: true,
      leaveId: id,
      status: decision,
      reason: reason || null,
      message: `Leave request ${id} updated to ${decision}${reason ? `. Reason: ${reason}` : ''}`
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update leave request" }, { status: 400 });
  }
}

