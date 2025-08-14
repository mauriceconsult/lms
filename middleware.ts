import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in",
  "/signup",
  "/api/public(.*)",
]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const { userId } = await auth();
  const { pathname } = request.nextUrl;

  console.log(`Auth status:`, {
    userId,
    url: request.url,
    pathname,
  });

  console.log(`Is public route: ${isPublicRoute(request)} Is upload route: false`);

  if (!userId && !isPublicRoute(request)) {
    console.log("Redirecting to root due to no userId");
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|api/auth).*)"], // Exclude _next and Clerk's auth routes
};
