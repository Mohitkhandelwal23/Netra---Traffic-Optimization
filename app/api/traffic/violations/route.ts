import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for violations
const violations = [
  {
    id: "viol-001",
    type: "red_light",
    vehicleNumber: "MH01AB1234",
    location: "Main St & 5th Ave",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    confidence: 0.94,
    imageUrl: "/placeholder.svg?height=200&width=300&text=Red+Light+Violation",
    status: "detected",
    fineAmount: 1000,
  },
  {
    id: "viol-002",
    type: "speeding",
    vehicleNumber: "DL02CD5678",
    location: "Park Ave & 2nd St",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    confidence: 0.89,
    speed: 65,
    speedLimit: 40,
    imageUrl: "/placeholder.svg?height=200&width=300&text=Speeding+Violation",
    status: "detected",
    fineAmount: 2000,
  },
  {
    id: "viol-003",
    type: "no_helmet",
    vehicleNumber: "KA03EF9012",
    location: "Broadway & Oak",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    confidence: 0.92,
    imageUrl: "/placeholder.svg?height=200&width=300&text=No+Helmet+Violation",
    status: "detected",
    fineAmount: 500,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const status = searchParams.get("status")
  const vehicleNumber = searchParams.get("vehicleNumber")
  const limit = Number.parseInt(searchParams.get("limit") || "50")
  const offset = Number.parseInt(searchParams.get("offset") || "0")

  let filteredViolations = violations

  if (type) {
    filteredViolations = filteredViolations.filter((v) => v.type === type)
  }

  if (status) {
    filteredViolations = filteredViolations.filter((v) => v.status === status)
  }

  if (vehicleNumber) {
    filteredViolations = filteredViolations.filter((v) =>
      v.vehicleNumber.toLowerCase().includes(vehicleNumber.toLowerCase()),
    )
  }

  // Sort by timestamp (newest first)
  filteredViolations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // Pagination
  const paginatedViolations = filteredViolations.slice(offset, offset + limit)

  return NextResponse.json({
    success: true,
    data: paginatedViolations,
    total: filteredViolations.length,
    limit,
    offset,
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  try {
    const violationData = await request.json()

    const violation = {
      id: `viol-${String(violations.length + 1).padStart(3, "0")}`,
      ...violationData,
      timestamp: new Date().toISOString(),
      status: "detected",
    }

    violations.push(violation)

    return NextResponse.json({
      success: true,
      data: violation,
      message: "Violation recorded successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to record violation" }, { status: 500 })
  }
}
