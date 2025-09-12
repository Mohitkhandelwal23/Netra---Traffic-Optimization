import type { NextRequest } from "next/server"
import { createSSEResponse } from "@/lib/realtime"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get("clientId") || `client_${Date.now()}`
  const channel = searchParams.get("channel") || "traffic-updates"

  return createSSEResponse(clientId, channel)
}
