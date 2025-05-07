// src/components/sections/HeroSection.tsx
'use client';

import Image from 'next/image';
import AjGptChatLauncher from '@/components/ai/AjGptChatLauncher';

export default function HeroSection() {
  return (
    <section 
      id="hero" 
      className="min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden py-16 md:py-24 px-4"
    >
      {/* Background Media Container */}
      <div className="absolute inset-0 -z-10">
        {/* Placeholder for GIF/video. Replace with actual media. */}
        <Image
          src="https://picsum.photos/seed/dynamicabstract/1920/1080" 
          alt="Abstract background"
          fill
          className="object-cover"
          data-ai-hint="dynamic abstract" // Hint for a more dynamic image
          priority // Load this image early as it's part of LCP for this section
        />
        {/* Dark overlay to ensure text contrast */}
        <div className="absolute inset-0 bg-background/70"></div> 
        
        {/* Example for a video background (ensure video is optimized):
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover" // Removed opacity from here, control with overlay
          poster="https://picsum.photos/seed/abstractwaves/1920/1080" // Poster image
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        */}
      </div>

      {/* Jumbotron Text Content */}
      <div className="relative z-10">
        <h2 className="text-2xl md:text-3xl font-light text-foreground/80 mb-2">
          HI, I&apos;M
        </h2>
        <h1 className="text-6xl md:text-8xl font-extrabold text-primary mb-4 tracking-tight">
          AJ
        </h1>
        <p className="text-xl md:text-2xl text-foreground/70 mb-6 max-w-2xl mx-auto">
          Welcome to my digital playground. Explore my projects, thoughts, and experiments.
        </p>
        <p className="text-md text-foreground/60">
          Need to ask something about my work? Try my AI assistant!
        </p>
      </div>

      {/* AJ-GPT Chat Launcher - positioned independently */}
      <AjGptChatLauncher />
    </section>
  );
}

