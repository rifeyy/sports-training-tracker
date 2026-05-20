import { connectDB } from "@/lib/mongoose";
import { ClientProfile } from "@/models";

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const saved = await ClientProfile.create(body);

  return Response.json({ success: true, data: saved });
}
