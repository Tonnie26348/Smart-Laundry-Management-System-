import { supabase } from '@/lib/supabase';
import { Conversation, Message, ConversationParticipant } from '../types/messaging';

export const messagingService = {
  async getConversations(): Promise<Conversation[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('conversations')
      .select('*, conversation_participants!inner(user_id)')
      .eq('conversation_participants.user_id', user.id)
      .order('last_message_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getMessages(conversationId: string, page = 0): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages_v2')
      .select('*, profiles!messages_v2_sender_id_fkey(full_name)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .range(page * 50, (page + 1) * 50 - 1);

    if (error) throw error;
    return (data || []).reverse();
  },

  async sendMessage(conversationId: string, text: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('messages_v2')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        message_text: text
      });

    if (error) throw error;
  },

  async markAsRead(conversationId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('conversation_participants')
      .update({ last_read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id);
  },

  async getUnreadCount(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    // This is a complex query, might be better as an RPC function later.
    // For now, fetch conversations and participants, then count on client or simple query
    return 0; 
  },

  subscribeToConversation(conversationId: string, onMessage: (message: Message) => void) {
    return supabase
      .channel(`conversation:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages_v2',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        onMessage(payload.new as Message);
      })
      .subscribe();
  },

  unsubscribe(channel: any) {
    supabase.removeChannel(channel);
  }
};
