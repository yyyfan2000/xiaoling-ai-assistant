import React, { useRef, useCallback, KeyboardEvent } from 'react';

interface Props {
  onSend: (content: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, []);

  const handleSend = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const content = el.value.trim();
    if (!content) return;

    onSend(content);
    el.value = '';
    el.style.height = 'auto';
  }, [onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="flex items-end gap-2 p-3 border-t border-gray-200 bg-white">
      <textarea
        ref={textareaRef}
        rows={1}
        placeholder="输入你的问题..."
        disabled={disabled}
        onInput={autoResize}
        onKeyDown={handleKeyDown}
        className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-fox-orange focus:ring-1 focus:ring-fox-orange disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ maxHeight: '120px' }}
      />

      <button
        onClick={handleSend}
        disabled={disabled}
        className="flex-shrink-0 w-9 h-9 rounded-full bg-fox-orange text-white flex items-center justify-center hover:bg-fox-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="发送 (Enter)"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="5,3 19,12 5,21 5,14 13,12 5,10" />
        </svg>
      </button>
    </div>
  );
}
