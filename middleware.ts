import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Check if user is trying to access sign-in page while already authenticated
    if (req.nextUrl.pathname === "/auth/signin" && req.nextauth.token) {
      // Redirect to the page they came from or home page
      const referer = req.headers.get("referer")
      const redirectUrl = referer || "/"
      return NextResponse.redirect(new URL(redirectUrl, req.url))
    }

    // Additional middleware logic can go here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is trying to access top-rated page
        if (req.nextUrl.pathname.startsWith("/top-rated")) {
          return !!token // Only allow if user has a valid token
        }
        return true // Allow access to other pages
      },
    },
  },
)

export const config = {
  matcher: ["/top-rated/:path*", "/auth/signin"],
}
