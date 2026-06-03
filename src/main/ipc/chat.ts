import { ipcMain, BrowserWindow } from 'electron';
import { streamChat } from '../services/api-client';
import { getModels, getDefaultModel } from '../services/store';

export function registerChatIpc(): void {
  ipcMain.handle('chat:get-models', () => getModels());
  ipcMain.handle('chat:get-default-model', () => getDefaultModel());

  ipcMain.on('chat:send-message', (event, args: {
    modelId: string;
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  }) => {
    const senderWindow = BrowserWindow.fromWebContents(event.sender);
    const models = getModels();
    const model = models.find(m => m.id === args.modelId);

    if (!model) {
      senderWindow?.webContents.send('chat:error', {
        code: 'no_model', message: '未找到指定模型，请检查设置',
      });
      return;
    }

    if (!model.apiKey) {
      senderWindow?.webContents.send('chat:error', {
        code: 'no_api_key', message: '请先在设置中配置 API Key',
      });
      return;
    }

    streamChat(model, args.messages, {
      onChunk: (text) => senderWindow?.webContents.send('chat:stream-chunk', text),
      onDone: () => senderWindow?.webContents.send('chat:stream-done'),
      onError: (code, message) => senderWindow?.webContents.send('chat:stream-error', { code, message }),
    });
  });
}
