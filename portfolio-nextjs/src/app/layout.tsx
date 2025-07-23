import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "양윤정 - 포트폴리오",
  description: "웹 개발을 배우고 있는 열정적인 개발자입니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
        <footer className="bg-gray-100 py-8 mt-20">
          <div className="max-w-7xl mx-auto px-8 text-center text-gray-600">
            <p>&copy; 2025 양윤정. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
