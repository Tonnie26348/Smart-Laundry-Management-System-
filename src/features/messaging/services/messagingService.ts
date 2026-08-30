import { supabase } from '@/lib/supabase';
import { Conversation, Message } from '../types/messaging';

export const messagingService = {
  async getConversations(): Promise<Conversation[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await (supabase
      .from('conversations')
      .select('*, conversation_participants!inner(user_id, profiles(full_name, role)), customers(phone)')
      .eq('conversation_participants.user_id', user.id)
      .order('updated_at', { ascending: false }) as any);

    if (error) throw error;
    return data as Conversation[] || [];
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await (supabase
      .from('messages')
      .select('*, profiles!messages_sender_id_fkey(full_name)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true }) as any);

    if (error) throw error;
    return data as Message[] || [];
  },

  async sendMessage(conversationId: string, text: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await (supabase
      .from('messages') as any)
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        message_text: text
      });

    if (error) throw error;
  },

  // ... (keep remaining methods as they are, just ensuring they use 'messages')

  async markAsRead(conversationId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await (supabase
      .from('conversation_participants') as any)
      .update({ last_read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id);
  },

  async getOrCreateDirectConversation(participantId: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // 1. Get user's conversation IDs
    const { data: userConversations } = await (supabase
      .from('conversation_participants') as any)
      .select('conversation_id')
      .eq('user_id', user.id);

    // 2. Get participant's conversation IDs
    const { data: participantConversations } = await (supabase
      .from('conversation_participants') as any)
      .select('conversation_id')
      .eq('user_id', participantId);

    if (userConversations && participantConversations) {
        const userConvIds = (userConversations as any[]).map((c: any) => c.conversation_id);
        const commonConv = (participantConversations as any[]).find((c: any) => userConvIds.includes(c.conversation_id));
        if (commonConv) return commonConv.conversation_id;
    }

    // Create new conversation
    const { data: conv, error: convError } = await (supabase
      .from('conversations') as any)
      .insert({ conversation_type: 'direct', created_by: user.id })
      .select()
      .single();
    
    if (convError) throw convError;

    // Add participants
    await (supabase.from('conversation_participants') as any).insert([
      { conversation_id: conv.id, user_id: user.id },
      { conversation_id: conv.id, user_id: participantId }
    ]);

    return conv.id;
  },

  async createSupportConversation(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Find admin ID
    const { data: admins } = await (supabase
        .from('profiles')
        .select('id')
        .eq('role', 'administrator') as any);
    
    if (!admins || admins.length === 0) throw new Error('No administrator found');
    const adminId = admins[0].id;

    // Create support conversation
    const { data: conv, error: convError } = await (supabase
      .from('conversations') as any)
      .insert({ conversation_type: 'support', title: 'Support Request', created_by: user.id })
      .select()
      .single();
    
    if (convError) throw convError;

    // Add participants (Customer + Admin)
    await (supabase.from('conversation_participants') as any).insert([
      { conversation_id: conv.id, user_id: user.id },
      { conversation_id: conv.id, user_id: adminId }
    ]);

    return conv.id;
  },

  subscribeToConversation(conversationId: string, onMessage: (message: Message) => void) {
    return supabase
      .channel(`conversation:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
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
