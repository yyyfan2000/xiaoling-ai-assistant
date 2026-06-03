import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/main.css';

/**
 * 根据 URL query `?window=pet|chat|settings` 加载对应组件
 */
async function bootstrap() {
  const params = new URLSearchParams(window.location.search);
  const windowType = params.get('window') || 'chat';

  const root = ReactDOM.createRoot(document.getElementById('root')!);

  switch (windowType) {
    case 'pet': {
      const { default: PetApp } = await import('./pet/PetApp');
      root.render(<React.StrictMode><PetApp /></React.StrictMode>);
      break;
    }
    case 'chat': {
      const { default: ChatApp } = await import('./chat/ChatApp');
      root.render(<React.StrictMode><ChatApp /></React.StrictMode>);
      break;
    }
    case 'settings': {
      const { default: SettingsApp } = await import('./settings/SettingsApp');
      root.render(<React.StrictMode><SettingsApp /></React.StrictMode>);
      break;
    }
    default:
      root.render(<div>未知窗口类型: {windowType}</div>);
  }
}

bootstrap();
