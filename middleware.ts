import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/uploadthing(.*)",
  "/:path*.(png|jpg|jpeg|gif|svg|ico)",
]);

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher(["/admin(.*)", "/payroll(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.url;
  const pathname = req.nextUrl.pathname;
  const { userId } = await auth();

  console.log(`[${new Date().toISOString()} Middleware] Auth status:`, {
    userId,
    url,
    pathname,
  });

  // Allow public routes without authentication
  if (isPublicRoute(req)) {
    console.log(
      `[${new Date().toISOString()} Middleware] Allowing public route: ${pathname}`
    );
    return NextResponse.next();
  }

  // Redirect unauthenticated users to sign-in for protected routes
  if (isProtectedRoute(req) && !userId) {
    console.log(
      `[${new Date().toISOString()} Middleware] Redirecting to sign-in for protected route: ${pathname}`
    );
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Allow authenticated users to access protected routes
  if (userId && isProtectedRoute(req)) {
    console.log(
      `[${new Date().toISOString()} Middleware] Allowing authenticated access to: ${pathname}`
    );
    return NextResponse.next();
  }

  // Allow any other routes for authenticated users
  if (userId) {
    console.log(
      `[${new Date().toISOString()} Middleware] Allowing authenticated user to non-protected route: ${pathname}`
    );
    return NextResponse.next();
  }

  // Fallback: redirect unauthenticated users to sign-in for any other routes
  console.log(
    `[${new Date().toISOString()} Middleware] Redirecting unauthenticated user to sign-in: ${pathname}`
  );
  return NextResponse.redirect(new URL("/sign-in", req.url));
});

export const config = {
  matcher: [
    // Match all routes except static assets and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico)).*)",
    // Match all API routes
    "/api/(.*)",
  ],
};
