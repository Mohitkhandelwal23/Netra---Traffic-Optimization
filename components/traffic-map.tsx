"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Navigation, Car, AlertTriangle, Users, Loader2, ZoomIn, ZoomOut, Satellite, Map } from "lucide-react"

interface OSMNode {
  id: string
  lat: number
  lon: number
  tags?: Record<string, string>
}

interface OSMWay {
  id: string
  nodes: string[]
  tags?: Record<string, string>
}

interface OSMData {
  nodes: OSMNode[]
  ways: OSMWay[]
}

interface City {
  name: string
  lat: number
  lon: number
  country: string
  trafficDensity: "high" | "medium" | "low"
}

const INDIAN_CITIES: City[] = [
  { name: "Mumbai", lat: 19.076, lon: 72.8777, country: "India", trafficDensity: "high" },
  { name: "Delhi", lat: 28.6139, lon: 77.209, country: "India", trafficDensity: "high" },
  { name: "Bangalore", lat: 12.9716, lon: 77.5946, country: "India", trafficDensity: "high" },
  { name: "Chennai", lat: 13.0827, lon: 80.2707, country: "India", trafficDensity: "high" },
  { name: "Kolkata", lat: 22.5726, lon: 88.3639, country: "India", trafficDensity: "high" },
  { name: "Hyderabad", lat: 17.385, lon: 78.4867, country: "India", trafficDensity: "medium" },
  { name: "Pune", lat: 18.5204, lon: 73.8567, country: "India", trafficDensity: "medium" },
  { name: "Ahmedabad", lat: 23.0225, lon: 72.5714, country: "India", trafficDensity: "medium" },
  { name: "Jaipur", lat: 26.9124, lon: 75.7873, country: "India", trafficDensity: "medium" },
  { name: "Surat", lat: 21.1702, lon: 72.8311, country: "India", trafficDensity: "medium" },
]

