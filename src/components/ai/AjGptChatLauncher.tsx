// src/components/ai/AjGptChatLauncher.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, X } from 'lucide-react';
import AjGptChat from '@/components/ai/AjGptChat';
import { cn } from '@/lib/utils';

export default function AjGptChatLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close chat if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        // Check if the click was on the launcher button itself
        const launcherButton = document.getElementById('aj-gpt-launcher-button');
        if (launcherButton && launcherButton.contains(event.target as Node)) {
          return;
        }
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);


  if (!isMounted) {
    return null; // Or a skeleton loader for the button
  }

  return (
    <>
      <Button
        id="aj-gpt-launcher-button"
        variant="default" 
        size="lg" 
        className={cn(
          "fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-2xl z-[60] flex items-center justify-center p-0 transition-transform duration-300 ease-out",
          isOpen ? "scale-90 bg-muted hover:bg-muted/90 text-muted-foreground" : "scale-100 hover:scale-105 bg-primary hover:bg-primary/90 text-primary-foreground"
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close AI Chat" : "Open AI Chat"}
      >
        {isOpen ? <X className="h-7 w-7" /> : <Bot className="h-7 w-7" />}
      </Button>

      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 transition-all duration-300 ease-out",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
        ref={chatRef}
      >
        {isOpen && (
          <div className="w-full max-w-sm md:max-w-md">
             {/* AjGptChat is already a Card, we ensure it's rendered when open */}
            <AjGptChat />
          </div>
        )}
      </div>
    </>
  );
}
