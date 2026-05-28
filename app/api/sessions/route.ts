import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Session } from "@/models";

export async function GET() {
  try {
    await connectDB();

    const sessions = await Session.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: sessions,
    });
  } catch (error: any) {
    console.log("GET SESSIONS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Get sessions error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.athleteId || !body.type || !body.duration) {
      return NextResponse.json(
        {
          success: false,
          message: "Athlete, type and duration are required",
        },
        { status: 400 }
      );
    }

    const session = await Session.create({
      athleteId: body.athleteId,
      type: body.type,
      duration: Number(body.duration),
      day: body.day || "Monday",
      hour: body.hour || "",
    });

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    console.log("CREATE SESSION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Create session error",
      },
      { status: 500 }
    );
  }
}
