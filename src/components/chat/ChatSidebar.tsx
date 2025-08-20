import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquarePlus, 
  MoreHorizontal, 
  Edit3, 
  Trash2,
  Menu,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ChatSidebar = ({ 
  conversations, 
  activeConversationId, 
  onNewChat, 
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  isOpen,
  onToggle
}: ChatSidebarProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleRename = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleSaveRename = () => {
    if (editingId && editTitle.trim()) {
      onRenameConversation(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditTitle('');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-64 
        bg-chat-sidebar border-r border-chat-border
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-chat-border">
            <h2 className="text-chat-text font-semibold">ChatGPT Clone</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden h-8 w-8 p-0 hover:bg-chat-sidebar-hover"
            >
              <X className="h-4 w-4 text-chat-text" />
            </Button>
          </div>

          {/* New Chat Button */}
          <div className="p-3">
            <Button
              onClick={onNewChat}
              className="w-full justify-start gap-3 bg-transparent border border-chat-border hover:bg-chat-sidebar-hover text-chat-text"
              variant="outline"
            >
              <MessageSquarePlus className="h-4 w-4" />
              Nova conversa
            </Button>
          </div>

          {/* Conversations */}
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`
                    group relative flex items-center gap-2 w-full p-3 rounded-lg text-left
                    hover:bg-chat-sidebar-hover chat-transition cursor-pointer
                    ${activeConversationId === conversation.id ? 'bg-chat-sidebar-hover' : ''}
                  `}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="flex-1 min-w-0">
                    {editingId === conversation.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={handleSaveRename}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename();
                          if (e.key === 'Escape') handleCancelRename();
                        }}
                        className="w-full bg-chat-input border border-chat-border rounded px-2 py-1 text-sm text-chat-text focus:outline-none focus:ring-1 focus:ring-chat-accent"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <>
                        <div className="text-sm text-chat-text truncate font-medium">
                          {conversation.title}
                        </div>
                        <div className="text-xs text-chat-text-muted truncate">
                          {conversation.preview}
                        </div>
                      </>
                    )}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 hover:bg-chat-input"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-3 w-3 text-chat-text-muted" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-chat-sidebar border-chat-border">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRename(conversation);
                        }}
                        className="text-chat-text hover:bg-chat-sidebar-hover cursor-pointer"
                      >
                        <Edit3 className="h-3 w-3 mr-2" />
                        Renomear
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conversation.id);
                        }}
                        className="text-chat-danger hover:bg-chat-sidebar-hover cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-3 border-t border-chat-border">
            <div className="text-xs text-chat-text-muted text-center">
              ChatGPT Clone v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
};