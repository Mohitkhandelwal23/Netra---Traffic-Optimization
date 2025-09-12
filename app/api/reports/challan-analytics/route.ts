import { type NextRequest, NextResponse } from "next/server"

// Mock data for demonstration
const generateAnalyticsData = () => {
  const today = new Date()
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    return date.toISOString().split("T")[0]
  }).reverse()

  return {
    summary: {
      totalViolations: 1247,
      pendingChallans: 342,
      paidChallans: 789,
      disputedChallans: 116,
      totalRevenue: 1875000,
      collectionRate: 78.5,
      averageFineAmount: 1250,
    },
    violationTypes: [
      { type: "Red Light Violation", count: 561, percentage: 45, avgFine: 1000 },
      { type: "Overspeeding", count: 374, percentage: 30, avgFine: 2000 },
      { type: "No Helmet", count: 187, percentage: 15, avgFine: 500 },
      { type: "Wrong Lane", count: 125, percentage: 10, avgFine: 750 },
    ],
    hotspots: [
      { location: "Dadar Junction", violations: 72, revenue: 108000 },
      { location: "Worli Junction", violations: 58, revenue: 89250 },
      { location: "Bandra Junction", violations: 45, revenue: 67500 },
      { location: "Andheri Signal", violations: 32, revenue: 48000 },
      { location: "Marine Drive", violations: 28, revenue: 42000 },
    ],
    dailyTrends: last30Days.map((date) => ({
      date,
      violations: Math.floor(Math.random() * 50) + 20,
      revenue: Math.floor(Math.random() * 75000) + 25000,
      collectionRate: Math.floor(Math.random() * 20) + 70,
    })),
    hourlyDistribution: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      violations: Math.floor(Math.random() * 30) + 5,
    })),
    performanceMetrics: {
      detectionAccuracy: 94.2,
      processingSpeed: 87,
      systemUptime: 99.8,
      falsePositiveRate: 5.8,
    },
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const location = searchParams.get("location")

    // Generate analytics data
    const analyticsData = generateAnalyticsData()

    // Apply filters if provided
    const filteredData = analyticsData

    if (location && location !== "all") {
      filteredData.hotspots = filteredData.hotspots.filter((h) =>
        h.location.toLowerCase().includes(location.toLowerCase()),
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredData,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error generating analytics:", error)
    return NextResponse.json({ success: false, error: "Failed to generate analytics" }, { status: 500 })
  }
}
