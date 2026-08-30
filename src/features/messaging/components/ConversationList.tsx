import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { messagingService } from '@/features/messaging/services/messagingService';

export const ConversationList = ({ onSelectConversation }: { onSelectConversation: (id: string) => void }) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadConversations();
  }, []);

  const startSupportChat = async () => {
    console.log('New Support Chat button clicked');
    try {
      const convId = await messagingService.createSupportConversation();
      await loadConversations();
      onSelectConversation(convId);
    } catch (error) {
      console.error('Error creating support chat:', error);
      alert('Failed to start support chat: ' + error);
    }
  };

  const getConversationTitle = (c: any) => {
    if (c.title) return c.title;
    
    // Find other participants
    const participants = c.conversation_participants?.map((p: any) => p.profiles) || [];
    
    if (participants.length > 0) {
      return participants.map((p: any) => `${p.full_name} (${p.role})`).join(', ');
    }

    return 'Conversation';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-2">
      <Button onClick={startSupportChat} className="w-full">New Support Chat</Button>
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
