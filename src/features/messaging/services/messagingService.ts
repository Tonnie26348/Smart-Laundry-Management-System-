import { supabase } from '@/lib/supabase';
import { Conversation, Message } from '../types/messaging';

export const messagingService = {
  async getConversations(): Promise<Conversation[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await (supabase
      .from('conversations')
      .select('*, conversation_participants!inner(user_id, profiles(full_name, role))')
      .eq('conversation_participants.user_id', user.id)
      .order('updated_at', { ascending: false }) as any);

    if (error) throw error;
    return data as Conversation[] || [];
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await (supabase
      .from('messages_v2')
      .select('*, profiles!messages_v2_sender_id_fkey(full_name)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true }) as any);

    if (error) throw error;
    return data as Message[] || [];
  },

  async sendMessage(conversationId: string, text: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await (supabase
      .from('messages_v2') as any)
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
      .insert({
        conversation_type: 'direct',
        created_by: user.id,
        last_message_at: new Date().toISOString()
      })
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
    const { data: allProfiles, error: profilesError } = await (supabase
        .from('profiles')
        .select('id, role') as any);
    
    console.log('All profiles fetched:', allProfiles);
    if (profilesError) console.error('Profiles fetch error:', profilesError);

    const admins = allProfiles?.filter((p: any) => p.role?.toLowerCase() === 'administrator');
    
    console.log('Filtered admins found:', admins);

    // Create support conversation
    const { data: conv, error: convError } = await (supabase
      .from('conversations') as any)
      .insert({
        conversation_type: 'support',
        title: 'Support Request',
        created_by: user.id,
        last_message_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (convError) {
      console.error('Conv creation error:', convError);
      throw convError;
    }

    // Add participants (Customer + Admin if found)
    const participants: any[] = [{ conversation_id: conv.id, user_id: user.id }];
    if (admins && admins.length > 0) {
        participants.push({ conversation_id: conv.id, user_id: admins[0].id });
    } else {
        console.warn('No admin found to add as participant');
    }

    const { error: partError } = await (supabase.from('conversation_participants') as any).insert(participants);
    
    if (partError) {
      console.error('Participant insertion error:', partError);
      throw partError;
    }

    return conv.id;
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
