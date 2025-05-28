import { NextResponse } from "next/server"
import { tmdbService, type MovieCategory } from "@/lib/tmdb"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") as MovieCategory
  const page = Number.parseInt(searchParams.get("page") || "1")

  if (!category || !["popular", "top_rated", "now_playing", "upcoming"].includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 })
  }

  try {
    const data = await tmdbService.getMoviesByCategory(category, page)
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error fetching ${category} movies:`, error)
    return NextResponse.json({ error: `Failed to fetch ${category} movies` }, { status: 500 })
  }
}
