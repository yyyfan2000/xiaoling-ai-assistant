export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export type ChatStatus = 'idle' | 'thinking' | 'streaming' | 'error';

export interface ChatError {
  code: string;
  message: string;
}
