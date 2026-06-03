import { useEffect, useCallback } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { useModelStore } from '../../stores/modelStore';
import type { ChatMessage } from '../../types/chat';

export function useStreamChat() {
  const addMessage = useChatStore((s) => s.addMessage);
  const setStatus = useChatStore((s) => s.setStatus);
  const setError = useChatStore((s) => s.setError);
  const appendStreamChunk = useChatStore((s) => s.appendStreamChunk);
  const finalizeStream = useChatStore((s) => s.finalizeStream);
  const getCurrentModel = useModelStore((s) => s.getCurrentModel);

  // Set up IPC stream listeners on mount, clean up on unmount
  useEffect(() => {
    const unsubChunk = window.electronAPI?.onStreamChunk((text: string) => {
      setStatus('streaming');
      appendStreamChunk(text);
    });

    const unsubDone = window.electronAPI?.onStreamDone(() => {
      finalizeStream();
      window.electronAPI?.setPetState('idle');
    });

    const unsubError = window.electronAPI?.onStreamError(
      (err: { code: string; message: string }) => {
        setError(err);
        window.electronAPI?.setPetState('idle');
      }
    );

    return () => {
      unsubChunk?.();
      unsubDone?.();
      unsubError?.();
    };
  }, [appendStreamChunk, finalizeStream, setError, setStatus]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;

      // Validate model
      const model = getCurrentModel();
      if (!model) {
        setError({ code: 'no_model', message: '未找到指定模型，请检查设置' });
        return;
      }
      if (!model.apiKey) {
        setError({
          code: 'no_api_key',
          message: '请先在设置中配置 API Key',
        });
        return;
      }

      // Build user message
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
      };

      // Get current messages before adding the new one
      const currentMessages = useChatStore.getState().messages;

      // Add message and set state
      addMessage(userMsg);
      setStatus('thinking');
      window.electronAPI?.setPetState('thinking');

      // Build message list (user + assistant only, no system messages)
      const allMessages = [...currentMessages, userMsg]
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }));

      window.electronAPI?.sendChatMessage({
        modelId: model.id,
        messages: allMessages,
      });
    },
    [addMessage, getCurrentModel, setError, setStatus]
  );

  return { sendMessage };
}
