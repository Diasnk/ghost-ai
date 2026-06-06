import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";

import { clerkAppearance } from "@/lib/clerk-appearance";
import {
  clerkAfterAuthUrl,
  clerkSignInUrl,
  clerkSignUpAfterAuthUrl,
  clerkSignUpUrl,
} from "@/lib/clerk-routes";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ghost AI",
  description: "Real-time collaborative system design workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="flex h-full flex-col font-sans">
        <ClerkProvider
          appearance={clerkAppearance}
          signInFallbackRedirectUrl={clerkAfterAuthUrl}
          signInUrl={clerkSignInUrl}
          signUpFallbackRedirectUrl={clerkSignUpAfterAuthUrl}
          signUpUrl={clerkSignUpUrl}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
