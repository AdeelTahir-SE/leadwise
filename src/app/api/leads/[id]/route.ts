import { NextRequest, NextResponse } from "next/server";
import { initialLeads } from "@/lib/mockData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lead = initialLeads.find((l) => l.id === id);

  if (!lead) {
    return NextResponse.json(
      { success: false, error: "Lead not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: lead,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lead = initialLeads.find((l) => l.id === id);

  if (!lead) {
    return NextResponse.json(
      { success: false, error: "Lead not found" },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    if (body.stage) lead.stage = body.stage;
    if (body.score !== undefined) lead.score = body.score;
    lead.updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      data: lead,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to update lead" },
      { status: 500 }
    );
  }
}
