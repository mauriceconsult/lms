import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/uploadthing(.*)",
  "/:path*.(png|jpg|jpeg|gif|svg|ico)",
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.url;
  const pathname = req.nextUrl.pathname;
  const { userId } = await auth();

  console.log(`[${new Date().toISOString()} Middleware] Auth status:`, {
    userId,
    url,
    pathname,
  });

  // Allow public routes
  if (isPublicRoute(req)) {
    console.log(
      `[${new Date().toISOString()} Middleware] Is public route: true`
    );
    return NextResponse.next();
  }

  // Redirect unauthenticated users to sign-in for protected routes
  if (!userId) {
    console.log(
      `[${new Date().toISOString()} Middleware] Redirecting to sign-in due to no userId`
    );
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Explicitly allow /admin/* routes for authenticated users
  if (pathname.startsWith("/admin")) {
    console.log(
      `[${new Date().toISOString()} Middleware] Allowing access to /admin route`
    );
    return NextResponse.next();
  }

  // Log unexpected routes
  console.log(
    `[${new Date().toISOString()} Middleware] Unexpected route for authenticated user`
  );
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico)).*)",
    "/api/(.*)",
  ],
};
