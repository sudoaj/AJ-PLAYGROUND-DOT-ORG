'use client';

import Link from 'next/link';
import { Twitter, Youtube, Instagram, Github, Linkedin, Rss } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());

    // Clock logic
    const updateClock = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock(); // Initial call
    const timerId = setInterval(updateClock, 60000); // Update every minute

    return () => clearInterval(timerId); // Cleanup interval on component unmount
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder for newsletter submission logic
    alert('Thank you for subscribing! (This is a demo feature)');
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  return (
    <footer className="border-t border-border/40 bg-background/90">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: About / Brand */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">AJ-Playground</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Exploring the frontiers of web development, artificial intelligence, and creative coding.
            </p>
            <p className="text-xs text-muted-foreground/80">
              &copy; {currentYear} AJ-Playground.org. All rights reserved.
            </p>
          </div>

          {/* Column 2: Explore Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#hero" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Projects Showcase
                </Link>
              </li>
               <li>
                <Link href="/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  All Projects
                </Link>
              </li>
              <li>
                <Link href="/#blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Latest Posts
                </Link>
              </li>
               <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  All Blog Posts
                </Link>
              </li>
              <li>
                <Link href="/#playground" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Playground Experiments
                </Link>
              </li>
              <li>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" download className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Download Resume
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Connect & Clock */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Connect</h3>
            <div className="flex items-center space-x-2 mb-6">
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://github.com/sudoaj" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                </Link>
              </Button>
        
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://youtube.com/mkbhd" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <Youtube className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                </Link>
              </Button>
               <Button variant="ghost" size="icon" asChild>
                <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                </Link>
              </Button>
            </div>
            
            <h4 className="text-md font-medium mb-1 text-foreground/90">Local Time</h4>
            {currentTime ? (
              <p className="text-sm text-muted-foreground tabular-nums">{currentTime}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Loading time...</p>
            )}
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Get insights on web tech, AI, and more, directly to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="your.email@example.com"
                className="flex-grow bg-background/70 focus:bg-background"
                aria-label="Email for newsletter"
                required
              />
              <Button type="submit" variant="outline" className="whitespace-nowrap">
                <Rss className="mr-2 h-4 w-4" /> Subscribe
              </Button>
            </form>
            <p className="text-xs text-muted-foreground/70 mt-2">No spam, ever. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
