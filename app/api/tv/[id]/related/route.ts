import { NextResponse } from "next/server"
import { tmdbService } from "@/lib/tmdb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid TV show ID" }, { status: 400 })
  }

  try {
    const shows = await tmdbService.getRelatedTVShows(id)
    return NextResponse.json(shows)
  } catch (error) {
    console.error("Error fetching related TV shows:", error)
    return NextResponse.json({ error: "Failed to fetch related TV shows" }, { status: 500 })
  }
}
