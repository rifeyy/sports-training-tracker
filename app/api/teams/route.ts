import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Team } from "@/models";

export async function GET() {
  await connectDB();
  const teams = await Team.find();

  console.log("GET TEAMS:", teams); // ✅ debug

  return NextResponse.json({
    success: true,
    data: teams,
  });
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  console.log("BODY:", body); // ✅ debug

  const team = await Team.create({
    name: body.name,
  });

  console.log("CREATED:", team); // ✅ debug

  return NextResponse.json({
    success: true,
    data: team,
  });
}