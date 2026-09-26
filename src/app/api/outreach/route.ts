import { NextRequest, NextResponse } from "next/server";
import { initialOutreachDrafts } from "@/lib/mockData";
import { OutreachDraft } from "@/types/dashboard";

let draftsStore: OutreachDraft[] = [...initialOutreachDrafts];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let filtered = [...draftsStore];
  if (status && status !== "all") {
    filtered = filtered.filter((d) => d.status === status);
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    data: filtered,
  });
}
