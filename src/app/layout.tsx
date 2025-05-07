
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackgroundAnimation from '@/components/ui/BackgroundAnimation';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AJ-Playground | Personal Portfolio & Blog',
  description: "Welcome to AJ's playground. Explore projects, read blog posts, and interact with web experiments.",
  keywords: "AJ, portfolio, blog, projects, web developer, AI, GitHub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <BackgroundAnimation />
        <Header />
        <main className="flex-grow relative z-0 w-full"> {/* Removed container classes, added w-full for clarity */}
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}

