# ESP32-S3 灵镜电子吧唧（Tarot Badge Simulator）

🌐 线上地址：<https://lingjing-badge.pages.dev>

1.75 英寸圆型 AMOLED 灵镜屏 · 六轴 QMI8658 陀螺仪洗牌 · 双麦麦克风 AI 智能解卦。
一个 ESP32 便携电子吧唧式算卦仪的网页模拟器，塔罗牌阵 / 六爻起卦，由 AI 生成解牌文本。

> 由 Google AI Studio 导出，已迁移至 **Cloudflare Pages + Functions** 前后端分离架构，
> 后端 AI 由 **Gemini 替换为 DeepSeek**，API 密钥全程只存在于服务端，不暴露到前端。

---

## 架构（前后端分离）

```
┌─────────────────────┐        ┌──────────────────────────────┐
│  前端（静态托管）      │        │  后端（Pages Functions）        │
│  React + Vite        │  POST  │  functions/api/tarot/reading.ts│
│  / (index.html)      │ ─────► │  读环境变量 DEEPSEEK_API_KEY   │
└─────────────────────┘        │  调用 DeepSeek Chat Completions │
                               └──────────────────────────────┘
```

- **前端**：`src/` 打包为静态资源，部署到 Cloudflare Pages。
- **后端**：`functions/api/tarot/reading.ts` 自动映射为 `POST /api/tarot/reading`。
- **密钥**：`DEEPSEEK_API_KEY` 只存在 Cloudflare 的 Secret 环境变量中，前端代码里没有任何 key。

---

## 本地运行

**前置条件**：Node.js ≥ 18

```bash
npm install
```

本地调试（含 Functions 后端，读取 `.dev.vars` 中的密钥）：

```bash
npm run build          # 先构建前端
npm run pages:dev      # 用 wrangler 本地跑 Pages + Functions
```

- `.dev.vars` 存放本地调试密钥（已被 `.gitignore` 排除，不会提交）。
- 若只想调试前端 UI，也可直接 `npm run dev`（Vite，但此时 `/api` 后端不可用）。

---

## 部署到 Cloudflare Pages

1. 推送代码到 GitHub 仓库（见下方「GitHub 同步」）。
2. 打开 Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**，选中本仓库。
3. 构建设置：
   - Build command：`npm run build`
   - Build output directory：`dist`
4. 在 **Environment variables** 中新增（生产环境用 Secret，避免明文）：
   | 变量名 | 值 | 类型 |
   |---|---|---|
   | `DEEPSEEK_API_KEY` | 你的 DeepSeek 密钥 | Secret（加密） |
   | `DEEPSEEK_MODEL` | `deepseek-v4-flash` | Plaintext |
5. 保存并部署。之后每次 `git push`，Cloudflare 会自动重新构建部署。

---

## 更换 / 说明模型

默认模型为 `deepseek-v4-flash`，可在环境变量 `DEEPSEEK_MODEL` 中覆盖。

> 若 `deepseek-v4-flash` 返回 404/模型不存在，请改为 DeepSeek 官方公开模型：
> - `deepseek-chat`（V3，通用对话，快）
> - `deepseek-reasoner`（R1，推理增强）

---

## GitHub 同步（版本 + 日志，不泄露密钥）

- 仓库只提交代码，`.gitignore` 已排除 `.env` / `.dev.vars` / `.wrangler/` 等，**密钥不会进入 Git 历史**。
- 每次改动：`git add . && git commit -m "说明" && git push`，版本与日志全部记录在 GitHub 的 commit history 中。
- 若曾误提交过密钥，务必到 DeepSeek 后台**重置密钥**，并在 GitHub 上重写历史或删除仓库重建。

---

## 安全提醒

- 本项目的前端已彻底移除「自定义 API Key 输入框」，密钥无法从前端注入。
- 生产密钥只应配置在 Cloudflare Secret 中，不要粘贴到代码、issue、或聊天记录里。
