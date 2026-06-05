import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { clerkSignInUrl, clerkSignUpUrl } from "@/lib/clerk-routes";

const signInUrl = clerkSignInUrl;
const signUpUrl = clerkSignUpUrl;

const isPublicRoute = createRouteMatcher([
  `${signInUrl}(.*)`,
  `${signUpUrl}(.*)`,
]);

export default clerkMiddleware(
  async (auth, req) => {
    if (!isPublicRoute(req)) await auth.protect();
  },
  {
    signInUrl,
    signUpUrl,
  }
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
