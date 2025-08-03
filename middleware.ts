import {
  clerkMiddleware,
  type ClerkMiddlewareAuth,
} from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

export default clerkMiddleware(
  async (auth: ClerkMiddlewareAuth, req: NextRequest) => {
    const { userId } = await auth();
    console.log("Auth status:", {
      userId,
      url: req.url,
      pathname: req.nextUrl.pathname,
    });

    // Allow /api/uploadthing as an authenticated route
    const isPublicRoute = req.nextUrl.pathname === "/";
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
  }
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
