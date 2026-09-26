import { NextResponse } from "next/server";
import { initialMetrics } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: initialMetrics,
  });
}
