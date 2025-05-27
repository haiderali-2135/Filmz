import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { reviewSchema } from "@/lib/validations"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const validatedFields = reviewSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const { movieId, rating, comment } = validatedFields.data

    // Check if user already reviewed this movie
    const existingReview = await prisma.review.findUnique({
      where: {
        movieId_userId: {
          movieId,
          userId: session.user.id,
        },
      },
    })

    if (existingReview) {
      // Update existing review
      const updatedReview = await prisma.review.update({
        where: { id: existingReview.id },
        data: { rating, comment },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      })

      return NextResponse.json(updatedReview)
    } else {
      // Create new review
      const review = await prisma.review.create({
        data: {
          movieId,
          rating,
          comment,
          userId: session.user.id,
        },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      })

      return NextResponse.json(review, { status: 201 })
    }
  } catch (error) {
    console.error("Review creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
