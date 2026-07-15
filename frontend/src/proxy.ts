import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  const publicRoutes = [
    "/",
    "/pages/login",
    "/pages/signup"
  ];

  const isPublic = publicRoutes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isPublic) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};