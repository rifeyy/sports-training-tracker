import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Team } from "@/models";

export async function GET() {
  try {
    await connectDB();

    const teams = await Team.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: teams,
    });
  } catch (error: any) {
    console.log("GET TEAMS ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Get teams error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, message: "Team name is required" },
        { status: 400 }
      );
    }

    const team = await Team.create({
      name: body.name,
    });

    return NextResponse.json({
      success: true,
      data: team,
    });
  } catch (error: any) {
    console.log("CREATE TEAM ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Create team error" },
      { status: 500 }
    );
  }
}