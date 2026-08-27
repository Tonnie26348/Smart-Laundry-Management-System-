import { ReactNode } from 'react';

interface ChatLayoutProps {
  sidebar: ReactNode;
  content: ReactNode;
}

export const ChatLayout = ({ sidebar, content }: ChatLayoutProps) => {
  return (
    <div className="flex h-[calc(100vh-200px)] border rounded-lg bg-white overflow-hidden shadow-sm">
      <div className="w-1/3 border-r overflow-y-auto">{sidebar}</div>
      <div className="w-2/3 flex flex-col">{content}</div>
    </div>
  );
};
