
import HeroSection from '@/components/sections/HeroSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import BlogSection from '@/components/sections/BlogSection';
import PlaygroundSection from '@/components/sections/PlaygroundSection';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <>
      <HeroSection /> 
      <div className="container mx-auto px-4 py-8">
        <ProjectsSection />
        <Separator className="my-12 md:my-16 bg-border/20" />
        <BlogSection />
        <Separator className="my-12 md:my-16 bg-border/20" />
        <PlaygroundSection />
      </div>
    </>
  );
}

