import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Session } from "@/models";

export async function PUT(req: Request, context: any) {
  try {
    await connectDB();

    const { id } = await context.params;
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

    const session = await Session.findByIdAndUpdate(
      id,
      {
        athleteId: body.athleteId,
        type: body.type,
        duration: Number(body.duration),
        day: body.day || "Monday",
        hour: body.hour || "",
      },
      { new: true }
    );

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Session not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    console.log("UPDATE SESSION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Update session error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    await connectDB();

    const { id } = await context.params;

    const session = await Session.findByIdAndDelete(id);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Session not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error: any) {
    console.log("DELETE SESSION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Delete session error",
      },
      { status: 500 }
    );
  }
}
