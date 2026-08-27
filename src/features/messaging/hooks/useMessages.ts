import { useState, useEffect, useCallback } from 'react';
import { Message } from '../types/messaging';
import { messagingService } from '../services/messagingService';

export const useMessages = (conversationId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const data = await messagingService.getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    fetchMessages();

    const channel = messagingService.subscribeToConversation(conversationId, (newMessage) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
    });

    return () => {
      messagingService.unsubscribe(channel);
    };
  }, [conversationId, fetchMessages]);

  const sendMessage = async (text: string) => {
    try {
      await messagingService.sendMessage(conversationId, text);
      // Realtime will handle adding the message to the list
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return { messages, loading, error, sendMessage, refresh: fetchMessages };
};
