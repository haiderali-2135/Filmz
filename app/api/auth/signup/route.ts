import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { signUpSchema } from "@/lib/validations"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedFields = signUpSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedFields.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const { name, email, password } = validatedFields.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
