import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "乡村碳足迹 - EcoRural",
  description: "碳中和 + 健身 + 乡村助农的积分平台",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}



