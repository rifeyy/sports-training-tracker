import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Team } from "@/models";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, message: "Team name is required" },
        { status: 400 }
      );
    }

    const team = await Team.findByIdAndUpdate(
      id,
      {
        name: body.name,
      },
      {
        new: true,
      }
    );

    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: team,
    });
  } catch (error: any) {
    console.log("UPDATE TEAM ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Update team error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const team = await Team.findByIdAndDelete(id);

    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error: any) {
    console.log("DELETE TEAM ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Delete team error",
      },
      { status: 500 }
    );
  }
}