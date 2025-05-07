'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User, Loader2, AlertTriangle } from 'lucide-react';
import { projectQA, ProjectQAInput } from '@/ai/flows/project-qa'; // Assuming this path is correct

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

const placeholderPrompts = [
  "How many projects are listed?",
  "Tell me more about a random project.",
  "What technologies were used in the Security Logger project?",
];

export default function AjGptChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');

  useEffect(() => {
    setCurrentPlaceholder(placeholderPrompts[Math.floor(Math.random() * placeholderPrompts.length)]);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const aiInput: ProjectQAInput = { question: userMessage.text, username: 'yourusername' }; // Replace 'yourusername'
      const response = await projectQA(aiInput);
      const aiMessage: Message = { id: (Date.now() + 1).toString(), text: response.answer, sender: 'ai' };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error calling AI:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(`AI Error: ${errorMessage}`);
      const aiErrorMessage: Message = { id: (Date.now() + 1).toString(), text: "Sorry, I couldn't process that request.", sender: 'ai' };
      setMessages((prev) => [...prev, aiErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceholderClick = (promptText: string) => {
    setInput(promptText);
    // Optionally, submit directly:
    // handleSubmit(); // This would require handleSubmit to not need an event or handle it differently
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center text-xl">
          <Bot className="mr-3 h-7 w-7 text-primary" />
          AJ-GPT: Ask about my projects
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] p-4" ref={scrollAreaRef}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Bot className="h-12 w-12 mb-4" />
              <p className="mb-2 text-center">I can answer questions about AJ's projects.</p>
              <p className="text-sm text-center">Try one of these prompts:</p>
              <div className="mt-3 space-y-2">
                {placeholderPrompts.map((prompt, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handlePlaceholderClick(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 my-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}
            >
              {msg.sender === 'ai' && (
                <Avatar className="h-8 w-8 border border-primary/50">
                  <AvatarFallback><Bot className="h-5 w-5 text-primary" /></AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-lg p-3 max-w-[75%] text-sm break-words ${
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === 'user' && (
                 <Avatar className="h-8 w-8 border">
                  <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 my-4">
              <Avatar className="h-8 w-8 border border-primary/50">
                <AvatarFallback><Bot className="h-5 w-5 text-primary" /></AvatarFallback>
              </Avatar>
              <div className="rounded-lg p-3 bg-muted">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            </div>
          )}
        </ScrollArea>
        {error && (
          <div className="p-3 border-t bg-destructive/10 text-destructive text-xs flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 shrink-0" /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="border-t p-4 flex items-center gap-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={currentPlaceholder || "Ask something..."}
            className="flex-grow"
            disabled={isLoading}
            aria-label="Chat input"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
