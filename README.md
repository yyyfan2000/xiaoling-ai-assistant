# 小灵 AI 助手

小灵是一个 macOS 桌面小狐狸 AI 助手。它常驻在桌面边缘，需要时点一下小狐狸就能打开对话窗口，适合日常问答、联网查询、阅读文件、图片理解和多模型切换。

## 主要功能

- 桌面小狐狸入口：小狐狸悬浮在桌面右侧，点击即可打开聊天窗口，右键可进入设置或退出到 Dock。
- AI 流式对话：回答会实时显示，不需要等完整响应结束。
- 多模型管理：支持在设置里添加、删除和切换模型，并指定默认模型。
- 多服务商预设：内置 DeepSeek、豆包、通义千问、智谱 GLM、Kimi，也支持自定义 OpenAI 兼容接口。
- 联网搜索：支持搜索增强回答，会把网络搜索结果注入上下文；部分模型还会开启厂商原生联网参数。
- 图片理解：支持上传图片给视觉模型分析，大图会自动压缩后发送。
- 文件阅读：支持拖拽或选择文本类文件、Markdown、JSON、CSV、代码文件、PDF、DOCX 等附件，并提取内容给模型阅读。
- 模型能力提示：在模型列表和切换器中展示文本、视觉、联网、实时等能力标签，方便选择合适模型。
- macOS 安装包：GitHub Releases 提供 DMG 安装包，下载后即可安装使用。

## 下载安装

前往 Releases 页面下载最新安装包：

[下载小灵 macOS 安装包](https://github.com/yyyfan2000/xiaoling-ai-assistant/releases/latest)

目前提供 Apple Silicon 版本：

- `Xiaoling-*-arm64.dmg`

安装步骤：

1. 下载 DMG 安装包。
2. 双击打开 DMG。
3. 将“小灵”拖入 Applications。
4. 从启动台或 Applications 打开“小灵”。

如果 macOS 提示应用来自未认证开发者，请在 Finder 中右键“小灵”，选择“打开”。这是因为当前安装包还没有 Apple 开发者签名。

## 使用方式

1. 首次打开后，右键桌面小狐狸，进入“设置”。
2. 添加一个模型配置，填写服务商、模型名、API Key 和接口地址。
3. 保存后回到聊天窗口，选择模型并开始对话。
4. 如模型支持，可以开启联网搜索、上传图片或拖入文件。

## 支持的模型服务

内置预设：

- DeepSeek
- 豆包 / 火山引擎
- 通义千问
- 智谱 GLM
- Kimi / 月之暗面
- 自定义 OpenAI 兼容接口

不同模型是否支持图片、文件或联网搜索，取决于模型本身和服务商接口能力。

## 本地开发

```bash
npm install
npm run dev
```

开发模式会自动准备本地 Electron 应用名称和 Dock 图标，让 Dock 中显示“小灵”。

## 本地打包

```bash
npm run dist:mac
```

打包产物会生成在 `dist/` 目录下。

## 发布流程

推送 `v*` 标签会触发 GitHub Actions 自动构建 macOS DMG，并上传到 GitHub Release。

```bash
git tag v1.0.2
git push origin v1.0.2
```
