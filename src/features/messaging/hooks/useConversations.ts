import { useState, useEffect, useCallback } from 'react';
import { Conversation } from '../types/messaging';
import { messagingService } from '../services/messagingService';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await messagingService.getConversations();
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch conversations'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return { conversations, loading, error, refresh: fetchConversations };
};
