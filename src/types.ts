export interface Message {
  id: string;
  type: 'AI' | 'USER';
  content: string;
  timestamp: number;
}

export interface Session {
  id: string;
  botId: string;
  messages: {
    id: string;
    message: {
      type: 'AI' | 'USER';
      content: string;
    };
    timestamp: string;
  }[];
  startDate: number;
}

export interface Bot {
  id: string;
  name: string;
  description: string | null;
  avatar: string | null;
}

export interface ChatResponse {
  id: string;
  type: 'AI';
  content: string;
  timestamp: number;
  finishReason: string;
}