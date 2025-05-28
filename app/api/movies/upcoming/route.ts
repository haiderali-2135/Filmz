import { NextResponse } from "next/server"
import { tmdbService } from "@/lib/tmdb"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")

  try {
    const data = await tmdbService.getUpcomingMovies(page)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching upcoming movies:", error)
    return NextResponse.json({ error: "Failed to fetch upcoming movies" }, { status: 500 })
  }
}
