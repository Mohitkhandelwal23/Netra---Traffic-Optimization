import { type NextRequest, NextResponse } from "next/server"

interface ViolationData {
  vehicleNumber: string
  violationType: string
  location: string
  timestamp: string
  fineAmount: number
  officerId: string
  evidence: string[]
  confidence: number
}

// Mock database for demonstration
const challans: any[] = []

export async function POST(request: NextRequest) {
  try {
    const violationData: ViolationData = await request.json()

    // Generate challan ID
    const challanId = `CH${String(challans.length + 1).padStart(3, "0")}`

    // Create challan record
    const challan = {
      id: challanId,
      ...violationData,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Store in mock database
    challans.push(challan)

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      challan,
      message: "E-Challan created successfully",
    })
  } catch (error) {
    console.error("Error creating challan:", error)
    return NextResponse.json({ success: false, error: "Failed to create challan" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const location = searchParams.get("location")

    let filteredChallans = challans

    if (status && status !== "all") {
      filteredChallans = filteredChallans.filter((c) => c.status === status)
    }

    if (location && location !== "all") {
      filteredChallans = filteredChallans.filter((c) => c.location.includes(location))
    }

    return NextResponse.json({
      success: true,
      challans: filteredChallans,
      total: filteredChallans.length,
    })
  } catch (error) {
    console.error("Error fetching challans:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch challans" }, { status: 500 })
  }
}
