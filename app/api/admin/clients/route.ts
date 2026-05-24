import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { User, ClientProfile, ClientMetric, ClientPhoto } from "@/models";

// ✅ GET /api/admin/clients
export async function GET() {
  try {
    await connectDB();

    // ✅ get all clients
    const clients = await User.find({ role: "client" }).select("-password");

    const result = await Promise.all(
      clients.map(async (client) => {
        const userId = client._id.toString();

        // ✅ profile
        const profile = await ClientProfile.findOne({ userId });

        // ✅ metrics
        const metrics = await ClientMetric.find({ userId }).sort({ createdAt: 1 });

        // ✅ photos count
        const photosCount = await ClientPhoto.countDocuments({ userId });

        const latestMetric =
          metrics.length > 0 ? metrics[metrics.length - 1] : null;

        return {
          userId,
          email: client.email,
          role: client.role,

          profile: profile
            ? {
                name: profile.name,
                email: profile.email,
                age: profile.age,
                goal: profile.goal,
                activity: profile.activity,
              }
            : null,

          latestMetric: latestMetric
            ? {
                weight: latestMetric.weight,
                height: latestMetric.height,
                bmi: latestMetric.bmi,
                calories: latestMetric.calories,
                goal: latestMetric.goal,
                activity: latestMetric.activity,
                date: latestMetric.date,
              }
            : null,

          stats: {
            entries: metrics.length,
            photos: photosCount,
          },
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.log("ADMIN CLIENTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Admin clients error",
      },
      { status: 500 }
    );
  }
}
