// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);
// const isAdminRoute = createRouteMatcher(["/upload"]);

// export default clerkMiddleware(async (auth, req) => {
//   const { sessionClaims } = await auth();
//   const isAdmin = sessionClaims?.metadata?.role == "admin";

//   if (isAdminRoute(req) || !isAdmin) {
//     const url = new URL("/", req.url);
//     return NextResponse.redirect(url);
//   }

//   if (!isPublicRoute(req)) {
//     await auth.protect();
//   }
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);
const isAdminRoute = createRouteMatcher(["/upload"]);

export default clerkMiddleware(async (auth, req) => {
  const authentication = await auth();
  const isAdmin =
    authentication.sessionClaims?.metadata.role == "admin" ? "admin" : "user";
  console.log(isAdmin);

  if (isAdmin === "user" && isAdminRoute(req)) {
    // await auth.protect();
    console.log("Attempted access to admin route by non-admin:", req.url);
    const url = new URL("/", req.url);
    console.log(url);
    return NextResponse.redirect(url);
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
