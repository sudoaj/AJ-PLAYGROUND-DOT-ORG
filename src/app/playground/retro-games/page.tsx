
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import RetroGames from '@/components/RetroGames';

export const metadata: Metadata = {
  title: 'Retro Games | AJ-Playground',
  description: 'Classic arcade games recreated with modern web technologies - Snake, Pong, and more!',
};

export default function RetroGamesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="text-primary hover:text-black/80">
            <Link href="/playground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Playground
            </Link>
          </Button>
        </div>
        
        <RetroGames />
      </div>
    </div>
  );
}
