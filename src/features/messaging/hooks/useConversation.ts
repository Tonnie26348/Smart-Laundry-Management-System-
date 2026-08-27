import { useState, useEffect } from 'react';
import { Conversation } from '../types/messaging';
import { messagingService } from '../services/messagingService';
import { supabase } from '@/lib/supabase';

export const useConversation = (conversationId: string) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!conversationId) return;
      setLoading(true);
      
      const { data } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();
        
      setConversation(data);
      
      // Mark as read when opening conversation
      if (data) {
        await messagingService.markAsRead(conversationId);
      }
      setLoading(false);
    };
    fetchMetadata();
  }, [conversationId]);

  return { conversation, loading };
};
