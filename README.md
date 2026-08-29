# 灵镜电子吧唧 · Lingjing Tarot Badge

一个 ESP32 便携式「电子吧唧」算卦仪的网页模拟器：塔罗牌阵 / 六爻起卦，由 AI 生成解牌文本。

🌐 在线 Demo：<https://lingjing-badge.pages.dev>

> 1.75 英寸圆型 AMOLED 灵镜屏 · 六轴 QMI8658 陀螺仪洗牌 · 双麦麦克风 AI 智能解卦

## ✨ 特性

- 🎴 **塔罗牌阵** — 经典牌阵抽牌与解读
- ☯️ **六爻起卦** — 铜钱摇卦，自动推演本卦、变卦
- 🤖 **AI 智能解卦** — 调用 DeepSeek 大模型生成中文解读
- 📟 **ESP32 硬件模拟** — 还原「灵镜电子吧唧」的圆形屏幕、陀螺仪洗牌交互与麦克风音频可视化

## 🧱 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 19 · Vite 6 · TypeScript · Tailwind CSS 4 |
| 后端 | Cloudflare Pages Functions |
| AI | DeepSeek Chat Completions API |

## 🚀 本地运行

前置条件：Node.js ≥ 18

```bash
npm install
npm run build          # 构建前端
npm run pages:dev      # 本地跑 Pages + Functions（读取 .dev.vars 中的密钥）
```

首次运行前，在项目根目录新建 `.dev.vars`（已被 `.gitignore` 排除），内容：

```dotenv
DEEPSEEK_API_KEY=你的DeepSeek密钥
DEEPSEEK_MODEL=deepseek-v4-flash
```

若只想调试前端 UI，也可直接 `npm run dev`（Vite，此时 `/api` 后端不可用）。

## 📦 部署到 Cloudflare Pages

1. Fork 本仓库，推送到你的 GitHub。
2. 打开 Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**，选中仓库。
3. 构建设置：
   - Build command：`npm run build`
   - Build output directory：`dist`
4. 环境变量（生产环境用 Secret，避免明文）：

   | 变量名 | 值 | 类型 |
   |---|---|---|
   | `DEEPSEEK_API_KEY` | 你的 DeepSeek 密钥 | Secret（加密） |
   | `DEEPSEEK_MODEL` | `deepseek-v4-flash` | 明文 |

5. 保存并部署。之后每次 `git push` 都会自动重新构建部署。

## 🤖 模型说明

默认模型为 `deepseek-v4-flash`，可通过环境变量 `DEEPSEEK_MODEL` 覆盖。若该模型返回 404 / 不存在，可改用 DeepSeek 官方公开模型：

- `deepseek-chat`（通用对话，快）
- `deepseek-reasoner`（推理增强）

## 🔐 安全

- API 密钥只存在于服务端环境变量（Cloudflare Secret），前端代码不含任何密钥。
- 前端已移除「自定义 API Key」输入，密钥无法从前端注入。
- 请勿将密钥粘贴到代码、issue 或聊天记录中；若曾误提交，务必到 DeepSeek 后台重置密钥。

## 📄 License

本项目采用 [GNU General Public License v3.0](LICENSE)（GPL-3.0）。
