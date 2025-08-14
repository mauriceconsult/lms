import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/uploadthing(.*)",
  // Use simple patterns for static assets
  "/:path*.(png|jpg|jpeg|gif|svg|ico)",
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.url;
  const pathname = req.nextUrl.pathname;

  console.log(`[${new Date().toISOString()} Middleware] Auth status:`, {
    userId: (await auth()).userId,
    url,
    pathname,
  });

  if (isPublicRoute(req)) {
    console.log(
      `[${new Date().toISOString()} Middleware] Is public route: true`
    );
    return NextResponse.next();
  }

  const { userId } = await auth();
  if (!userId) {
    console.log(
      `[${new Date().toISOString()} Middleware] Redirecting to sign-in due to no userId`
    );
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all routes except Next.js internals and static assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico)).*)",
    "/api/(.*)",
  ],
};
