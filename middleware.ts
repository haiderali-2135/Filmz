import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
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
  matcher: ["/top-rated/:path*"],
}
