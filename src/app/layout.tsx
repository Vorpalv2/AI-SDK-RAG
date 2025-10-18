import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Navigation } from "@/components/ui/navigation";

const outfitSans = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat App",
  description: "Powered by Google's LLM",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = await auth();

  return (
    <ClerkProvider>
      {/* <SidebarProvider> */}
      {/* {isAuthenticated && <AppSidebar />} */}
      {/* <AppSidebar /> */}
      <html lang="en">
        <body className={`${outfitSans.variable} antialiased`}>
          {/* <SidebarTrigger /> */}
          <Navigation />
          {children}
        </body>
      </html>
      {/* </SidebarProvider> */}
    </ClerkProvider>
  );
}
