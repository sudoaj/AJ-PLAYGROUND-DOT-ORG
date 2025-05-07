'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Download } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/#projects', label: 'Projects' },
  { href: '/#blog', label: 'Blog' },
  { href: '/#playground', label: 'Playground' },
];

export default function Header() {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    if (href.startsWith('/#')) {
      e.preventDefault();
      const sectionId = href.substring(2);
      const section = document.getElementById(sectionId);
      if (section) {
        // Close sheet if on mobile and a scroll link is clicked
        if (isMobile) {
          const closeButton = document.querySelector('#radix-\\:R1cqm\\:-trigger-radix-\\:R1cqm\\:-content-0 button[aria-label="Close"]');
          // A more robust way to close the sheet would be to manage its open state via context or props
          // For now, this is a simple attempt. A better solution would involve passing setOpen to nav items.
        }
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // If not a hash link, Next.js Link component will handle navigation
  };

  const commonNavItems = (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={(e) => scrollToSection(e, link.href)}
          className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
        >
          {link.label}
        </Link>
      ))}
      <Button variant="outline" size="sm" asChild>
        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" download>
          <Download className="mr-2 h-4 w-4" />
          Resume
        </a>
      </Button>
    </>
  );
  
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            AJ-Playground
          </Link>
          {/* Skeleton for nav items including new Playground link and resume button */}
          <div className="flex items-center space-x-6">
            <div className="h-6 w-16 animate-pulse rounded-md bg-muted/50"></div>
            <div className="h-6 w-12 animate-pulse rounded-md bg-muted/50"></div>
            <div className="h-6 w-20 animate-pulse rounded-md bg-muted/50"></div>
            <div className="h-9 w-28 animate-pulse rounded-md bg-muted/50"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary hover:opacity-80 transition-opacity">
          AJ-Playground
        </Link>
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background">
              <div className="flex flex-col space-y-6 p-6 pt-12">
                {/* TODO: Implement sheet closing on nav item click for SPA scroll */}
                {navLinks.map((link) => (
                  <Button key={link.href} variant="ghost" asChild className="justify-start">
                    <Link
                      href={link.href}
                      onClick={(e) => {
                        scrollToSection(e, link.href);
                        // Attempt to close sheet, would be better with state management
                        const trigger = document.querySelector('[aria-controls^="radix-"][aria-expanded="true"]');
                        if (trigger instanceof HTMLElement) trigger.click();
                      }}
                    >
                      {link.label}
                    </Link>
                  </Button>
                ))}
                <Button variant="outline" asChild>
                  <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" download>
                    <Download className="mr-2 h-4 w-4" />
                    Resume
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex items-center space-x-6">
            {commonNavItems}
          </nav>
        )}
      </div>
    </header>
  );
}
