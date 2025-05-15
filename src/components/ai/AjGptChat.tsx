'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Loader2, AlertTriangle, Sparkles } from 'lucide-react';
import { projectQA, ProjectQAInput } from '@/ai/flows/project-qa'; 

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

const placeholderPrompts = [
  "List all project names.",
  "What technologies are used in the AI Chatbot?",
  "Tell me about the E-commerce Platform.",
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

  const handleSubmit = async (e?: FormEvent<HTMLFormElement> | string) => {
    let currentInput = '';
    if (typeof e === 'string') {
      currentInput = e;
    } else if (e) {
      e.preventDefault();
      currentInput = input;
    }
    
    if (!currentInput.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: currentInput, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    if (typeof e !== 'string') {
      setInput(''); // Clear input only if it was a form submission
    }
    setIsLoading(true);
    setError(null);

    try {
      const aiInput: ProjectQAInput = { question: userMessage.text, username: 'sudoaj' }; // Replace 'yourusername' with actual or dynamic username
      const response = await projectQA(aiInput);
      const aiMessage: Message = { id: (Date.now() + 1).toString(), text: response.answer, sender: 'ai' };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error calling AI:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(`AI Error: ${errorMessage}`);
      const aiErrorMessage: Message = { id: (Date.now() + 1).toString(), text: "Sorry, I couldn't process that request. Please try again.", sender: 'ai' };
      setMessages((prev) => [...prev, aiErrorMessage]);
    } finally {
      setIsLoading(false);
      setCurrentPlaceholder(placeholderPrompts[Math.floor(Math.random() * placeholderPrompts.length)]);
    }
  };
  
  const handlePromptButtonClick = (promptText: string) => {
    setInput(promptText); // Set input field for user to see
    handleSubmit(promptText); // Submit the prompt directly
  };


  return (
    <Card className="w-full shadow-xl rounded-xl border-border/50">
      <CardHeader className="border-b border-border/30 p-4">
        <CardTitle className="flex items-center text-lg">
          <Bot className="mr-2 h-6 w-6 text-primary" />
          AJ-GPT 
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] md:h-[350px] p-4" ref={scrollAreaRef}>
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
              <Sparkles className="h-10 w-10 mb-3 text-primary" />
              <p className="text-sm text-center mb-3">Ask me anything about AJ&apos;s projects!</p>
              <div className="space-y-2 w-full">
                {placeholderPrompts.slice(0,2).map((prompt, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs h-auto py-1.5 text-left justify-start"
                    onClick={() => handlePromptButtonClick(prompt)}
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
              className={`flex items-start gap-2.5 my-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
            >
              {msg.sender === 'ai' && (
                <Avatar className="h-7 w-7 border border-primary/30">
                  <AvatarFallback><Bot className="h-4 w-4 text-primary" /></AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-lg p-2.5 max-w-[80%] text-xs md:text-sm break-words shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === 'user' && (
                 <Avatar className="h-7 w-7 border border-border/30">
                  <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && messages.length > 0 && messages[messages.length -1].sender === 'user' && (
            <div className="flex items-start gap-2.5 my-3">
              <Avatar className="h-7 w-7 border border-primary/30">
                <AvatarFallback><Bot className="h-4 w-4 text-primary" /></AvatarFallback>
              </Avatar>
              <div className="rounded-lg p-2.5 bg-muted shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            </div>
          )}
        </ScrollArea>
        {error && (
          <div className="p-2 border-t border-border/30 bg-destructive/10 text-destructive text-xs flex items-center">
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5 shrink-0" /> {error}
          </div>
        )}
        <CardFooter className="border-t border-border/30 p-3">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={currentPlaceholder || "Ask something..."}
              className="flex-grow h-9 text-xs md:text-sm"
              disabled={isLoading}
              aria-label="Chat input"
            />
            <Button type="submit" size="icon" className="h-9 w-9" disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
