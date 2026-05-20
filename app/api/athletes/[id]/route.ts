import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Athlete, Session } from "@/models/index";
import type { ApiResponse } from "@/lib/types";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const athlete = await Athlete.findById(id);
    if (!athlete) return NextResponse.json<ApiResponse>({ success: false, error: "Athlete introuvable." }, { status: 404 });
    const sessions = await Session.find({ athlete: id }).sort({ date: -1 }).limit(10);
    return NextResponse.json<ApiResponse>({ success: true, data: { athlete, sessions } });
  } catch (err) {
    console.error("[ATHLETE GET]", err);
    return NextResponse.json<ApiResponse>({ success: false, error: "Erreur serveur." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const athlete = await Athlete.findByIdAndUpdate(id, body, { new: true });
    if (!athlete) return NextResponse.json<ApiResponse>({ success: false, error: "Athlete introuvable." }, { status: 404 });
    return NextResponse.json<ApiResponse>({ success: true, data: athlete });
  } catch (err) {
    console.error("[ATHLETE PUT]", err);
    return NextResponse.json<ApiResponse>({ success: false, error: "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    await Athlete.findByIdAndDelete(id);
    await Session.deleteMany({ athlete: id });
    return NextResponse.json<ApiResponse>({ success: true });
  } catch (err) {
    console.error("[ATHLETE DELETE]", err);
    return NextResponse.json<ApiResponse>({ success: false, error: "Erreur serveur." }, { status: 500 });
  }
}