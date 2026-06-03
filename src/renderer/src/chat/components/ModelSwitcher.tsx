import React from 'react';
import { useModelStore } from '../../stores/modelStore';

function getCapabilityIcons(capabilities: {
  text: boolean;
  image: boolean;
  file: boolean;
}): string {
  const icons: string[] = [];
  if (capabilities.text) icons.push('📝');
  if (capabilities.image) icons.push('🖼️');
  if (capabilities.file) icons.push('📎');
  return icons.join(' ');
}

export default function ModelSwitcher() {
  const models = useModelStore((s) => s.models);
  const currentModelId = useModelStore((s) => s.currentModelId);
  const setCurrentModelId = useModelStore((s) => s.setCurrentModelId);
  const currentModel = useModelStore((s) => s.getCurrentModel());

  if (models.length === 0) {
    return (
      <button
        onClick={() => window.electronAPI?.openSettingsWindow()}
        className="flex items-center gap-1 px-3 py-1.5 text-xs text-fox-orange border border-fox-orange rounded-lg hover:bg-fox-cream transition-colors"
      >
        <span>⚙️</span>
        <span>配置模型</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={currentModelId}
        onChange={(e) => setCurrentModelId(e.target.value)}
        className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:border-fox-orange focus:ring-1 focus:ring-fox-orange cursor-pointer max-w-[200px] truncate"
      >
        {models.map((m) => (
          <option key={m.id} value={m.id}>
            {m.displayName || m.modelId}
          </option>
        ))}
      </select>

      {currentModel && (
        <span
          className="text-[10px] text-gray-400"
          title={[
            currentModel.capabilities.text && '支持文本',
            currentModel.capabilities.image && '支持图片',
            currentModel.capabilities.file && '支持文件',
          ]
            .filter(Boolean)
            .join('，')}
        >
          {getCapabilityIcons(currentModel.capabilities)}
        </span>
      )}
    </div>
  );
}
