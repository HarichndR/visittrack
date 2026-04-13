import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VisiTrack | Smart Event Operations",
  description: "Smart visitor tracking and event management for teams that need reliable check-in, analytics, and exhibitor workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased text-foreground bg-background`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
