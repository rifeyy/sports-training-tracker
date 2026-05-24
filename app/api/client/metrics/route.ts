import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { ClientMetric } from "@/models";

// ✅ GET /api/client/metrics?userId=...
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 }
      );
    }

    const metrics = await ClientMetric.find({ userId }).sort({ createdAt: 1 });

    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error: any) {
    console.log("GET METRICS ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Get metrics error" },
      { status: 500 }
    );
  }
}

// ✅ POST /api/client/metrics
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 }
      );
    }

    const metric = await ClientMetric.create({
      userId: body.userId,
      weight: body.weight,
      height: body.height,
      bmi: body.bmi,
      calories: body.calories,
      goal: body.goal,
      activity: body.activity,
      date: body.date || new Date().toLocaleDateString(),
    });

    return NextResponse.json({
      success: true,
      data: metric,
    });
  } catch (error: any) {
    console.log("POST METRICS ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Save metric error" },
      { status: 500 }
    );
  }
}

// ✅ DELETE /api/client/metrics?userId=...
export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 }
      );
    }

    await ClientMetric.deleteMany({ userId });

    return NextResponse.json({
      success: true,
      message: "Metrics deleted successfully",
    });
  } catch (error: any) {
    console.log("DELETE METRICS ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Delete metrics error" },
      { status: 500 }
    );
  }
}
