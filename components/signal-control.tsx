"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Clock, Settings, Play, Pause, RotateCcw, AlertTriangle, CheckCircle, Circle } from "lucide-react"

export function SignalControl() {
  const [autoMode, setAutoMode] = useState(true)
  const [selectedSignal, setSelectedSignal] = useState("signal-1")

  const [signalTimings, setSignalTimings] = useState({
    "signal-1": { green: 45, yellow: 5, red: 30, cycle: 80 },
    "signal-2": { green: 60, yellow: 5, red: 25, cycle: 90 },
    "signal-3": { green: 40, yellow: 5, red: 35, cycle: 80 },
    "signal-4": { green: 50, yellow: 5, red: 30, cycle: 85 },
  })

  const signals = [
    { id: "signal-1", name: "Main St & 5th Ave", status: "active", phase: "green", timeLeft: 23 },
    { id: "signal-2", name: "Park Ave & 2nd St", status: "active", phase: "red", timeLeft: 15 },
    { id: "signal-3", name: "Broadway & Oak", status: "maintenance", phase: "yellow", timeLeft: 3 },
    { id: "signal-4", name: "1st St & Elm", status: "active", phase: "green", timeLeft: 38 },
  ]

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "green":
        return "text-accent"
      case "yellow":
        return "text-chart-2"
      case "red":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-accent" />
      case "maintenance":
        return <AlertTriangle className="h-4 w-4 text-chart-2" />
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Control Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Signal Control Center
              </CardTitle>
              <CardDescription>Manage traffic signal timing and coordination</CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Auto Mode</span>
                <Switch checked={autoMode} onCheckedChange={setAutoMode} />
              </div>
              <Badge variant={autoMode ? "default" : "secondary"}>{autoMode ? "AI Optimized" : "Manual Control"}</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signal List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Active Signals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {signals.map((signal) => (
              <div
                key={signal.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedSignal === signal.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                }`}
                onClick={() => setSelectedSignal(signal.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(signal.status)}
                    <span className="font-medium text-sm">{signal.name}</span>
                  </div>
                  <Badge variant="outline" className={getPhaseColor(signal.phase)}>
                    {signal.phase.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Time left: {signal.timeLeft}s</span>
                  <span>Cycle: {signalTimings[signal.id]?.cycle}s</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Signal Control Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Signal Configuration
            </CardTitle>
            <CardDescription>{signals.find((s) => s.id === selectedSignal)?.name || "Select a signal"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="timing" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="timing">Timing</TabsTrigger>
                <TabsTrigger value="coordination">Coordination</TabsTrigger>
                <TabsTrigger value="emergency">Emergency</TabsTrigger>
              </TabsList>

              <TabsContent value="timing" className="space-y-6 mt-6">
                {selectedSignal && signalTimings[selectedSignal] && (
                  <>
                    {/* Green Phase */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium flex items-center">
                          <div className="w-3 h-3 rounded-full bg-accent mr-2"></div>
                          Green Phase
                        </label>
                        <span className="text-sm text-muted-foreground">{signalTimings[selectedSignal].green}s</span>
                      </div>
                      <Slider
                        value={[signalTimings[selectedSignal].green]}
                        onValueChange={(value) =>
                          setSignalTimings((prev) => ({
                            ...prev,
                            [selectedSignal]: { ...prev[selectedSignal], green: value[0] },
                          }))
                        }
                        max={120}
                        min={15}
                        step={5}
                        disabled={autoMode}
                        className="w-full"
                      />
                    </div>

                    {/* Yellow Phase */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium flex items-center">
                          <div className="w-3 h-3 rounded-full bg-chart-2 mr-2"></div>
                          Yellow Phase
                        </label>
                        <span className="text-sm text-muted-foreground">{signalTimings[selectedSignal].yellow}s</span>
                      </div>
                      <Slider
                        value={[signalTimings[selectedSignal].yellow]}
                        onValueChange={(value) =>
                          setSignalTimings((prev) => ({
                            ...prev,
                            [selectedSignal]: { ...prev[selectedSignal], yellow: value[0] },
                          }))
                        }
                        max={10}
                        min={3}
                        step={1}
                        disabled={autoMode}
                        className="w-full"
                      />
                    </div>

                    {/* Red Phase */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium flex items-center">
                          <div className="w-3 h-3 rounded-full bg-destructive mr-2"></div>
                          Red Phase
                        </label>
                        <span className="text-sm text-muted-foreground">{signalTimings[selectedSignal].red}s</span>
                      </div>
                      <Slider
                        value={[signalTimings[selectedSignal].red]}
                        onValueChange={(value) =>
                          setSignalTimings((prev) => ({
                            ...prev,
                            [selectedSignal]: { ...prev[selectedSignal], red: value[0] },
                          }))
                        }
                        max={90}
                        min={10}
                        step={5}
                        disabled={autoMode}
                        className="w-full"
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <Button className="flex-1" disabled={autoMode}>
                        <Play className="h-4 w-4 mr-2" />
                        Apply Changes
                      </Button>
                      <Button variant="outline" disabled={autoMode}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="coordination" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Progressive Timing</p>
                      <p className="text-xs text-muted-foreground">Coordinate with adjacent signals</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Peak Hour Mode</p>
                      <p className="text-xs text-muted-foreground">Extended green for main routes</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Pedestrian Priority</p>
                      <p className="text-xs text-muted-foreground">Extended crossing times</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="emergency" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <Button variant="destructive" className="w-full">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Emergency Override
                  </Button>

                  <Button variant="outline" className="w-full bg-transparent">
                    <Pause className="h-4 w-4 mr-2" />
                    Flash Mode
                  </Button>

                  <Button variant="outline" className="w-full bg-transparent">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Default
                  </Button>

                  <div className="p-4 bg-destructive/10 rounded-lg">
                    <p className="text-sm font-medium text-destructive mb-2">Emergency Protocols</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Ambulance preemption: 15s clearance</li>
                      <li>• Fire truck priority: 20s clearance</li>
                      <li>• Police override: Immediate control</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
