import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
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

  // Check authentication for top-rated content
  if (category === "top_rated") {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
  }

  try {
    let data
    if (mediaType === "movie") {
      if (!["popular", "top_rated", "now_playing", "upcoming"].includes(category)) {
        return NextResponse.json({ error: "Invalid movie category" }, { status: 400 })
      }

      switch (category) {
        case "popular":
          data = await tmdbService.getPopularMovies(page)
          break
        case "top_rated":
          data = await tmdbService.getTopRatedMovies(page)
          break
        case "now_playing":
          data = await tmdbService.getNowPlayingMovies(page)
          break
        case "upcoming":
          data = await tmdbService.getUpcomingMovies(page)
          break
        default:
          throw new Error(`Unknown movie category: ${category}`)
      }
    } else {
      if (!["popular", "top_rated", "on_the_air", "airing_today"].includes(category)) {
        return NextResponse.json({ error: "Invalid TV category" }, { status: 400 })
      }

      switch (category) {
        case "popular":
          data = await tmdbService.getPopularTVShows(page)
          break
        case "top_rated":
          data = await tmdbService.getTopRatedTVShows(page)
          break
        case "on_the_air":
          data = await tmdbService.getOnTheAirTVShows(page)
          break
        case "airing_today":
          data = await tmdbService.getAiringTodayTVShows(page)
          break
        default:
          throw new Error(`Unknown TV category: ${category}`)
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error fetching ${mediaType} ${category}:`, error)
    return NextResponse.json({ error: `Failed to fetch ${mediaType} ${category}` }, { status: 500 })
  }
}
