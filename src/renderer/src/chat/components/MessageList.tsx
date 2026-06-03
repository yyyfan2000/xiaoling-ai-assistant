import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../../stores/chatStore';
import MessageBubble from './MessageBubble';

export default function MessageList() {
  const messages = useChatStore((s) => s.messages);
  const status = useChatStore((s) => s.status);
  const streamingContent = useChatStore((s) => s.streamingContent);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.length === 0 && status === 'idle' && (
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <div className="text-5xl mb-3">🦊</div>
            <p className="text-lg">你好！我是小灵</p>
            <p className="text-sm">有什么可以帮你的？</p>
          </div>
        </div>
      )}

      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {streamingContent && (
        <MessageBubble
          message={{
            id: 'streaming',
            role: 'assistant',
            content: streamingContent + '▊',
            timestamp: Date.now(),
          }}
        />
      )}

      {status === 'thinking' && !streamingContent && (
        <div className="flex items-center space-x-2 text-gray-400 p-4">
          <div className="text-xl">🦊</div>
          <div className="flex space-x-1">
            <span className="animate-bounce">●</span>
            <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>
              ●
            </span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>
              ●
            </span>
          </div>
          <span className="text-sm">小灵思考中...</span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
