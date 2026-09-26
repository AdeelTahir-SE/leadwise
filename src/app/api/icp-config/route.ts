import { NextRequest, NextResponse } from "next/server";
import { initialIcpConfig } from "@/lib/mockData";
import { IcpConfig } from "@/types/dashboard";

let currentConfig: IcpConfig = { ...initialIcpConfig };

export async function GET() {
  return NextResponse.json({
    success: true,
    data: currentConfig,
  });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    currentConfig = {
      ...currentConfig,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "ICP configuration updated successfully",
      data: currentConfig,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to update ICP configuration" },
      { status: 500 }
    );
  }
}
