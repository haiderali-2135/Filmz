import { NextResponse } from "next/server"
import { tmdbService } from "@/lib/tmdb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const resolvedParams = await params
  const Id = await resolvedParams.id
  const id = Number.parseInt(Id)

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 })
  }

  try {
    const movie = await tmdbService.getMovieDetails(id)
    return NextResponse.json(movie)
  } catch (error) {
    console.error("Error fetching movie details:", error)
    return NextResponse.json({ error: "Failed to fetch movie details" }, { status: 500 })
  }
}
