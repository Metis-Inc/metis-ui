import React, { useState } from 'react';
import { MessageSquare, Plus, Trash2, ChevronDown } from 'lucide-react';
import { Session, Bot } from '../types';

interface SidebarProps {
  sessions: Session[];
  bots: Bot[];
  activeSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: (botId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

export function Sidebar({ sessions, bots, activeSessionId, onSessionSelect, onNewChat, onDeleteSession }: SidebarProps) {
  const [selectedBot, setSelectedBot] = useState<string>(bots[0]?.id || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleNewChat = () => {
    if (selectedBot) {
      onNewChat(selectedBot);
      setIsDropdownOpen(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-64 bg-gray-50 h-full flex flex-col border-r">
      <div className="p-4 space-y-2">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
          >
            <span className="truncate">
              {bots.find(b => b.id === selectedBot)?.name || 'Select a bot'}
            </span>
            <ChevronDown size={20} className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg">
              {bots.map((bot) => (
                <button
                  key={bot.id}
                  onClick={() => {
                    setSelectedBot(bot.id);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                >
                  {bot.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleNewChat}
          disabled={!selectedBot}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          New Chat
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-100 ${
              activeSessionId === session.id ? 'bg-gray-100' : ''
            }`}
          >
            <button
              className="flex-1 flex items-center gap-2 text-left"
              onClick={() => onSessionSelect(session.id)}
            >
              <MessageSquare size={18} />
              <span className="truncate">
                {formatDate(session.startDate)}
              </span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}