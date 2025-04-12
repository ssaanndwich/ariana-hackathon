import React from 'react';
import ChatInterface from '@/components/ChatInterface';
import RightPanel from '@/components/RightPanel';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI Conversational Assistant
          </h1>
          <p className="mt-2 text-muted-foreground">
            Chat with our AI using text or voice input
          </p>
        </div>
        
        <div className="flex gap-6">
          <div className="w-2/5">
            <ChatInterface />
          </div>
          <div className="w-3/5">
            <RightPanel />
          </div>
        </div>
        
        <footer className="mt-8 text-sm text-muted-foreground text-center">
          <p>© 2025 AI Assistant Demo. Built with React and Tailwind CSS.</p>
          <p className="mt-1">Send messages by typing or using your voice!</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
