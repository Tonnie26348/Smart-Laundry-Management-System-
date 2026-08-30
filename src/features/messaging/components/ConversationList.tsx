import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import { messagingService } from '@/features/messaging/services/messagingService';

export const ConversationList = ({ onSelectConversation }: { onSelectConversation: (id: string) => void }) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true);
      try {
        const convs = await messagingService.getConversations();
        setConversations(convs);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    loadConversations();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-2">
      {conversations.map((c) => (
        <Card 
          key={c.id} 
          className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onSelectConversation(c.id)}
        >
          <p className="font-semibold">{c.title || 'Conversation'}</p>
          <p className="text-xs text-gray-400">Last updated: {new Date(c.updated_at).toLocaleString()}</p>
        </Card>
      ))}
    </div>
  );
};
