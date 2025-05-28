import { NextResponse } from "next/server"
import { tmdbService } from "@/lib/tmdb"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")

  try {
    const data = await tmdbService.getPopularTVShows(page)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching popular TV shows:", error)
    return NextResponse.json({ error: "Failed to fetch popular TV shows" }, { status: 500 })
  }
}
