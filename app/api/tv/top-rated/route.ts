import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { tmdbService } from "@/lib/tmdb"

export async function GET(request: Request) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")

  try {
    const data = await tmdbService.getTopRatedTVShows(page)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching top rated TV shows:", error)
    return NextResponse.json({ error: "Failed to fetch top rated TV shows" }, { status: 500 })
  }
}
