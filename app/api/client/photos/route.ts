import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { ClientPhoto, ClientMetric, ClientProfile } from "@/models";

function calculatePhotoScore(goal: string, metrics: any[]) {
  if (!metrics || metrics.length < 2) {
    return {
      score: 50,
      feedback: "Not enough progress data yet. Save more metrics to get a better rating.",
    };
  }

  const first = metrics[0];
  const latest = metrics[metrics.length - 1];

  const diff = latest.weight - first.weight;

  if (goal === "Lose Weight") {
    if (diff < -3) {
      return {
        score: 90,
        feedback: "Great progress toward fat loss. Keep your routine consistent.",
      };
    }

    if (diff < 0) {
      return {
        score: 75,
        feedback: "Good direction. You are losing weight gradually.",
      };
    }

    return {
      score: 45,
      feedback: "Progress is slow for fat loss. Review calories and cardio consistency.",
    };
  }

  if (goal === "Gain Muscle") {
    if (diff > 3) {
      return {
        score: 85,
        feedback: "Strong progress for muscle gain. Keep training and nutrition consistent.",
      };
    }

    if (diff > 0) {
      return {
        score: 70,
        feedback: "Good start. Keep increasing strength and calories progressively.",
      };
    }

    return {
      score: 45,
      feedback: "Muscle gain progress needs more consistency in calories and strength training.",
    };
  }

  // Maintain
  if (Math.abs(diff) <= 2) {
    return {
      score: 85,
      feedback: "Your weight is stable. Great job maintaining your goal.",
    };
  }

  return {
    score: 60,
    feedback: "Your weight changed more than expected for maintenance. Keep tracking weekly.",
  };
}

// ? GET /api/client/photos?userId=...
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 }
      );
    }

    const photos = await ClientPhoto.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: photos,
    });
  } catch (error: any) {
    console.log("GET PHOTOS ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Get photos error" },
      { status: 500 }
    );
  }
}

// ? POST /api/client/photos
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.userId || !body.image) {
      return NextResponse.json(
        { success: false, message: "userId and image are required" },
        { status: 400 }
      );
    }

    const profile = await ClientProfile.findOne({ userId: body.userId });
    const metrics = await ClientMetric.find({ userId: body.userId }).sort({ createdAt: 1 });

    const goal = profile?.goal || body.goal || "Maintain";

    const rating = calculatePhotoScore(goal, metrics);

    const photo = await ClientPhoto.create({
      userId: body.userId,
      image: body.image,
      goal,
      score: rating.score,
      feedback: rating.feedback,
      date: body.date || new Date().toLocaleDateString(),
    });

    return NextResponse.json({
      success: true,
      data: photo,
    });
  } catch (error: any) {
    console.log("POST PHOTOS ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Save photo error" },
      { status: 500 }
    );
  }
}

// ? DELETE /api/client/photos?userId=...
export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 }
      );
    }

    await ClientPhoto.deleteMany({ userId });

    return NextResponse.json({
      success: true,
      message: "Photos deleted successfully",
    });
  } catch (error: any) {
    console.log("DELETE PHOTOS ERROR:", error);

    return NextResponse.json(
      { success: false, message: error.message || "Delete photos error" },
      { status: 500 }
    );
  }
}




