import { BrowserWindow } from 'electron';
import { join } from 'path';

let chatWindow: BrowserWindow | null = null;

export function createChatWindow(): BrowserWindow {
  if (chatWindow && !chatWindow.isDestroyed()) {
    chatWindow.focus();
    return chatWindow;
  }

  chatWindow = new BrowserWindow({
    width: 420,
    height: 600,
    minWidth: 340,
    minHeight: 400,
    title: '小灵 · AI助手',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    chatWindow.loadURL('http://localhost:5173?window=chat');
  } else {
    chatWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      query: { window: 'chat' },
    });
  }

  chatWindow.on('closed', () => { chatWindow = null; });
  return chatWindow;
}

export function getChatWindow(): BrowserWindow | null {
  return chatWindow && !chatWindow.isDestroyed() ? chatWindow : null;
}

export function closeChatWindow(): void {
  chatWindow?.close();
  chatWindow = null;
}
