export type ConversationType = 'direct' | 'order' | 'group' | 'support';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
}

export interface Conversation {
  id: string;
  conversation_type: ConversationType;
  title: string | null;
  order_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

export interface ConversationParticipant {
  conversation_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string;
  profiles?: Profile;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message_text: string;
  created_at: string;
  profiles?: Profile;
}

export interface ConversationWithParticipants extends Conversation {
  participants: ConversationParticipant[];
  unread_count: number;
}
