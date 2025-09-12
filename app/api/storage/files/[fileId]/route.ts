import { type NextRequest, NextResponse } from "next/server"
import { storageService } from "@/lib/storage"

export async function GET(request: NextRequest, { params }: { params: { fileId: string } }) {
  try {
    const file = storageService.getFile(params.fileId)

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // In a real implementation, this would serve the actual file
    // For simulation, return file metadata
    return NextResponse.json({
      success: true,
      file: file,
    })
  } catch (error) {
    console.error("[v0] File retrieval error:", error)
    return NextResponse.json({ error: "File retrieval failed" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { fileId: string } }) {
  try {
    const deleted = await storageService.deleteFile(params.fileId)

    if (!deleted) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    })
  } catch (error) {
    console.error("[v0] File deletion error:", error)
    return NextResponse.json({ error: "File deletion failed" }, { status: 500 })
  }
}
