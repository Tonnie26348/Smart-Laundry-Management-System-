import { ConversationWithParticipants } from '../types/messaging';

interface ConversationListProps {
  conversations: ConversationWithParticipants[];
  activeConversationId?: string;
  onSelect: (id: string) => void;
}

export const ConversationList = ({ conversations, activeConversationId, onSelect }: ConversationListProps) => {
  return (
    <div className="flex flex-col">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={`p-4 border-b text-left hover:bg-gray-50 ${activeConversationId === conv.id ? 'bg-blue-50' : ''}`}
        >
          <div className="font-semibold">{conv.title || 'Untitled Conversation'}</div>
          <div className="text-sm text-gray-500 truncate">{conv.conversation_type}</div>
          {conv.unread_count > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{conv.unread_count}</span>
          )}
        </button>
      ))}
    </div>
  );
};
