import { app } from 'electron';
import { createPetWindow } from './windows/pet';
import { createTray } from './tray';
import { registerAllIpc } from './ipc';

app.whenReady().then(() => {
  registerAllIpc();
  createTray();
  createPetWindow();

  app.on('activate', () => {
    createPetWindow();
  });
});

app.on('window-all-closed', () => {
  // macOS 不退出，托盘保持
});

app.on('before-quit', () => {
  // 清理工作
});
