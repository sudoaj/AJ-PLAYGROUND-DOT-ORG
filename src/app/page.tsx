import HeroSection from '@/components/sections/HeroSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import AjGptSection from '@/components/sections/AjGptSection';
import StatsSection from '@/components/sections/StatsSection';
import BlogSection from '@/components/sections/BlogSection';
import PlaygroundSection from '@/components/sections/PlaygroundSection';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProjectsSection />
      <Separator className="my-12 md:my-16 bg-border/20" />
      <AjGptSection />
      <Separator className="my-12 md:my-16 bg-border/20" />
      <StatsSection />
      <Separator className="my-12 md:my-16 bg-border/20" />
      <BlogSection />
      <Separator className="my-12 md:my-16 bg-border/20" />
      <PlaygroundSection />
    </>
  );
}
