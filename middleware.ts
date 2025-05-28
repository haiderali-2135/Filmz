import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can go here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Protect top-rated page - require authentication
        if (pathname.startsWith("/top-rated")) {
          return !!token // Only allow if user has a valid token
        }

        // Protect sign-in page - redirect if already authenticated
        if (pathname.startsWith("/auth/signin")) {
          return !token // Only allow if user is NOT authenticated
        }

        return true // Allow access to other pages
      },
    },
  },
)

export const config = {
  matcher: ["/top-rated/:path*", "/auth/signin"],
}
