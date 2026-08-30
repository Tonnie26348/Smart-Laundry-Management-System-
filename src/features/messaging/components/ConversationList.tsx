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

  const getConversationTitle = (c: any) => {
    if (c.title) return c.title;
    
    // Find other participants
    const participants = c.conversation_participants?.map((p: any) => p.profiles) || [];
    const customer = c.customers;

    if (customer?.phone) {
      return `Customer: ${customer.phone}`;
    }
    
    if (participants.length > 0) {
      return participants.map((p: any) => `${p.full_name} (${p.role})`).join(', ');
    }

    return 'Conversation';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-2">
      {conversations.map((c) => (
        <Card 
          key={c.id} 
          className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onSelectConversation(c.id)}
        >
          <p className="font-semibold truncate">{getConversationTitle(c)}</p>
          <p className="text-xs text-gray-400">Last updated: {new Date(c.updated_at).toLocaleDateString()}</p>
        </Card>
      ))}
    </div>
  );
};
