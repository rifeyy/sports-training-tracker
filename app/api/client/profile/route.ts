import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { ClientProfile, ClientMetric } from "@/models";

// GET profile
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

    const profile = await ClientProfile.findOne({ userId });

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Get profile error" },
      { status: 500 }
    );
  }
}

// SAVE profile + SYNC metrics
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

    const profile = await ClientProfile.findOneAndUpdate(
      { userId: body.userId },
      {
        userId: body.userId,
        name: body.name,
        email: body.email,
        age: body.age,
        goal: body.goal,
        activity: body.activity,
      },
      {
        new: true,
        upsert: true,
      }
    );

    const syncResult = await ClientMetric.updateMany(
      { userId: body.userId },
      {
        $set: {
          goal: body.goal,
          activity: body.activity,
        },
      }
    );

    return NextResponse.json({
      success: true,
      data: profile,
      syncedMetrics: syncResult.modifiedCount,
    });
  } catch (error: any) {
    console.log("SAVE PROFILE ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Save profile error" },
      { status: 500 }
    );
  }
}
