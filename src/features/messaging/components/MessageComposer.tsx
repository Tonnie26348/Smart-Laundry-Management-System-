import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface MessageComposerProps {
  onSendMessage: (text: string) => Promise<void>;
  isLoading?: boolean;
}

export const MessageComposer = ({ onSendMessage, isLoading }: MessageComposerProps) => {
  const [text, setText] = useState('');

  const handleSend = async () => {
    if (!text.trim()) return;
    await onSendMessage(text);
    setText('');
  };

  return (
    <div className="p-4 border-t bg-gray-50 flex gap-2">
      <Input 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Type a message..." 
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <Button onClick={handleSend} disabled={isLoading}>Send</Button>
    </div>
  );
};
