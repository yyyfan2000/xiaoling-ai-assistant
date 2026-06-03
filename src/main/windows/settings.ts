import { BrowserWindow } from 'electron';
import { join } from 'path';

let settingsWindow: BrowserWindow | null = null;

export function createSettingsWindow(): BrowserWindow {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus();
    return settingsWindow;
  }

  settingsWindow = new BrowserWindow({
    width: 520,
    height: 500,
    minWidth: 400,
    minHeight: 400,
    title: '设置',
    titleBarStyle: 'hiddenInset',
    resizable: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    settingsWindow.loadURL('http://localhost:5173?window=settings');
  } else {
    settingsWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      query: { window: 'settings' },
    });
  }

  settingsWindow.on('closed', () => { settingsWindow = null; });
  return settingsWindow;
}

export function getSettingsWindow(): BrowserWindow | null {
  return settingsWindow && !settingsWindow.isDestroyed() ? settingsWindow : null;
}

export function closeSettingsWindow(): void {
  settingsWindow?.close();
  settingsWindow = null;
}
