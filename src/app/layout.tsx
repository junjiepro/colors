import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MainNav } from "@/components/main-nav";
import { Toaster } from "@/components/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MCP Tools Manager",
  description: "Manage your MCP tools and connections",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}>
        <div className="flex flex-col min-h-screen">
          <header className="border-b">
            <div className="container flex h-16 items-center px-4">
              <div className="mr-6 flex items-center space-x-2">
                <span className="font-bold">MCP Tools</span>
              </div>
              <MainNav />
            </div>
          </header>
          <main className="flex-1">
            <div className="container py-6">
              {children}
            </div>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
