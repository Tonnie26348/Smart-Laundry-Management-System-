import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { messagingService } from '@/features/messaging/services/messagingService';
import { MessageSquare } from 'lucide-react';

interface MessageUserButtonProps {
  profileId: string;
  label?: string;
  className?: string;
}

export const MessageUserButton = ({ profileId, label = "Chat", className }: MessageUserButtonProps) => {
  const navigate = useNavigate();

  const startChat = async () => {
    try {
      const convId = await messagingService.getOrCreateDirectConversation(profileId);
      navigate(`/admin/messages?conversationId=${convId}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  return (
    <Button size="sm" onClick={startChat} className={className}>
      <MessageSquare size={16} className="mr-2" />
      {label}
    </Button>
  );
};
