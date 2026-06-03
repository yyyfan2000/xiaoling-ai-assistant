import { BrowserWindow, screen } from 'electron';
import { join } from 'path';

let petWindow: BrowserWindow | null = null;

export function createPetWindow(): BrowserWindow {
  if (petWindow && !petWindow.isDestroyed()) {
    petWindow.focus();
    return petWindow;
  }

  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize;

  petWindow = new BrowserWindow({
    width: 100,
    height: 120,
    x: screenWidth - 150,
    y: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: false,
    resizable: false,
    skipTaskbar: true,
    type: 'panel',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  petWindow.setVisibleOnAllWorkspaces(true);

  if (process.env.NODE_ENV === 'development') {
    petWindow.loadURL('http://localhost:5173?window=pet');
  } else {
    petWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      query: { window: 'pet' },
    });
  }

  petWindow.on('closed', () => { petWindow = null; });

  return petWindow;
}

export function getPetWindow(): BrowserWindow | null {
  return petWindow && !petWindow.isDestroyed() ? petWindow : null;
}

export function hidePetWindow(): void {
  petWindow?.hide();
}

export function showPetWindow(): void {
  if (petWindow && !petWindow.isDestroyed()) {
    petWindow.show();
  } else {
    createPetWindow();
  }
}

export function closePetWindow(): void {
  petWindow?.close();
  petWindow = null;
}
