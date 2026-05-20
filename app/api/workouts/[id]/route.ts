import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Workout from "@/models/Workout";
import { getUserFromRequest } from "@/lib/protect";

// ✅ UPDATE
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const userId = getUserFromRequest(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const updated = await Workout.findOneAndUpdate(
      { _id: params.id, userId },
      body,
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "Error" },
      { status: 500 }
    );
  }
}

// ✅ DELETE
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const userId = getUserFromRequest(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await Workout.findOneAndDelete({
      _id: params.id,
      userId,
    });

    return NextResponse.json({ message: "Deleted ✅" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error" },
      { status: 500 }
    );
  }
}