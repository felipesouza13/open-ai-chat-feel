import { memo } from 'react';
import { useTypingEffect } from '@/hooks/useTypingEffect';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  };
  isLatest?: boolean;
  showTyping?: boolean;
}

const ChatMessage = memo(({ message, isLatest = false, showTyping = false }: ChatMessageProps) => {
  const { displayedText, isTyping } = useTypingEffect({
    text: message.content,
    speed: 20,
    startDelay: 100
  });

  const isUser = message.role === 'user';
  const shouldAnimate = isLatest && showTyping && !isUser;
  const textToShow = shouldAnimate ? displayedText : message.content;

  return (
    <div className={`group w-full ${isUser ? '' : 'bg-chat-message-bg'} message-enter`}>
      <div className="max-w-4xl mx-auto px-4 py-6 flex gap-4">
        <div className="flex-shrink-0">
          <Avatar className="w-8 h-8">
            <AvatarFallback className={`${isUser ? 'bg-chat-accent text-chat-accent-foreground' : 'bg-chat-sidebar text-chat-text'}`}>
              {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="prose prose-invert max-w-none">
            <div className="text-chat-text whitespace-pre-wrap break-words leading-7">
              {textToShow}
              {shouldAnimate && isTyping && (
                <span className="inline-block w-2 h-5 bg-chat-text animate-typing-cursor ml-1"></span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export { ChatMessage };