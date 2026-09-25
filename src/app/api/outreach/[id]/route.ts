import { NextRequest, NextResponse } from "next/server";
import { initialOutreachDrafts } from "@/lib/mockData";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const draft = initialOutreachDrafts.find((d) => d.id === id);

  if (!draft) {
    return NextResponse.json(
      { success: false, error: "Draft not found" },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    if (body.status) draft.status = body.status;
    if (body.subject) draft.subject = body.subject;
    if (body.body) draft.body = body.body;
    if (body.channel) draft.channel = body.channel;

    return NextResponse.json({
      success: true,
      data: draft,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to update draft" },
      { status: 500 }
    );
  }
}