export function TrafficMap() {
  const [selectedIntersection, setSelectedIntersection] = useState<string | null>(null)
  const [osmData, setOsmData] = useState<OSMData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState<City>(INDIAN_CITIES[0])
  const [mapCenter, setMapCenter] = useState({ lat: INDIAN_CITIES[0].lat, lon: INDIAN_CITIES[0].lon })
  const [zoomLevel, setZoomLevel] = useState(0.01)
  const [isSatelliteView, setIsSatelliteView] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tileCanvasRef = useRef<HTMLCanvasElement>(null)

  const fetchOSMData = async (bbox: { minLat: number; minLon: number; maxLat: number; maxLon: number }) => {
    try {
      setLoading(true)
      const query = `
        [out:json][timeout:30];
        (
          way["highway"~"^(motorway|trunk|primary|secondary|tertiary|residential|service)$"](${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon});
          node["highway"="traffic_signals"](${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon});
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
      })

      if (!response.ok) {
        throw new Error("Failed to fetch OSM data")
      }

      const data = await response.json()

      const nodes: OSMNode[] = data.elements
        .filter((el: any) => el.type === "node")
        .map((node: any) => ({
          id: node.id.toString(),
          lat: node.lat,
          lon: node.lon,
          tags: node.tags || {},
        }))

      const ways: OSMWay[] = data.elements
        .filter((el: any) => el.type === "way")
        .map((way: any) => ({
          id: way.id.toString(),
          nodes: way.nodes?.map((n: number) => n.toString()) || [],
          tags: way.tags || {},
        }))

      setOsmData({ nodes, ways })
    } catch (error) {
      console.error("Error fetching OSM data:", error)
      setOsmData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const bbox = {
      minLat: mapCenter.lat - zoomLevel,
      minLon: mapCenter.lon - zoomLevel,
      maxLat: mapCenter.lat + zoomLevel,
      maxLon: mapCenter.lon + zoomLevel,
    }
    fetchOSMData(bbox)
  }, [mapCenter, zoomLevel])

  const latLonToCanvas = (lat: number, lon: number, canvasWidth: number, canvasHeight: number) => {
    const bbox = {
      minLat: mapCenter.lat - zoomLevel,
      minLon: mapCenter.lon - zoomLevel,
      maxLat: mapCenter.lat + zoomLevel,
      maxLon: mapCenter.lon + zoomLevel,
    }

    const x = ((lon - bbox.minLon) / (bbox.maxLon - bbox.minLon)) * canvasWidth
    const y = ((bbox.maxLat - lat) / (bbox.maxLat - bbox.minLat)) * canvasHeight

    return { x, y }
  }

  const loadMapTiles = async () => {
    if (!tileCanvasRef.current) return

    const canvas = tileCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const tileZoom = Math.max(10, Math.min(18, Math.round(Math.log2(1 / zoomLevel) + 8)))
    const centerTileX = Math.floor(((mapCenter.lon + 180) / 360) * Math.pow(2, tileZoom))
    const centerTileY = Math.floor(
      ((1 -
        Math.log(Math.tan((mapCenter.lat * Math.PI) / 180) + 1 / Math.cos((mapCenter.lat * Math.PI) / 180)) / Math.PI) /
        2) *
        Math.pow(2, tileZoom),
    )

    const tilesX = Math.ceil(canvas.width / 256) + 1
    const tilesY = Math.ceil(canvas.height / 256) + 1

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let x = -Math.floor(tilesX / 2); x <= Math.floor(tilesX / 2); x++) {
      for (let y = -Math.floor(tilesY / 2); y <= Math.floor(tilesY / 2); y++) {
        const tileX = centerTileX + x
        const tileY = centerTileY + y

        if (tileX < 0 || tileY < 0 || tileX >= Math.pow(2, tileZoom) || tileY >= Math.pow(2, tileZoom)) continue

        const img = new Image()
        img.crossOrigin = "anonymous"

        const tileUrl = isSatelliteView
          ? `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${tileZoom}/${tileY}/${tileX}`
          : `https://tile.openstreetmap.org/${tileZoom}/${tileX}/${tileY}.png`

        img.onload = () => {
          const drawX =
            canvas.width / 2 + x * 256 - (((mapCenter.lon + 180) / 360) * Math.pow(2, tileZoom) - centerTileX) * 256
          const drawY =
            canvas.height / 2 +
            y * 256 -
            (((1 -
              Math.log(Math.tan((mapCenter.lat * Math.PI) / 180) + 1 / Math.cos((mapCenter.lat * Math.PI) / 180)) /
                Math.PI) /
              2) *
              Math.pow(2, tileZoom) -
              centerTileY) *
              256

          ctx.drawImage(img, drawX, drawY, 256, 256)
        }

        img.src = tileUrl
      }
    }
  }

  useEffect(() => {
    loadMapTiles()
  }, [mapCenter, zoomLevel, isSatelliteView])

  useEffect(() => {
    if (!osmData || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    if (!isSatelliteView) {
      osmData.ways.forEach((way) => {
        if (way.nodes.length < 2) return

        const highway = way.tags?.highway
        let strokeStyle = "#64748b"
        let lineWidth = 2

        switch (highway) {
          case "motorway":
          case "trunk":
            strokeStyle = "#ef4444"
            lineWidth = 4
            break
          case "primary":
            strokeStyle = "#f97316"
            lineWidth = 3
            break
          case "secondary":
            strokeStyle = "#eab308"
            lineWidth = 2.5
            break
          case "tertiary":
            strokeStyle = "#22c55e"
            lineWidth = 2
            break
          default:
            strokeStyle = "#64748b"
            lineWidth = 1.5
        }

        ctx.strokeStyle = strokeStyle
        ctx.lineWidth = lineWidth
        ctx.beginPath()

        let firstPoint = true
        way.nodes.forEach((nodeId) => {
          const node = osmData.nodes.find((n) => n.id === nodeId)
          if (!node) return

          const { x, y } = latLonToCanvas(node.lat, node.lon, canvas.width, canvas.height)

          if (firstPoint) {
            ctx.moveTo(x, y)
            firstPoint = false
          } else {
            ctx.lineTo(x, y)
          }
        })

        ctx.stroke()
      })
    }

    osmData.nodes.forEach((node) => {
      if (node.tags?.highway === "traffic_signals") {
        const { x, y } = latLonToCanvas(node.lat, node.lon, canvas.width, canvas.height)

        ctx.fillStyle = "#10b981"
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fill()

        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 1
        ctx.stroke()
      }
    })
  }, [osmData, mapCenter, zoomLevel, isSatelliteView])

  const generateIntersections = () => {
    const baseCount = selectedCity.trafficDensity === "high" ? 8 : selectedCity.trafficDensity === "medium" ? 5 : 3
    const intersections = []

    for (let i = 0; i < baseCount; i++) {
      const latOffset = (Math.random() - 0.5) * zoomLevel * 1.5
      const lonOffset = (Math.random() - 0.5) * zoomLevel * 1.5

      const statuses = ["normal", "congested", "emergency", "maintenance"]
      const weights = selectedCity.trafficDensity === "high" ? [0.3, 0.5, 0.1, 0.1] : [0.6, 0.2, 0.1, 0.1]

      let status = "normal"
      const rand = Math.random()
      let cumulative = 0
      for (let j = 0; j < statuses.length; j++) {
        cumulative += weights[j]
        if (rand <= cumulative) {
          status = statuses[j]
          break
        }
      }

      intersections.push({
        id: `int-${i + 1}`,
        lat: mapCenter.lat + latOffset,
        lon: mapCenter.lon + lonOffset,
        status,
        vehicles: status === "maintenance" ? 0 : Math.floor(Math.random() * 40) + 5,
        waitTime:
          status === "maintenance"
            ? 0
            : status === "emergency"
              ? Math.floor(Math.random() * 30) + 10
              : Math.floor(Math.random() * 120) + 30,
      })
    }

    return intersections
  }

  const intersections = generateIntersections()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-accent"
      case "congested":
        return "bg-destructive"
      case "emergency":
        return "bg-primary"
      case "maintenance":
        return "bg-secondary"
      default:
        return "bg-muted"
    }
  }

  const handleCityChange = (cityName: string) => {
    const city = INDIAN_CITIES.find((c) => c.name === cityName)
    if (city) {
      setSelectedCity(city)
      setMapCenter({ lat: city.lat, lon: city.lon })
      setSelectedIntersection(null)
    }
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.max(prev * 0.7, 0.002))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.min(prev * 1.4, 0.05))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Navigation className="h-5 w-5 mr-2" />
            Real-Time Traffic Network - {selectedCity.name}
            {loading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
          </CardTitle>
          <CardDescription>
            Live OpenStreetMap integration for Indian cities - Click intersections for details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <Select value={selectedCity.name} onValueChange={handleCityChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Indian City" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_CITIES.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name} ({city.trafficDensity} traffic)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={isSatelliteView ? "default" : "outline"}
                onClick={() => setIsSatelliteView(!isSatelliteView)}
              >
                {isSatelliteView ? <Map className="h-4 w-4" /> : <Satellite className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="relative h-96 bg-muted/20 rounded-lg overflow-hidden">
            <canvas ref={tileCanvasRef} className="absolute inset-0 w-full h-full" />

            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full cursor-move"
              style={{
                background: isSatelliteView
                  ? "transparent"
                  : "linear-gradient(135deg, hsl(var(--muted)/0.1), hsl(var(--muted)/0.3))",
              }}
            />

            {intersections.map((intersection) => {
              const canvasRect = canvasRef.current?.getBoundingClientRect()
              if (!canvasRect) return null

              const { x, y } = latLonToCanvas(intersection.lat, intersection.lon, canvasRect.width, canvasRect.height)

              return (
                <button
                  key={intersection.id}
                  className={`absolute w-4 h-4 rounded-full ${getStatusColor(intersection.status)} 
                    border-2 border-background transform -translate-x-2 -translate-y-2 
                    hover:scale-125 transition-transform cursor-pointer z-10
                    ${selectedIntersection === intersection.id ? "ring-2 ring-primary" : ""}`}
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                  }}
                  onClick={() => setSelectedIntersection(intersection.id)}
                />
              )
            })}

            <div className="absolute inset-0 pointer-events-none">
              {[
                ...Array(
                  selectedCity.trafficDensity === "high" ? 12 : selectedCity.trafficDensity === "medium" ? 8 : 4,
                ),
              ].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-primary/60 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 90 + 5}%`,
                    top: `${Math.random() * 90 + 5}%`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>

            <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3">
              <div className="text-sm font-medium">{selectedCity.name}</div>
              <div className="text-xs text-muted-foreground">Traffic: {selectedCity.trafficDensity} density</div>
              <div className="text-xs text-muted-foreground">Zoom: {((1 / zoomLevel) * 0.01).toFixed(1)}x</div>
              <div className="text-xs text-muted-foreground">View: {isSatelliteView ? "Satellite" : "Map"}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-accent"></div>
              <span className="text-sm text-muted-foreground">Normal Flow</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span className="text-sm text-muted-foreground">Congested</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm text-muted-foreground">Emergency</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-secondary"></div>
              <span className="text-sm text-muted-foreground">Maintenance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm text-muted-foreground">Traffic Signals</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Intersection Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedIntersection ? (
            <div className="space-y-4">
              {(() => {
                const intersection = intersections.find((i) => i.id === selectedIntersection)
                if (!intersection) return null

                return (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Junction {intersection.id.toUpperCase()}</h3>
                      <Badge
                        variant={
                          intersection.status === "normal"
                            ? "default"
                            : intersection.status === "congested"
                              ? "destructive"
                              : intersection.status === "emergency"
                                ? "default"
                                : "secondary"
                        }
                      >
                        {intersection.status}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">Vehicles</span>
                        </div>
                        <span className="font-medium">{intersection.vehicles}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">Wait Time</span>
                        </div>
                        <span className="font-medium">{intersection.waitTime}s</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">Pedestrians</span>
                        </div>
                        <span className="font-medium">{Math.floor(Math.random() * 20) + 5}</span>
                      </div>
                    </div>

                    <div className="pt-4 space-y-2">
                      <Button className="w-full" size="sm">
                        Optimize Timing
                      </Button>
                      <Button className="w-full bg-transparent" variant="outline" size="sm">
                        View Camera Feed
                      </Button>
                    </div>
                  </>
                )
              })()}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select an intersection on the map to view details</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
