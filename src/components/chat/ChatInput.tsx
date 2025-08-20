import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, StopCircle } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isGenerating?: boolean;
  onStop?: () => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, isGenerating = false, onStop, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isGenerating) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-chat-border bg-chat-bg">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Envie uma mensagem..."
                disabled={disabled}
                className="min-h-[52px] max-h-32 resize-none bg-chat-input border-chat-border text-chat-text placeholder:text-chat-text-muted focus:ring-chat-accent focus:border-chat-accent pr-12"
                rows={1}
              />
              
              <div className="absolute right-2 bottom-2">
                {isGenerating ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={onStop}
                    className="h-8 w-8 p-0 hover:bg-chat-sidebar-hover"
                  >
                    <StopCircle className="h-4 w-4 text-chat-text-muted" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!message.trim() || disabled}
                    className="h-8 w-8 p-0 bg-chat-accent hover:bg-chat-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
        
        <div className="mt-2 text-xs text-chat-text-muted text-center">
          Pressione Enter para enviar, Shift + Enter para nova linha
        </div>
      </div>
    </div>
  );
};