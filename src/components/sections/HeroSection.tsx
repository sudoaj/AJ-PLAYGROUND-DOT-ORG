'use client';

import AjGptChat from '@/components/ai/AjGptChat';

export default function HeroSection() {
  // const scrollToProjects = () => {
  //   const projectsSection = document.getElementById('projects');
  //   if (projectsSection) {
  //     projectsSection.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

  return (
    <section id="hero" className="py-16 md:py-24 bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-light text-foreground/80 mb-2">
            HI, I&apos;m
          </h2>
          <h1 className="text-6xl md:text-8xl font-extrabold text-primary mb-4 tracking-tight">
            AJ
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 mb-6">
            Welcome to my playground. Interact with my AI assistant below.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <AjGptChat />
        </div>
      </div>
    </section>
  );
}
