import { NextResponse } from "next/server"
import { tmdbService } from "@/lib/tmdb"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const type = searchParams.get("type") || "movie"

  if (!query) {
    return NextResponse.json({ error: "Search query is required" }, { status: 400 })
  }

  try {
    let results
    if (type === "movie") {
      results = await tmdbService.searchMovies(query)
    } else if (type === "tv") {
      results = await tmdbService.searchTVShows(query)
    } else {
      return NextResponse.json({ error: "Invalid media type" }, { status: 400 })
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error(`Error searching ${type}:`, error)
    return NextResponse.json({ error: `Failed to search ${type}` }, { status: 500 })
  }
}
