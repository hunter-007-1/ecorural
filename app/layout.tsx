import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNavigation from "@/components/BottomNavigation";

export const metadata: Metadata = {
  title: "乡健碳行 | EcoRural",
  description: "碳中和 + 健身 + 乡村助农的积分平台",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#10B981",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-stone-50">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(16,185,129,0.08),_transparent_50%)] pointer-events-none z-0" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(251,191,36,0.05),_transparent_50%)] pointer-events-none z-0" />
        <main className="relative z-10 min-h-screen pb-20">
          {children}
        </main>
        <BottomNavigation />
      </body>
    </html>
  );
}
