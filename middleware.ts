import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth(req => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // Protected routes that require authentication
  const protectedRoutes = ["/startup/create", "/startup/.*/edit"]

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => {
    const pattern = new RegExp(`^${route.replace(/\*/g, "[^/]+")}$`)
    return pattern.test(nextUrl.pathname)
  })

  // Redirect to home if trying to access protected route without auth
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  return NextResponse.next()
})

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
}
