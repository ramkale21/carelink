import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/response";

export async function POST(req: NextRequest) {
  const response = apiSuccess(null, "Logout successful", 200);
  response.cookies.delete("accessToken");
  return response;
}
