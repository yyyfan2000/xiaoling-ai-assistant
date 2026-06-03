interface ModelConfig {
  id: string;
  provider: string;
  modelId: string;
  displayName: string;
  apiKey: string;
  baseUrl: string;
  capabilities: { text: boolean; image: boolean; file: boolean };
}

interface StreamCallbacks {
  onChunk: (text: string) => void;
  onDone: () => void;
  onError: (code: string, message: string) => void;
}

export async function streamChat(
  model: ModelConfig,
  messages: Array<{ role: string; content: string }>,
  callbacks: StreamCallbacks
): Promise<void> {
  const { baseUrl, apiKey, modelId } = model;
  const url = `${baseUrl}/v1/chat/completions`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120_000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: modelId, messages, stream: true }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 401 || response.status === 403) {
      callbacks.onError('auth_failed', 'API 认证失败，请检查 Key 是否正确');
      return;
    }
    if (response.status >= 500) {
      callbacks.onError('service_unavailable', '服务暂时不可用，请稍后重试或切换模型');
      return;
    }
    if (!response.ok) {
      const errorBody = await response.text();
      callbacks.onError('unknown', `请求失败 (${response.status}): ${errorBody}`);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      callbacks.onError('unknown', '无法读取响应流');
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;

        const data = trimmed.slice(6);
        if (data === '[DONE]') {
          callbacks.onDone();
          return;
        }

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) callbacks.onChunk(content);
        } catch { /* skip unparseable lines */ }
      }
    }

    callbacks.onDone();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      callbacks.onError('timeout', '请求超时，请检查网络连接');
    } else {
      callbacks.onError('unknown', `网络错误: ${err.message}`);
    }
  }
}
