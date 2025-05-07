'use client';

import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

export default function HeroSection() {
  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="py-20 md:py-32 text-center bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-light text-foreground/80 mb-2">
          HI, I&apos;m
        </h2>
        <h1 className="text-6xl md:text-8xl font-extrabold text-primary mb-4 tracking-tight">
          AJ
        </h1>
        <p className="text-xl md:text-2xl text-foreground/70 mb-10">
          Welcome to my playground
        </p>
        <Button size="lg" onClick={scrollToProjects} className="group shadow-lg hover:shadow-primary/50 transition-shadow">
          Explore
          <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
        </Button>
      </div>
    </section>
  );
}
