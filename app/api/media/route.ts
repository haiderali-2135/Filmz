import { NextResponse } from "next/server"
import { tmdbService, type MediaType, type MovieCategory, type TVCategory } from "@/lib/tmdb"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mediaType = searchParams.get("type") as MediaType
  const category = searchParams.get("category") as MovieCategory | TVCategory
  const page = Number.parseInt(searchParams.get("page") || "1")

  if (!mediaType || !["movie", "tv"].includes(mediaType)) {
    return NextResponse.json({ error: "Invalid media type" }, { status: 400 })
  }

  if (!category) {
    return NextResponse.json({ error: "Category is required" }, { status: 400 })
  }

  try {
    let data
    if (mediaType === "movie") {
      if (!["popular", "top_rated", "now_playing", "upcoming"].includes(category)) {
        return NextResponse.json({ error: "Invalid movie category" }, { status: 400 })
      }
      data = await tmdbService.getMoviesByCategory(category as MovieCategory, page)
    } else {
      if (!["popular", "top_rated", "on_the_air", "airing_today"].includes(category)) {
        return NextResponse.json({ error: "Invalid TV category" }, { status: 400 })
      }
      data = await tmdbService.getTVShowsByCategory(category as TVCategory, page)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error fetching ${mediaType} ${category}:`, error)
    return NextResponse.json({ error: `Failed to fetch ${mediaType} ${category}` }, { status: 500 })
  }
}
