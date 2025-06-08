"use client";

import Link from "next/link";
import {
  Twitter,
  Youtube,
  Instagram,
  Github,
  Linkedin,
  Rss,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { BlogPost } from '@/types';
import { Project } from '@/lib/projects';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentTime, setCurrentTime] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    loadData();

    // Clock logic
    const updateClock = () => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    updateClock(); // Initial call
    const timerId = setInterval(updateClock, 60000); // Update every minute

    return () => clearInterval(timerId); // Cleanup interval on component unmount
  }, []);

  const loadData = async () => {
    try {
      const [projectsResponse, postsResponse] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/posts')
      ]);

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
      }

      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        setBlogPosts(postsData);
      }
    } catch (error) {
      console.error('Error loading footer data:', error);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder for newsletter submission logic
    alert("Thank you for subscribing! (This is a demo feature)");
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  return (
    <footer className="border-t border-border/40 bg-background/90">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-8">
          {/* Column 1: About / Brand */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">
              AJ's Playground
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Thanks for exploring AJ's playground. You've discovered the
              software engineering portfolio of AJ, where you can explore
              various projects, read insightful blog posts, and interact with
              innovative web experiments.
            </p>
            <p className="text-xs text-muted-foreground/80">
              &copy; 2015 - {currentYear} AJ's Playground. All rights reserved.
            </p>
          </div>

          {/* Column 2: Explore Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Explore
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#hero"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  All Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/#blog"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Latest Posts
                </Link>
              </li>
              <li>
                <Link
                  href="/#playground"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Playground Experiments
                </Link>
              </li>
              <li>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Download Resume
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Featured Projects */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Featured Projects
            </h3>
            <ul className="space-y-2">
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {project.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          {/* Column 4: Recent Blog Posts */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Recent Posts
            </h3>
            <ul className="space-y-2">
              {blogPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 5: Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Stay Updated
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              If you want i can email you when I post new content, or if I have
              something interesting to share, subscribe to my newsletter.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-2"
            >
              <Input
                type="email"
                placeholder="aj@example.com"
                className="flex-grow bg-background/70 focus:bg-background"
                aria-label="Email for newsletter"
                required
              />
              <Button
                type="submit"
                variant="outline"
                className="whitespace-nowrap"
              >
                <Rss className="mr-2 h-4 w-4" /> Sub
              </Button>
            </form>
            <p className="text-xs text-muted-foreground/70 mt-2">
              Unsubscribe anytime.
            </p>
          </div>

          {/* Column 6: Connect & Clock */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Connect
            </h3>
            <div className="flex items-center space-x-2 mb-6">
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href="https://github.com/sudoaj"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href="https://www.linkedin.com/in/abdulsalam-ajayi-a9722a33b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                </Link>
              </Button>

              <Button variant="ghost" size="icon" asChild>
                <Link
                  href="https://www.youtube.com/@sudoaj"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href="https://www.instagram.com/sudo_aj/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                </Link>
              </Button>
            </div>

            <h4 className="text-md font-medium mb-1 text-foreground/90">
              Local Time
            </h4>
            {currentTime ? (
              <p className="text-sm text-muted-foreground tabular-nums">
                {currentTime}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Loading time...</p>
            )}
          </div>

         
        </div>
      </div>
    </footer>
  );
}
