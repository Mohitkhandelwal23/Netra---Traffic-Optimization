"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert } from "@/components/ui/alert"
import { AlertTriangle, Siren, Shield, Phone, Navigation, Clock, CheckCircle, X } from "lucide-react"

export function EmergencyPanel() {
  const [activeEmergencies, setActiveEmergencies] = useState([
    {
      id: "emg-001",
      type: "ambulance",
      location: "Main St & 5th Ave",
      eta: "2 min",
      priority: "high",
      status: "active",
    },
    {
      id: "emg-002",
      type: "fire",
      location: "Park Ave & 2nd St",
      eta: "4 min",
      priority: "critical",
      status: "active",
    },
  ])

  const emergencyHistory = [
    {
      id: "emg-h001",
      type: "police",
      location: "Broadway & Oak",
      timestamp: "14:23",
      duration: "3m 45s",
      status: "completed",
    },
    {
      id: "emg-h002",
      type: "ambulance",
      location: "1st St & Elm",
      timestamp: "13:45",
      duration: "2m 30s",
      status: "completed",
    },
  ]

  const getEmergencyIcon = (type: string) => {
    switch (type) {
      case "ambulance":
        return <Phone className="h-4 w-4" />
      case "fire":
        return <AlertTriangle className="h-4 w-4" />
      case "police":
        return <Shield className="h-4 w-4" />
      default:
        return <Siren className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive"
      case "high":
        return "default"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  const clearEmergency = (id: string) => {
    setActiveEmergencies((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Emergency Status Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-destructive">
                <Siren className="h-5 w-5 mr-2" />
                Emergency Response Center
              </CardTitle>
              <CardDescription>Real-time emergency vehicle coordination and signal preemption</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="destructive" className="animate-pulse">
                {activeEmergencies.length} Active
              </Badge>
              <Button variant="destructive" size="sm">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Emergency Override
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Active Emergencies */}
      {activeEmergencies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
              Active Emergency Responses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeEmergencies.map((emergency) => (
              <Alert key={emergency.id} className="border-destructive/50">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getEmergencyIcon(emergency.type)}
                      <span className="font-semibold capitalize">{emergency.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Navigation className="h-4 w-4 text-muted-foreground" />
                      <span>{emergency.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>ETA: {emergency.eta}</span>
                    </div>
                    <Badge variant={getPriorityColor(emergency.priority)}>{emergency.priority}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => clearEmergency(emergency.id)}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => clearEmergency(emergency.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Controls</CardTitle>
            <CardDescription>Manual emergency response and signal override</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="destructive" className="h-16 flex-col">
                <Phone className="h-6 w-6 mb-1" />
                <span className="text-xs">Ambulance</span>
              </Button>
              <Button variant="destructive" className="h-16 flex-col">
                <AlertTriangle className="h-6 w-6 mb-1" />
                <span className="text-xs">Fire Truck</span>
              </Button>
              <Button variant="destructive" className="h-16 flex-col">
                <Shield className="h-6 w-6 mb-1" />
                <span className="text-xs">Police</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col bg-transparent">
                <Siren className="h-6 w-6 mb-1" />
                <span className="text-xs">Other</span>
              </Button>
            </div>

            <div className="space-y-3 pt-4">
              <Button className="w-full bg-transparent" variant="outline">
                <Navigation className="h-4 w-4 mr-2" />
                Clear All Routes
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                Reset Signal Timing
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emergency History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Emergency Responses</CardTitle>
            <CardDescription>Completed emergency vehicle assists today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emergencyHistory.map((emergency) => (
                <div key={emergency.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getEmergencyIcon(emergency.type)}
                    <div>
                      <p className="font-medium text-sm capitalize">{emergency.type}</p>
                      <p className="text-xs text-muted-foreground">{emergency.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{emergency.timestamp}</p>
                    <p className="text-xs text-muted-foreground">{emergency.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Protocols */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Response Protocols</CardTitle>
          <CardDescription>Automated response procedures for different emergency types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Phone className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Ambulance Protocol</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 15-second signal clearance</li>
                <li>• Priority green wave</li>
                <li>• Route optimization</li>
                <li>• Traffic diversion alerts</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h4 className="font-semibold">Fire Truck Protocol</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 20-second signal clearance</li>
                <li>• Multi-lane coordination</li>
                <li>• Intersection blocking</li>
                <li>• Emergency broadcast</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="h-5 w-5 text-accent" />
                <h4 className="font-semibold">Police Protocol</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Immediate signal override</li>
                <li>• Pursuit route clearing</li>
                <li>• Intersection lockdown</li>
                <li>• Backup coordination</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
