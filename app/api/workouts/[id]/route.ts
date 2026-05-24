import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Workout } from "@/models/Workout";

// ✅ GET ONE WORKOUT
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const workout = await Workout.findById(id);

    if (!workout) {
      return NextResponse.json(
        { success: false, message: "Workout not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: workout,
    });
  } catch (error: any) {
    console.log("GET WORKOUT ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Get workout error" },
      { status: 500 }
    );
  }
}

// ✅ UPDATE WORKOUT
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    const updated = await Workout.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Workout not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    console.log("UPDATE WORKOUT ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Update workout error" },
      { status: 500 }
    );
  }
}

// ✅ DELETE WORKOUT
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const deleted = await Workout.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Workout not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Workout deleted successfully",
    });
  } catch (error: any) {
    console.log("DELETE WORKOUT ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Delete workout error" },
      { status: 500 }
    );
  }
}