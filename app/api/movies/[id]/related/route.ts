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
    const movies = await tmdbService.getRelatedMovies(id)
    return NextResponse.json(movies)
  } catch (error) {
    console.error("Error fetching related movies:", error)
    return NextResponse.json({ error: "Failed to fetch related movies" }, { status: 500 })
  }
}
