import { ipcMain } from 'electron';
import { registerChatIpc } from './chat';
import { registerSettingsIpc } from './settings';

export function registerAllIpc(): void {
  registerChatIpc();
  registerSettingsIpc();
}
