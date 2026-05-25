import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { User, ClientProfile, ClientMetric, ClientPhoto } from "@/models";

// GET /api/admin/clients/[id]
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Client id is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Client not found" },
        { status: 404 }
      );
    }

    const userId = user._id.toString();

    const profile = await ClientProfile.findOne({ userId });
    const metrics = await ClientMetric.find({ userId }).sort({ createdAt: 1 });
    const photos = await ClientPhoto.find({ userId }).sort({ createdAt: -1 });

    const latestMetric =
      metrics.length > 0 ? metrics[metrics.length - 1] : null;

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: userId,
          email: user.email,
          role: user.role,
        },
        profile,
        metrics,
        photos,
        latestMetric,
        stats: {
          entries: metrics.length,
          photos: photos.length,
        },
      },
    });
  } catch (error: any) {
    console.log("ADMIN CLIENT DETAIL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Admin client detail error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/clients/[id]
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Client id is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Client not found" },
        { status: 404 }
      );
    }

    if (user.role !== "client") {
      return NextResponse.json(
        { success: false, message: "Only clients can be deleted here" },
        { status: 403 }
      );
    }

    const userId = user._id.toString();

    await ClientProfile.deleteMany({ userId });
    await ClientMetric.deleteMany({ userId });
    await ClientPhoto.deleteMany({ userId });
    await User.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error: any) {
    console.log("DELETE CLIENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Delete client error",
      },
      { status: 500 }
    );
  }
}