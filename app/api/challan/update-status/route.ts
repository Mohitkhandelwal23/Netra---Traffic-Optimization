import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, this would be a real database
const challans: any[] = []

export async function PUT(request: NextRequest) {
  try {
    const { challanId, status, updatedBy } = await request.json()

    // Find and update challan
    const challanIndex = challans.findIndex((c) => c.id === challanId)

    if (challanIndex === -1) {
      return NextResponse.json({ success: false, error: "Challan not found" }, { status: 404 })
    }

    // Update challan status
    challans[challanIndex] = {
      ...challans[challanIndex],
      status,
      updatedBy,
      updatedAt: new Date().toISOString(),
    }

    // Log status change for audit trail
    const statusLog = {
      challanId,
      previousStatus: challans[challanIndex].status,
      newStatus: status,
      updatedBy,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      challan: challans[challanIndex],
      statusLog,
      message: `Challan status updated to ${status}`,
    })
  } catch (error) {
    console.error("Error updating challan status:", error)
    return NextResponse.json({ success: false, error: "Failed to update challan status" }, { status: 500 })
  }
}
