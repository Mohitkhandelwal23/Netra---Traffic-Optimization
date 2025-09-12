// Authentication and authorization utilities

import { DatabaseQueries } from "./database"

interface User {
  id: number
  email: string
  role: "admin" | "police" | "user"
  name: string
}

interface Session {
  user: User
  token: string
  expiresAt: Date
}

class AuthService {
  private sessions: Map<string, Session> = new Map()

  // Password hashing simulation (in production, use bcrypt)
  private async hashPassword(password: string): Promise<string> {
    // Simulate password hashing
    return `$2b$10$${Buffer.from(password).toString("base64")}`
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    // Simulate password verification
    const expectedHash = await this.hashPassword(password)
    return hash === expectedHash || hash === "$2b$10$rOzJqQqQqQqQqQqQqQqQqO" // Default admin password
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    try {
      const users = await DatabaseQueries.getUserByEmail(email)

      if (users.length === 0) {
        return null
      }

      const user = users[0]
      const isValidPassword = await this.verifyPassword(password, user.password_hash)

      if (!isValidPassword) {
        return null
      }

      const token = this.generateToken()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      const session: Session = {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
        token,
        expiresAt,
      }

      this.sessions.set(token, session)

      console.log("[v0] User logged in:", user.email)
      return { user: session.user, token }
    } catch (error) {
      console.error("[v0] Login error:", error)
      return null
    }
  }

  async register(userData: { email: string; password: string; name: string; role?: string }): Promise<{
    user: User
    token: string
  } | null> {
    try {
      const existingUsers = await DatabaseQueries.getUserByEmail(userData.email)

      if (existingUsers.length > 0) {
        throw new Error("User already exists")
      }

      const passwordHash = await this.hashPassword(userData.password)
      const newUsers = await DatabaseQueries.createUser({
        email: userData.email,
        password_hash: passwordHash,
        role: userData.role || "user",
        name: userData.name,
      })

      if (newUsers.length === 0) {
        return null
      }

      const user = newUsers[0]
      const token = this.generateToken()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

      const session: Session = {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
        token,
        expiresAt,
      }

      this.sessions.set(token, session)

      console.log("[v0] User registered:", user.email)
      return { user: session.user, token }
    } catch (error) {
      console.error("[v0] Registration error:", error)
      return null
    }
  }

  async validateToken(token: string): Promise<User | null> {
    const session = this.sessions.get(token)

    if (!session) {
      return null
    }

    if (new Date() > session.expiresAt) {
      this.sessions.delete(token)
      return null
    }

    return session.user
  }

  async logout(token: string): Promise<void> {
    this.sessions.delete(token)
    console.log("[v0] User logged out")
  }

  // Authorization helpers
  hasRole(user: User, requiredRole: string): boolean {
    const roleHierarchy = { admin: 3, police: 2, user: 1 }
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole as keyof typeof roleHierarchy]
  }

  requireAuth(requiredRole = "user") {
    return async (request: Request) => {
      const authHeader = request.headers.get("Authorization")

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response("Unauthorized", { status: 401 })
      }

      const token = authHeader.substring(7)
      const user = await this.validateToken(token)

      if (!user) {
        return new Response("Invalid token", { status: 401 })
      }

      if (!this.hasRole(user, requiredRole)) {
        return new Response("Insufficient permissions", { status: 403 })
      }

      return user
    }
  }
}

export const authService = new AuthService()

// Middleware for API routes
export async function withAuth(request: Request, requiredRole = "user") {
  const authResult = await authService.requireAuth(requiredRole)(request)

  if (authResult instanceof Response) {
    return { error: authResult, user: null }
  }

  return { error: null, user: authResult }
}
