import { Tray, Menu, nativeImage, app } from 'electron';
import { join } from 'path';
import { showPetWindow, closePetWindow } from './windows/pet';
import { createSettingsWindow } from './windows/settings';

let tray: Tray | null = null;

export function createTray(): Tray {
  // 简单托盘图标
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: '显示小灵', click: () => showPetWindow() },
    { label: '设置', click: () => createSettingsWindow() },
    { type: 'separator' },
    { label: '退出', click: () => { closePetWindow(); app.quit(); } },
  ]);

  tray.setToolTip('小灵 · AI助手');
  tray.setContextMenu(contextMenu);
  return tray;
}
