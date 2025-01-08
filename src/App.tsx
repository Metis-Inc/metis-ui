import React, { useState, useEffect, useRef } from 'react';
import { Send, Menu, X, BrainCircuit } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { Sidebar } from './components/Sidebar';
import { Session, Message, Bot } from './types';
import * as api from './api';

function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [bots, setBots] = useState<Bot[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSessions();
    loadBots();
  }, []);

  useEffect(() => {
    if (activeSessionId) {
      loadSessionMessages(activeSessionId);
    }
  }, [activeSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadBots = async () => {
    try {
      const response = await api.getBots();
      setBots(response);
    } catch (error) {
      console.error('Failed to load bots:', error);
    }
  };

  const loadSessions = async () => {
    try {
      const response = await api.getSessions();
      setSessions(response);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const loadSessionMessages = async (sessionId: string) => {
    try {
      const session = await api.getSession(sessionId);
      // Sort messages in reverse chronological order (oldest first)
      const sortedMessages = session.messages
        .map((m: any) => ({
          id: m.id,
          type: m.type,
          content: m.content,
          timestamp: m.timestamp
        }))
        .sort((a, b) => a.timestamp - b.timestamp);
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Failed to load session messages:', error);
    }
  };

  const handleNewChat = async (botId: string) => {
    try {
      setLoading(true);
      const session = await api.createSession(botId);
      setSessions([session, ...sessions]);
      setActiveSessionId(session.id);
      setMessages([]);
      setSidebarOpen(false);
    } catch (error) {
      console.error('Failed to create new session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await api.deleteSession(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeSessionId || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'USER' as const,
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.sendMessage(activeSessionId, input);
      setMessages(prev => [...prev, {
        id: response.id,
        type: response.type,
        content: response.content,
        timestamp: response.timestamp,
      }]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${
        sidebarOpen ? 'block' : 'hidden'
      }`} onClick={() => setSidebarOpen(false)} />
      
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar
          sessions={sessions}
          bots={bots}
          activeSessionId={activeSessionId}
          onSessionSelect={(id) => {
            setActiveSessionId(id);
            setSidebarOpen(false);
          }}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-blue-600" size={32} />
            <h1 className="text-xl font-bold">MetisAI Chat</h1>
          </div>
          
          <div className="w-10 lg:hidden" /> {/* Spacer for mobile layout */}
        </header>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              Start a new conversation
            </div>
          ) : (
            <div className="pb-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input form */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!activeSessionId || loading}
            />
            <button
              type="submit"
              disabled={!activeSessionId || loading || !input.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;