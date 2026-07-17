import { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Coach = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi Alex! I'm your DFlex AI Coach. How can I help you with your diet today?", isBot: true },
    { id: 2, text: "I'm not a big fan of salmon for dinner. What are some good alternatives?", isBot: false },
    { id: 3, text: "No problem! Since you need around 50g of protein for dinner, here are some great alternatives to salmon:\n\n1. **Lean Steak (200g)** - Great for iron and protein.\n2. **Chicken Breast (160g)** - Lower in fat if you want to save calories.\n3. **Tofu (300g)** - An excellent plant-based option.\n\nWould you like me to update your meal plan with one of these?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMsg = { id: Date.now(), text: inputValue, isBot: false };
    setMessages([...messages, newMsg]);
    setInputValue("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "I've noted that! I'll adjust your macros accordingly. Anything else you need help with?",
        isBot: true
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">AI Nutrition Coach</h1>
        <p className="text-muted">Ask anything about your diet, alternatives, or macros.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden bg-card/50 backdrop-blur">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={msg.id}
              className={`flex gap-4 ${msg.isBot ? '' : 'flex-row-reverse'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                msg.isBot ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'bg-secondary/10 text-secondary'
              }`}>
                {msg.isBot ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.isBot 
                  ? 'bg-background border border-border text-foreground' 
                  : 'bg-[var(--color-primary)] text-white'
              }`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border bg-background">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {['Suggest high protein snacks', 'Change my dinner', 'Make it cheaper', 'Vegan options'].map(suggestion => (
              <button 
                key={suggestion}
                onClick={() => setInputValue(suggestion)}
                className="whitespace-nowrap px-4 py-2 rounded-full border border-border text-xs font-medium text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <Sparkles size={12} className="inline mr-2 text-[var(--color-primary)]" />
                {suggestion}
              </button>
            ))}
          </div>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative flex items-center"
          >
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask your AI Coach..." 
              className="pr-12 bg-background border-border"
            />
            <Button 
              type="submit" 
              size="sm" 
              className="absolute right-1 w-10 h-10 p-0 rounded-lg"
              disabled={!inputValue.trim()}
            >
              <Send size={18} />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
