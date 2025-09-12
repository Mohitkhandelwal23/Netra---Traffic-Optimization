// File storage utilities
// Simulated cloud storage for images and videos

interface StoredFile {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  uploadedAt: Date
  uploadedBy?: number
}

class StorageService {
  private files: Map<string, StoredFile> = new Map()
  private baseUrl = "/api/storage/files"

  // Generate unique file ID
  private generateFileId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substring(2)}`
  }

  // Upload file (simulated)
  async uploadFile(
    file: File | Buffer,
    originalName: string,
    mimeType: string,
    uploadedBy?: number,
  ): Promise<StoredFile> {
    const fileId = this.generateFileId()
    const filename = `${fileId}_${originalName}`

    // Simulate file processing
    await new Promise((resolve) => setTimeout(resolve, 100))

    const storedFile: StoredFile = {
      id: fileId,
      filename,
      originalName,
      mimeType,
      size: file instanceof File ? file.size : file.length,
      url: `${this.baseUrl}/${fileId}`,
      uploadedAt: new Date(),
      uploadedBy,
    }

    this.files.set(fileId, storedFile)

    console.log("[v0] File uploaded:", filename)
    return storedFile
  }

  // Upload base64 image
  async uploadBase64Image(base64Data: string, filename: string, uploadedBy?: number): Promise<StoredFile> {
    // Extract mime type from base64 data
    const mimeMatch = base64Data.match(/^data:([^;]+);base64,/)
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg"

    // Convert base64 to buffer (simulated)
    const base64Content = base64Data.replace(/^data:[^;]+;base64,/, "")
    const buffer = Buffer.from(base64Content, "base64")

    return await this.uploadFile(buffer, filename, mimeType, uploadedBy)
  }

  // Get file by ID
  getFile(fileId: string): StoredFile | null {
    return this.files.get(fileId) || null
  }

  // Get file URL
  getFileUrl(fileId: string): string | null {
    const file = this.files.get(fileId)
    return file ? file.url : null
  }

  // Delete file
  async deleteFile(fileId: string): Promise<boolean> {
    const deleted = this.files.delete(fileId)

    if (deleted) {
      console.log("[v0] File deleted:", fileId)
    }

    return deleted
  }

  // List files with pagination
  listFiles(
    page = 1,
    limit = 20,
    uploadedBy?: number,
  ): {
    files: StoredFile[]
    total: number
    page: number
    totalPages: number
  } {
    let allFiles = Array.from(this.files.values())

    if (uploadedBy) {
      allFiles = allFiles.filter((file) => file.uploadedBy === uploadedBy)
    }

    allFiles.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())

    const total = allFiles.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const files = allFiles.slice(startIndex, startIndex + limit)

    return { files, total, page, totalPages }
  }

  // Get storage statistics
  getStorageStats(): {
    totalFiles: number
    totalSize: number
    fileTypes: Record<string, number>
  } {
    const files = Array.from(this.files.values())
    const totalFiles = files.length
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)

    const fileTypes: Record<string, number> = {}
    files.forEach((file) => {
      const type = file.mimeType.split("/")[0]
      fileTypes[type] = (fileTypes[type] || 0) + 1
    })

    return { totalFiles, totalSize, fileTypes }
  }

  // Cleanup old files (older than 30 days)
  async cleanupOldFiles(): Promise<number> {
    const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    let deletedCount = 0

    for (const [fileId, file] of this.files.entries()) {
      if (file.uploadedAt < cutoffDate) {
        this.files.delete(fileId)
        deletedCount++
      }
    }

    console.log("[v0] Cleaned up old files:", deletedCount)
    return deletedCount
  }
}

export const storageService = new StorageService()

// File validation utilities
export class FileValidator {
  static readonly MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  static readonly ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
  static readonly ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"]

  static validateImage(file: File): { valid: boolean; error?: string } {
    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: "File size exceeds 10MB limit" }
    }

    if (!this.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { valid: false, error: "Invalid file type. Only JPEG, PNG, and WebP are allowed" }
    }

    return { valid: true }
  }

  static validateVideo(file: File): { valid: boolean; error?: string } {
    if (file.size > this.MAX_FILE_SIZE * 5) {
      // 50MB for videos
      return { valid: false, error: "Video file size exceeds 50MB limit" }
    }

    if (!this.ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return { valid: false, error: "Invalid video type. Only MP4 and WebM are allowed" }
    }

    return { valid: true }
  }
}
