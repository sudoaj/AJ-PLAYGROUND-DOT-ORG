// src/components/sections/HeroSection.tsx
'use client';

import { useState, useEffect } from 'react';

import AnimatedSvgBackground from '@/components/ui/AnimatedSvgBackground';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowLeft, ArrowRight, Play, Pause, Code, Rocket, Coffee } from 'lucide-react';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  backgroundType: 'animated' | 'gradient' | 'image';
  backgroundImage?: string;
  primaryColor: string;
  secondaryColor: string;
  icon?: React.ReactNode;
  cta: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Hi, I'm AJ",
    subtitle: "Software Engineer",
    description: "Creating something from scratch is like magic. I love turning ideas into reality, whether it's building web applications, crafting APIs, or exploring new technologies. Explore my projects and let's connect",
    backgroundType: 'image',
    backgroundImage: '/images/others/aj1.png',
    primaryColor: 'text-white',
    secondaryColor: 'text-white/90',
    icon: <Rocket className="h-8 w-8" />,
    cta: 'Get Started'
  }

];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCTAClick = () => {
    const slide = heroSlides[currentSlide];
    if (slide.cta === 'Explore Projects') {
      // Navigate to playground section or page
      const playgroundSection = document.getElementById('playground');
      if (playgroundSection) {
        playgroundSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/playground';
      }
    } else if (slide.cta === 'Read Articles') {
      // Navigate to blog section or page
      const blogSection = document.getElementById('blog');
      if (blogSection) {
        blogSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/blog';
      }
    } else {
      // Default behavior - scroll to projects
      scrollToProjects();
    }
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isPlaying, currentSlide]);

  const slide = heroSlides[currentSlide];

  const renderBackground = () => {
    switch (slide.backgroundType) {
      case 'animated':
        return (
          <div className="absolute inset-0 -z-10">
            <AnimatedSvgBackground />
            <div className="absolute inset-0 bg-background/20"></div>
          </div>
        );
      case 'image':
        return (
          <div className="absolute inset-0 -z-10">
            <Image
              src={slide.backgroundImage!}
              alt="Hero background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        );
      case 'gradient':
        return (
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section 
      id="hero" 
      className="min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden py-16 md:py-24 w-full"
    >
      {renderBackground()}

      {/* Slide Content */}
      <div className={`relative z-10 px-4 flex flex-col items-center transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {/* Icon */}
        <div className={`mb-4 ${slide.primaryColor} animate-fade-in-down`} style={{animationDelay: '0.1s'}}>
          {slide.icon}
        </div>

        {/* Subtitle */}
        <h2 className={`text-xl sm:text-2xl md:text-3xl font-light ${slide.secondaryColor} mb-2 animate-fade-in-down backdrop-blur-sm bg-background/10 px-3 sm:px-4 py-1 rounded-lg`} style={{animationDelay: '0.2s'}}>
          {slide.subtitle}
        </h2>

        {/* Main Title */}
        <h1 
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold ${slide.primaryColor} mb-4 tracking-tighter animate-fade-in-up backdrop-blur-sm bg-background/10 px-4 sm:px-6 py-2 rounded-xl`}
          style={{textShadow: '2px 2px 8px hsl(var(--background) / 0.8)', animationDelay: '0.4s'}}
        >
          {slide.title}
        </h1>

        {/* Description */}
        <p 
          className={`text-base sm:text-lg md:text-xl lg:text-2xl ${slide.secondaryColor} mb-8 max-w-xs sm:max-w-md md:max-w-2xl mx-auto leading-relaxed animate-fade-in-up backdrop-blur-sm bg-background/10 px-4 sm:px-6 py-3 rounded-lg`}
          style={{textShadow: '1px 1px 4px hsl(var(--background) / 0.6)', animationDelay: '0.6s'}}
        >
          {slide.description}
        </p>
        
        {/* CTA Button */}
        <div className="animate-fade-in-up mb-8" style={{animationDelay: '0.8s'}}>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleCTAClick}
            className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 border-2 border-primary/70 hover:bg-primary/20 hover:border-primary transition-all duration-300 group backdrop-blur-sm bg-background/20 hover:bg-background/30"
          >
            {slide.cta}
            <ArrowDown className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-y-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>

      {/* Slide Controls */}
      <div className="fixed bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 sm:gap-4 z-50">
        {/* Previous Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="h-8 w-8 sm:h-10 sm:w-10 bg-background/20 backdrop-blur-sm hover:bg-background/30 border border-border/20"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>

        {/* Slide Indicators */}
        <div className="flex gap-1 sm:gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-primary scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Play/Pause Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlayPause}
          className="h-8 w-8 sm:h-10 sm:w-10 bg-background/20 backdrop-blur-sm hover:bg-background/30 border border-border/20"
        >
          {isPlaying ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
        </Button>

        {/* Next Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="h-8 w-8 sm:h-10 sm:w-10 bg-background/20 backdrop-blur-sm hover:bg-background/30 border border-border/20"
        >
          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 z-20 text-sm text-foreground/60 backdrop-blur-sm bg-background/20 px-3 py-1 rounded-full">
        {currentSlide + 1} / {heroSlides.length}
      </div>
    </section>
  );
}
