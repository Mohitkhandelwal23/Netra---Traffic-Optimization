// Real-time communication utilities
// WebSocket and Server-Sent Events simulation

interface RealtimeClient {
  id: string
  lastSeen: Date
  subscriptions: Set<string>
}

interface RealtimeMessage {
  type: string
  channel: string
  data: any
  timestamp: Date
}

class RealtimeService {
  private clients: Map<string, RealtimeClient> = new Map()
  private messageHistory: RealtimeMessage[] = []
  private maxHistorySize = 1000

  // Simulate WebSocket connection
  connect(clientId: string): void {
    this.clients.set(clientId, {
      id: clientId,
      lastSeen: new Date(),
      subscriptions: new Set(),
    })

    console.log("[v0] Realtime client connected:", clientId)
  }

  disconnect(clientId: string): void {
    this.clients.delete(clientId)
    console.log("[v0] Realtime client disconnected:", clientId)
  }

  // Subscribe to channels
  subscribe(clientId: string, channel: string): void {
    const client = this.clients.get(clientId)
    if (client) {
      client.subscriptions.add(channel)
      client.lastSeen = new Date()
      console.log("[v0] Client subscribed to channel:", clientId, channel)
    }
  }

  unsubscribe(clientId: string, channel: string): void {
    const client = this.clients.get(clientId)
    if (client) {
      client.subscriptions.delete(channel)
      console.log("[v0] Client unsubscribed from channel:", clientId, channel)
    }
  }

  // Broadcast messages to subscribers
  broadcast(channel: string, type: string, data: any): void {
    const message: RealtimeMessage = {
      type,
      channel,
      data,
      timestamp: new Date(),
    }

    // Add to message history
    this.messageHistory.push(message)
    if (this.messageHistory.length > this.maxHistorySize) {
      this.messageHistory.shift()
    }

    // Find subscribers and simulate message delivery
    const subscribers = Array.from(this.clients.entries())
      .filter(([_, client]) => client.subscriptions.has(channel))
      .map(([id, _]) => id)

    console.log("[v0] Broadcasting to channel:", channel, "subscribers:", subscribers.length)

    // In a real implementation, this would send via WebSocket
    // For simulation, we'll store the message for polling
  }

  // Get recent messages for a channel (for polling fallback)
  getRecentMessages(channel: string, since?: Date): RealtimeMessage[] {
    const cutoff = since || new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago

    return this.messageHistory
      .filter((msg) => msg.channel === channel && msg.timestamp > cutoff)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  }

  // Simulate real-time traffic data updates
  startTrafficDataSimulation(): void {
    setInterval(() => {
      const trafficUpdate = {
        intersectionId: Math.floor(Math.random() * 10) + 1,
        vehicleCount: Math.floor(Math.random() * 50) + 10,
        pedestrianCount: Math.floor(Math.random() * 20),
        trafficDensity: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
        averageSpeed: Math.random() * 60 + 20,
        congestionLevel: Math.floor(Math.random() * 100),
        timestamp: new Date().toISOString(),
      }

      this.broadcast("traffic-updates", "traffic-data", trafficUpdate)
    }, 2000) // Update every 2 seconds

    // Simulate violation detection
    setInterval(() => {
      const violation = {
        intersectionId: Math.floor(Math.random() * 10) + 1,
        vehicleNumber: `MH${Math.floor(Math.random() * 99)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9999)}`,
        violationType: ["red_light", "speeding", "wrong_lane", "no_helmet"][Math.floor(Math.random() * 4)],
        confidenceScore: 0.7 + Math.random() * 0.3,
        timestamp: new Date().toISOString(),
      }

      this.broadcast("violations", "violation-detected", violation)
    }, 10000) // Violation every 10 seconds

    console.log("[v0] Traffic data simulation started")
  }

  // Get connection status
  getConnectionStatus(): { totalClients: number; activeChannels: string[] } {
    const activeChannels = new Set<string>()

    this.clients.forEach((client) => {
      client.subscriptions.forEach((channel) => activeChannels.add(channel))
    })

    return {
      totalClients: this.clients.size,
      activeChannels: Array.from(activeChannels),
    }
  }
}

export const realtimeService = new RealtimeService()

// Start simulation when module loads
realtimeService.startTrafficDataSimulation()

// Server-Sent Events helper
export function createSSEResponse(clientId: string, channel: string) {
  const encoder = new TextEncoder()

  let isConnected = true
  realtimeService.connect(clientId)
  realtimeService.subscribe(clientId, channel)

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const data = `data: ${JSON.stringify({ type: "connected", channel })}\n\n`
      controller.enqueue(encoder.encode(data))

      // Poll for new messages
      const interval = setInterval(() => {
        if (!isConnected) {
          clearInterval(interval)
          return
        }

        const messages = realtimeService.getRecentMessages(channel, new Date(Date.now() - 3000))

        messages.forEach((message) => {
          const data = `data: ${JSON.stringify(message)}\n\n`
          controller.enqueue(encoder.encode(data))
        })
      }, 1000)

      // Cleanup on disconnect
      setTimeout(() => {
        isConnected = false
        realtimeService.disconnect(clientId)
        controller.close()
      }, 300000) // 5 minutes timeout
    },

    cancel() {
      isConnected = false
      realtimeService.disconnect(clientId)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  })
}
