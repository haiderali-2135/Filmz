import { NextResponse } from "next/server"
import { tmdbService } from "@/lib/tmdb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const resolvedParams = await params
  const Id = await resolvedParams.id
  const id = Number.parseInt(Id)

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid TV show ID" }, { status: 400 })
  }

  try {
    const tvShow = await tmdbService.getTVShowDetails(id)
    return NextResponse.json(tvShow)
  } catch (error) {
    console.error("Error fetching TV show details:", error)
    return NextResponse.json({ error: "Failed to fetch TV show details" }, { status: 500 })
  }
}
