import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  console.log("Auth status:", {
    userId,
    url: req.url,
    pathname: req.nextUrl.pathname,
  });

  // Define public routes
  const isPublicRoute = [
    "/",
    "/sign-in",
    "/sign-up",
    "/search",
    "/faculties/:path*",
  ].some((route) => {
    if (route.includes(":path*")) {
      const baseRoute = route.split(":")[0];
      return req.nextUrl.pathname.startsWith(baseRoute);
    }
    return req.nextUrl.pathname === route;
  });
  const isUploadRoute = req.nextUrl.pathname.startsWith("/api/uploadthing");

  console.log(
    "Is public route:",
    isPublicRoute,
    "Is upload route:",
    isUploadRoute
  );

  if (!userId && !isPublicRoute && !isUploadRoute) {
    console.log("Redirecting to root due to no userId");
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Pass Clerk auth to the request for UploadThing
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-clerk-userid", userId || "");

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
