// Database connection and query utilities
// Simulated PostgreSQL database operations

interface DatabaseConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
}

class DatabaseConnection {
  private config: DatabaseConfig
  private isConnected = false

  constructor() {
    // Simulated database configuration
    this.config = {
      host: process.env.DB_HOST || "localhost",
      port: Number.parseInt(process.env.DB_PORT || "5432"),
      database: process.env.DB_NAME || "netra_traffic",
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "password",
    }
  }

  async connect(): Promise<void> {
    // Simulate database connection
    console.log("[v0] Connecting to PostgreSQL database...")
    await new Promise((resolve) => setTimeout(resolve, 100))
    this.isConnected = true
    console.log("[v0] Database connected successfully")
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.isConnected) {
      await this.connect()
    }

    console.log("[v0] Executing query:", sql.substring(0, 100) + "...")

    // Simulate database query execution
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Return mock data based on query type
    return this.getMockData<T>(sql, params)
  }

  private getMockData<T>(sql: string, params: any[]): T[] {
    const sqlLower = sql.toLowerCase()

    if (sqlLower.includes("select * from users")) {
      return [
        {
          id: 1,
          email: "admin@netra.ai",
          role: "admin",
          name: "System Administrator",
          created_at: new Date().toISOString(),
        },
      ] as T[]
    }

    if (sqlLower.includes("select * from cities")) {
      return [
        {
          id: 1,
          name: "Mumbai",
          state: "Maharashtra",
          latitude: 19.076,
          longitude: 72.8777,
          traffic_density_score: 95,
        },
        { id: 2, name: "Delhi", state: "Delhi", latitude: 28.7041, longitude: 77.1025, traffic_density_score: 92 },
        {
          id: 3,
          name: "Bangalore",
          state: "Karnataka",
          latitude: 12.9716,
          longitude: 77.5946,
          traffic_density_score: 88,
        },
      ] as T[]
    }

    if (sqlLower.includes("select * from traffic_intersections")) {
      return Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        city_id: Math.floor(Math.random() * 3) + 1,
        name: `Junction ${i + 1}`,
        latitude: 19.076 + (Math.random() - 0.5) * 0.1,
        longitude: 72.8777 + (Math.random() - 0.5) * 0.1,
        signal_timing_north: 30,
        signal_timing_south: 30,
        signal_timing_east: 25,
        signal_timing_west: 25,
        current_phase: ["north", "south", "east", "west"][Math.floor(Math.random() * 4)],
        is_active: true,
      })) as T[]
    }

    if (sqlLower.includes("insert") || sqlLower.includes("update") || sqlLower.includes("delete")) {
      return [{ success: true, affected_rows: 1 }] as T[]
    }

    return [] as T[]
  }

  async disconnect(): Promise<void> {
    this.isConnected = false
    console.log("[v0] Database disconnected")
  }
}

export const db = new DatabaseConnection()

// Database query helpers
export class DatabaseQueries {
  // User authentication queries
  static async getUserByEmail(email: string) {
    return await db.query(
      "SELECT id, email, password_hash, role, name FROM users WHERE email = $1 AND is_active = true",
      [email],
    )
  }

  static async createUser(userData: { email: string; password_hash: string; role: string; name: string }) {
    return await db.query(
      "INSERT INTO users (email, password_hash, role, name) VALUES ($1, $2, $3, $4) RETURNING id, email, role, name",
      [userData.email, userData.password_hash, userData.role, userData.name],
    )
  }

  // Traffic data queries
  static async getTrafficIntersections(cityId?: number) {
    const sql = cityId
      ? "SELECT * FROM traffic_intersections WHERE city_id = $1 AND is_active = true"
      : "SELECT * FROM traffic_intersections WHERE is_active = true"
    const params = cityId ? [cityId] : []
    return await db.query(sql, params)
  }

  static async updateSignalTiming(intersectionId: number, timings: any) {
    return await db.query(
      "UPDATE traffic_intersections SET signal_timing_north = $1, signal_timing_south = $2, signal_timing_east = $3, signal_timing_west = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5",
      [timings.north, timings.south, timings.east, timings.west, intersectionId],
    )
  }

  static async insertTrafficData(data: any) {
    return await db.query(
      "INSERT INTO traffic_data (intersection_id, vehicle_count, pedestrian_count, traffic_density, average_speed, congestion_level, weather_condition) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        data.intersection_id,
        data.vehicle_count,
        data.pedestrian_count,
        data.traffic_density,
        data.average_speed,
        data.congestion_level,
        data.weather_condition,
      ],
    )
  }

  static async getTrafficAnalytics(intersectionId?: number, timeRange?: string) {
    const sql = intersectionId
      ? "SELECT * FROM traffic_data WHERE intersection_id = $1 AND timestamp >= NOW() - INTERVAL $2 ORDER BY timestamp DESC"
      : "SELECT * FROM traffic_data WHERE timestamp >= NOW() - INTERVAL $1 ORDER BY timestamp DESC"
    const params = intersectionId ? [intersectionId, timeRange || "24 hours"] : [timeRange || "24 hours"]
    return await db.query(sql, params)
  }

  // Violation queries
  static async insertViolation(violation: any) {
    return await db.query(
      "INSERT INTO traffic_violations (intersection_id, vehicle_number, violation_type, confidence_score, image_url, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [
        violation.intersection_id,
        violation.vehicle_number,
        violation.violation_type,
        violation.confidence_score,
        violation.image_url,
        violation.created_by,
      ],
    )
  }

  static async getViolations(intersectionId?: number) {
    const sql = intersectionId
      ? "SELECT * FROM traffic_violations WHERE intersection_id = $1 ORDER BY timestamp DESC LIMIT 100"
      : "SELECT * FROM traffic_violations ORDER BY timestamp DESC LIMIT 100"
    const params = intersectionId ? [intersectionId] : []
    return await db.query(sql, params)
  }
}
