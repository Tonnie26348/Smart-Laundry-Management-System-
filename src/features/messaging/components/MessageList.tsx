import { useRef, useEffect } from 'react';
import { Message } from '../types/messaging';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
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
  );
};
