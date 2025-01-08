import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAI = message.type === 'AI';
  
  return (
    <div className={`flex gap-3 ${isAI ? 'bg-gray-50' : ''} p-4`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAI ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
        {isAI ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div className="flex-1">
        <div className="font-medium mb-1">{isAI ? 'AI Assistant' : 'You'}</div>
        <div className="text-gray-700 whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}