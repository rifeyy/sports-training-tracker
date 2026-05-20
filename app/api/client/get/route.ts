import { connectDB } from "@/lib/mongoose";
import { ClientProfile } from "@/models";

export async function GET() {
  await connectDB();

  const data = await ClientProfile.find();

  return Response.json({ success: true, data });
}
