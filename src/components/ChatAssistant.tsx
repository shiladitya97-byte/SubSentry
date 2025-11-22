import { useState } from 'react';
import { MessageCircle, X, Send, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Dialog */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[400px] h-[600px] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-full p-2">
                <MessageCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Talk with Us</h3>
                <p className="text-sm text-muted-foreground">Choose voice or text</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/20">
            <div className="bg-muted rounded-full p-8 mb-6">
              <MessageCircle className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center">
              Use voice or text to communicate
            </p>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t flex gap-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button size="icon" variant="secondary">
              <Send className="w-5 h-5" />
            </Button>
            <Button size="icon" className="bg-primary hover:bg-primary/90">
              <Mic className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};
