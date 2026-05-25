import { NextRequest } from "next/server";
import { verifyToken } from "./auth";

export function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];

  const decoded: any = verifyToken(token);

  return decoded?.userId || null;
}




