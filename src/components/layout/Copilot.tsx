"use client"

import { useState } from 'react';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Copilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMsg }] })
      });
      
      const data = await res.json();
      if (res.ok && data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: `Erro: ${data.error || 'Falha na comunicação'}` }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erro interno ao tentar contactar a IA.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 h-96 flex flex-col bg-neutral-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-sertao-accent" />
              <span className="font-medium text-sm text-white">IA Global (Kimi)</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <p className="text-sm text-neutral-500 text-center mt-4">
                Olá! Como posso ajudar com o CRM hoje?
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${msg.role === 'user' ? 'bg-sertao-primary text-white' : 'bg-white/10 text-neutral-200'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                </div>
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-white/10 bg-black/40">
            <form onSubmit={sendMessage} className="flex gap-2">
              <Input 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte algo..." 
                className="h-9"
              />
              <Button type="submit" size="icon" className="h-9 w-9 bg-sertao-primary hover:bg-sertao-primary/90 text-white border-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-sertao-primary hover:bg-sertao-primary/90 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
