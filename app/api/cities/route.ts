import { type NextRequest, NextResponse } from "next/server"

const indianCities = [
  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    coordinates: { lat: 19.076, lng: 72.8777 },
    population: 12442373,
    area: 603.4,
    timezone: "Asia/Kolkata",
    trafficDensity: "very_high",
    intersections: 156,
    averageSpeed: 25,
    peakHours: ["08:00-10:00", "18:00-21:00"],
  },
  {
    id: "delhi",
    name: "Delhi",
    state: "Delhi",
    coordinates: { lat: 28.6139, lng: 77.209 },
    population: 16787941,
    area: 1484,
    timezone: "Asia/Kolkata",
    trafficDensity: "very_high",
    intersections: 203,
    averageSpeed: 28,
    peakHours: ["08:30-10:30", "17:30-20:30"],
  },
  {
    id: "bangalore",
    name: "Bangalore",
    state: "Karnataka",
    coordinates: { lat: 12.9716, lng: 77.5946 },
    population: 8443675,
    area: 709,
    timezone: "Asia/Kolkata",
    trafficDensity: "high",
    intersections: 134,
    averageSpeed: 32,
    peakHours: ["08:00-10:00", "18:00-20:00"],
  },
  {
    id: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    coordinates: { lat: 13.0827, lng: 80.2707 },
    population: 4646732,
    area: 426,
    timezone: "Asia/Kolkata",
    trafficDensity: "high",
    intersections: 98,
    averageSpeed: 35,
    peakHours: ["08:30-10:00", "18:30-20:00"],
  },
  {
    id: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    coordinates: { lat: 22.5726, lng: 88.3639 },
    population: 4496694,
    area: 205,
    timezone: "Asia/Kolkata",
    trafficDensity: "high",
    intersections: 87,
    averageSpeed: 30,
    peakHours: ["08:00-10:00", "17:00-19:00"],
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    coordinates: { lat: 17.385, lng: 78.4867 },
    population: 6809970,
    area: 650,
    timezone: "Asia/Kolkata",
    trafficDensity: "medium",
    intersections: 112,
    averageSpeed: 38,
    peakHours: ["08:30-10:00", "18:00-19:30"],
  },
  {
    id: "pune",
    name: "Pune",
    state: "Maharashtra",
    coordinates: { lat: 18.5204, lng: 73.8567 },
    population: 3124458,
    area: 331.26,
    timezone: "Asia/Kolkata",
    trafficDensity: "medium",
    intersections: 89,
    averageSpeed: 40,
    peakHours: ["08:00-09:30", "18:30-20:00"],
  },
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    state: "Gujarat",
    coordinates: { lat: 23.0225, lng: 72.5714 },
    population: 5633927,
    area: 505,
    timezone: "Asia/Kolkata",
    trafficDensity: "medium",
    intersections: 76,
    averageSpeed: 42,
    peakHours: ["08:30-10:00", "18:00-19:30"],
  },
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    coordinates: { lat: 26.9124, lng: 75.7873 },
    population: 3046163,
    area: 484.6,
    timezone: "Asia/Kolkata",
    trafficDensity: "medium",
    intersections: 65,
    averageSpeed: 45,
    peakHours: ["08:00-09:30", "17:30-19:00"],
  },
  {
    id: "lucknow",
    name: "Lucknow",
    state: "Uttar Pradesh",
    coordinates: { lat: 26.8467, lng: 80.9462 },
    population: 2817105,
    area: 402,
    timezone: "Asia/Kolkata",
    trafficDensity: "low",
    intersections: 54,
    averageSpeed: 48,
    peakHours: ["08:30-09:30", "17:00-18:30"],
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const state = searchParams.get("state")
  const trafficDensity = searchParams.get("trafficDensity")
  const cityId = searchParams.get("id")

  let filteredCities = indianCities

  if (cityId) {
    filteredCities = filteredCities.filter((city) => city.id === cityId)
  }

  if (state) {
    filteredCities = filteredCities.filter((city) => city.state.toLowerCase() === state.toLowerCase())
  }

  if (trafficDensity) {
    filteredCities = filteredCities.filter((city) => city.trafficDensity === trafficDensity)
  }

  return NextResponse.json({
    success: true,
    data: filteredCities,
    total: filteredCities.length,
    timestamp: new Date().toISOString(),
  })
}
