// src/components/sections/HeroSection.tsx
'use client';

import Image from 'next/image';
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
      {/* Background Media Container */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://picsum.photos/seed/dynamicabstract/1920/1080" 
          alt="Abstract background"
          fill
          className="object-cover"
          data-ai-hint="dynamic abstract"
          priority 
        />
        <div className="absolute inset-0 bg-background/75"></div> 
      </div>

      {/* Jumbotron Text Content */}
      <div className="relative z-10 px-4 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-light text-foreground/80 mb-2 animate-fade-in-down" style={{animationDelay: '0.2s'}}>
          Hi, I&apos;m
        </h2>
        <h1 
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-primary mb-4 tracking-tighter animate-fade-in-up"
          style={{textShadow: '2px 2px 4px hsl(var(--background) / 0.3)', animationDelay: '0.4s'}}
        >
          AJ
        </h1>
        <p 
          className="text-lg sm:text-xl md:text-2xl text-foreground/70 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
          style={{textShadow: '1px 1px 2px hsl(var(--background) / 0.2)', animationDelay: '0.6s'}}
        >
          Welcome to my digital playground. Explore my projects, thoughts, and experiments.
        </p>
        
        <div className="animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={scrollToProjects}
            className="text-lg px-8 py-6 border-2 border-primary/70 hover:bg-primary/10 hover:border-primary transition-all duration-300 group"
          >
            Explore
            <ArrowDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" />
          </Button>
        </div>

        <p className="text-sm md:text-md text-foreground/60 mt-12 animate-fade-in-up" style={{animationDelay: '1s'}}>
          Need to ask something about my work? Try AJ-GPT!
        </p>
      </div>

      {/* AJ-GPT Chat Launcher - positioned independently */}
      <AjGptChatLauncher />
    </section>
  );
}
