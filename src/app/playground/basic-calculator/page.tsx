import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BasicCalculator from '@/components/BasicCalculator';

export const metadata: Metadata = {
  title: 'Basic Calculator | AJ-Playground',
  description: 'A simple calculator built as an early experiment. Basic arithmetic operations with a retro design.',
};

export default function BasicCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 min-h-screen">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-black/80">
          <Link href="/playground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Playground
          </Link>
        </Button>
      </div>
      
      <header className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <span className="text-3xl">🧮</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
          Basic Calculator
        </h1>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-sm text-red-700 font-medium">Abandoned Project</span>
        </div>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
        Feel free to try it out anyway!
        </p>
      </header>

      <div className="flex justify-center">
        <BasicCalculator />
      </div>
    </div>
  );
}
