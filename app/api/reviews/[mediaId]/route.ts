import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { mediaId: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const mediaType = searchParams.get("type")
    const resolvedParams = await params
    const id = resolvedParams.mediaId
    const mediaId = Number.parseInt(id)

    if (isNaN(mediaId)) {
      return NextResponse.json({ error: "Invalid media ID" }, { status: 400 })
    }

    if (!mediaType || !["movie", "tv"].includes(mediaType)) {
      return NextResponse.json({ error: "Valid media type (movie or tv) is required" }, { status: 400 })
    }

    const reviews = await prisma.review.findMany({
      where: {
        mediaId,
        mediaType,
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}