import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bbox = {
    minLat: Number.parseFloat(searchParams.get("minLat") || "0"),
    minLon: Number.parseFloat(searchParams.get("minLon") || "0"),
    maxLat: Number.parseFloat(searchParams.get("maxLat") || "0"),
    maxLon: Number.parseFloat(searchParams.get("maxLon") || "0"),
  }

  try {
    const query = `
      [out:json][timeout:25];
      (
        way["highway"~"^(primary|secondary|tertiary|trunk|residential)$"](${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon});
        node(w);
      );
      out geom;
    `

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(query)}`,
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error("Failed to fetch OSM data")
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: data.elements,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("OSM API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch road data",
        fallback: true,
      },
      { status: 500 },
    )
  }
}
