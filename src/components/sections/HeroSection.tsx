// src/components/sections/HeroSection.tsx
'use client';

import AnimatedSvgBackground from '@/components/ui/AnimatedSvgBackground';
import AjGptChatLauncher from '@/components/ai/AjGptChatLauncher';
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
    <section 
      id="hero" 
      className="min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden py-16 md:py-24 w-full"
    >
      {/* Animated SVG Background */}
      <div className="absolute inset-0 -z-10">
        <AnimatedSvgBackground />
        <div className="absolute inset-0 bg-background/20"></div> 
      </div>

      {/* Jumbotron Text Content */}
      <div className="relative z-10 px-4 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-light text-foreground/90 mb-2 animate-fade-in-down backdrop-blur-sm bg-background/10 px-4 py-1 rounded-lg" style={{animationDelay: '0.2s'}}>
          Hello, I&apos;m
        </h2>
        <h1 
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-primary mb-4 tracking-tighter animate-fade-in-up backdrop-blur-sm bg-background/10 px-6 py-2 rounded-xl"
          style={{textShadow: '2px 2px 8px hsl(var(--background) / 0.8)', animationDelay: '0.4s'}}
        >
          AJayi
        </h1>
        <p 
          className="text-lg sm:text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up backdrop-blur-sm bg-background/10 px-6 py-3 rounded-lg"
          style={{textShadow: '1px 1px 4px hsl(var(--background) / 0.6)', animationDelay: '0.6s'}}
        >
Welcome to AJ's playground. Explore the software engineering portfolio of AJ, discover various projects in AJ's head, read blog posts, and interact with web experiments.        </p>
        
        <div className="animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={scrollToProjects}
            className="text-lg px-8 py-6 border-2 border-primary/70 hover:bg-primary/20 hover:border-primary transition-all duration-300 group backdrop-blur-sm bg-background/20 hover:bg-background/30"
          >
            Explore
            <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" />
          </Button>
        </div>

        <p className="text-sm md:text-md text-foreground/70 mt-12 animate-fade-in-up backdrop-blur-sm bg-background/10 px-4 py-2 rounded-lg" style={{animationDelay: '1s'}}>
          Need to ask something about my work? Try AJ-GPT!
        </p>
      </div>

      {/* AJ-GPT Chat Launcher - positioned independently */}
      <AjGptChatLauncher />
    </section>
  );
}
