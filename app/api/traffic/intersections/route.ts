import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for traffic intersections
const intersections = [
  {
    id: "int-001",
    name: "Main St & 5th Ave",
    location: { lat: 19.076, lng: 72.8777 },
    city: "Mumbai",
    status: "active",
    currentPhase: "green",
    timeRemaining: 23,
    signalTiming: { green: 45, yellow: 5, red: 30 },
    trafficDensity: 0.75,
    vehicleCount: 45,
    averageSpeed: 32,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "int-002",
    name: "Park Ave & 2nd St",
    location: { lat: 28.6139, lng: 77.209 },
    city: "Delhi",
    status: "active",
    currentPhase: "red",
    timeRemaining: 15,
    signalTiming: { green: 60, yellow: 5, red: 25 },
    trafficDensity: 0.62,
    vehicleCount: 38,
    averageSpeed: 28,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "int-003",
    name: "Broadway & Oak",
    location: { lat: 12.9716, lng: 77.5946 },
    city: "Bangalore",
    status: "maintenance",
    currentPhase: "yellow",
    timeRemaining: 3,
    signalTiming: { green: 40, yellow: 5, red: 35 },
    trafficDensity: 0.45,
    vehicleCount: 22,
    averageSpeed: 35,
    lastUpdated: new Date().toISOString(),
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")
  const status = searchParams.get("status")

  let filteredIntersections = intersections

  if (city) {
    filteredIntersections = filteredIntersections.filter(
      (intersection) => intersection.city.toLowerCase() === city.toLowerCase(),
    )
  }

  if (status) {
    filteredIntersections = filteredIntersections.filter((intersection) => intersection.status === status)
  }

  return NextResponse.json({
    success: true,
    data: filteredIntersections,
    total: filteredIntersections.length,
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  try {
    const newIntersection = await request.json()

    const intersection = {
      id: `int-${String(intersections.length + 1).padStart(3, "0")}`,
      ...newIntersection,
      status: "active",
      currentPhase: "green",
      timeRemaining: newIntersection.signalTiming?.green || 45,
      trafficDensity: 0.5,
      vehicleCount: 0,
      averageSpeed: 30,
      lastUpdated: new Date().toISOString(),
    }

    intersections.push(intersection)

    return NextResponse.json({
      success: true,
      data: intersection,
      message: "Intersection created successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create intersection" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()

    const intersectionIndex = intersections.findIndex((int) => int.id === id)

    if (intersectionIndex === -1) {
      return NextResponse.json({ success: false, error: "Intersection not found" }, { status: 404 })
    }

    intersections[intersectionIndex] = {
      ...intersections[intersectionIndex],
      ...updates,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: intersections[intersectionIndex],
      message: "Intersection updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update intersection" }, { status: 500 })
  }
}
