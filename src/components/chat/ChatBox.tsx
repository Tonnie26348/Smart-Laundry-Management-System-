import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { messagingService } from '@/features/messaging/services/messagingService';

interface Message {
  id: string;
  sender_id: string;
  message_text: string;
  created_at: string;
  profiles?: { full_name: string };
}

interface ChatBoxProps {
  conversationId: string;
  currentUserId: string;
}

export const ChatBox = ({ conversationId, currentUserId }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      const msgs = await messagingService.getMessages(conversationId);
      setMessages(msgs);
      setIsLoading(false);
    };
    loadMessages();

    // Subscribe to real-time changes
    const channel = messagingService.subscribeToConversation(conversationId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => { messagingService.unsubscribe(channel); };
  }, [conversationId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    await messagingService.sendMessage(conversationId, newMessage);
    setNewMessage('');
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-[500px] border rounded-lg bg-white overflow-hidden shadow-sm">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isOwn = m.sender_id === currentUserId;
          return (
            <div key={m.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[75%] p-3 rounded-2xl ${isOwn ? 'bg-primary-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                <p className="text-sm">{m.message_text}</p>
              </div>
              <span className="text-xs text-gray-400 mt-1 px-1">
                {m.profiles?.full_name || 'User'} • {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t bg-gray-50 flex gap-2">
        <Input 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
          placeholder="Type a message..." 
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};
