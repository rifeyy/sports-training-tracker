import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Athlete } from "@/models";

export async function GET() {
  try {
    await connectDB();

    const athletes = await Athlete.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: athletes,
    });
  } catch (error: any) {
    console.log("GET ATHLETES ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Get athletes error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.name || !body.sport) {
      return NextResponse.json(
        { success: false, message: "Name and sport are required" },
        { status: 400 }
      );
    }

    const athlete = await Athlete.create({
      name: body.name,
      sport: body.sport,
      teamId: body.teamId || "",
    });

    return NextResponse.json({
      success: true,
      data: athlete,
    });
  } catch (error: any) {
    console.log("CREATE ATHLETE ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Create athlete error" },
      { status: 500 }
    );
  }
}