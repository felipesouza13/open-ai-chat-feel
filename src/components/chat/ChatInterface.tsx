import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatSidebar } from './ChatSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
  messages: Message[];
}

export const ChatInterface = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Como criar um clone do ChatGPT',
      timestamp: new Date(),
      preview: 'Posso te ajudar a criar um clone do ChatGPT...',
      messages: [
        {
          id: '1',
          role: 'user',
          content: 'Como posso criar um clone do ChatGPT?',
          timestamp: new Date()
        },
        {
          id: '2',
          role: 'assistant',
          content: 'Posso te ajudar a criar um clone do ChatGPT! Para isso, vamos precisar de alguns componentes principais:\n\n1. **Interface de usuário** - Similar ao ChatGPT com sidebar e área de mensagens\n2. **Sistema de mensagens** - Para gerenciar conversas\n3. **Animações de digitação** - Para simular o efeito de typing em tempo real\n4. **Backend para IA** - Para processar as mensagens (você mencionou que já tem)\n\nO que você gostaria de saber mais especificamente?',
          timestamp: new Date()
        }
      ]
    }
  ]);
  
  const [activeConversationId, setActiveConversationId] = useState<string>('1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleSendMessage = async (content: string) => {
    if (!activeConversationId) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    // Add user message
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId 
        ? { 
            ...conv, 
            messages: [...conv.messages, userMessage],
            preview: content.slice(0, 50) + (content.length > 50 ? '...' : '')
          }
        : conv
    ));

    setIsGenerating(true);

    // Simulate AI response with delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: `Esta é uma resposta simulada para: "${content}"\n\nEm uma implementação real, aqui você faria a chamada para seu backend de IA. A animação de digitação que você está vendo simula perfeitamente o comportamento do ChatGPT original.\n\nAlgumas funcionalidades que este clone oferece:\n• Interface idêntica ao ChatGPT\n• Animações de digitação em tempo real\n• Gerenciamento de conversas\n• Design responsivo\n• Efeitos visuais suaves`,
        timestamp: new Date()
      };

      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { ...conv, messages: [...conv.messages, assistantMessage] }
          : conv
      ));

      setIsGenerating(false);
    }, 1000);
  };

  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: generateId(),
      title: 'Nova conversa',
      timestamp: new Date(),
      preview: 'Conversa vazia',
      messages: []
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setIsSidebarOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setIsSidebarOpen(false);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (activeConversationId === id) {
      const remaining = conversations.filter(conv => conv.id !== id);
      setActiveConversationId(remaining[0]?.id || '');
    }
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === id ? { ...conv, title: newTitle } : conv
    ));
  };

  const handleStop = () => {
    setIsGenerating(false);
  };

  return (
    <div className="flex h-screen bg-chat-bg">
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-chat-border bg-chat-bg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(true)}
            className="h-8 w-8 p-0 hover:bg-chat-sidebar-hover"
          >
            <Menu className="h-4 w-4 text-chat-text" />
          </Button>
          <h1 className="text-chat-text font-semibold">
            {activeConversation?.title || 'ChatGPT Clone'}
          </h1>
          <div className="w-8" />
        </div>

        {/* Messages area */}
        <ScrollArea className="flex-1">
          <div className="min-h-full">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4 max-w-md mx-auto px-4">
                  <div className="w-16 h-16 mx-auto bg-chat-accent rounded-full flex items-center justify-center">
                    <span className="text-2xl text-chat-accent-foreground">🤖</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-chat-text">
                    Como posso ajudar você hoje?
                  </h2>
                  <p className="text-chat-text-muted">
                    Digite sua mensagem abaixo para começar uma conversa.
                  </p>
                </div>
              </div>
            ) : (
              <div className="pb-32">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isLatest={index === messages.length - 1}
                    showTyping={message.role === 'assistant'}
                  />
                ))}
                {isGenerating && (
                  <div className="bg-chat-message-bg">
                    <div className="max-w-4xl mx-auto px-4 py-6 flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-chat-sidebar rounded-full flex items-center justify-center">
                          <span className="text-sm text-chat-text">🤖</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="typing-indicator flex space-x-1">
                          <span className="w-2 h-2 bg-chat-text-muted rounded-full"></span>
                          <span className="w-2 h-2 bg-chat-text-muted rounded-full"></span>
                          <span className="w-2 h-2 bg-chat-text-muted rounded-full"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="flex-shrink-0">
          <ChatInput
            onSendMessage={handleSendMessage}
            isGenerating={isGenerating}
            onStop={handleStop}
          />
        </div>
      </div>
    </div>
  );
};