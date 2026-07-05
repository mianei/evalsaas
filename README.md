# InterviewEval - 面试评估 SaaS v1.0

面向中小企业招聘场景的 AI 候选人评估工具。基于 PRD v1.0 MVP 构建。

## 功能

- **单候选人评估**：输入简历 + 面试记录 + JD，AI 生成五维评估报告
- **追问建议 & 红线预警**：自动生成追问方向和风险检测
- **面试官覆盖**：修改 AI 评分并记录原因，用于模型校准
- **评估进度看板**：待评估 / 已评估 / 已确认三列 Kanban
- **创建评估任务**：HR 上传简历、粘贴 JD、分配面试官

## 两种使用方式

### 方式一：纯 HTML（推荐快速体验）

直接双击打开 `index.html`，无需安装 Node.js。

使用真实 AI 评估：
```bash
python api-proxy.py
```
然后在页面「设置」中填入 DeepSeek API Key，地址填 `http://127.0.0.1:8765/v1`。

### 方式二：Next.js 完整版

```bash
cd 评估saas
npm install
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)

## 快速开始（Next.js）

## 配置 AI（可选）

复制 `.env.example` 为 `.env.local`：

```env
OPENAI_API_KEY=your_api_key
OPENAI_BASE_URL=https://api.deepseek.com/v1
OPENAI_MODEL=deepseek-chat
```

未配置 API Key 时，系统自动使用模拟评估（基于规则生成结构化报告）。

## 技术栈

- Next.js 15 + React 19
- Tailwind CSS 4
- DeepSeek / OpenAI 兼容 API
- localStorage 本地持久化（MVP 演示）

## 演示数据

首次加载包含 2 条示例任务：
- 赵小明（待评估）— 可体验完整评估流程
- 孙丽华（已评估）— 可查看完整报告

右上角可切换角色：HR / 面试官 / 招聘负责人

## 目录结构

```
app/
  page.tsx              # 落地页
  dashboard/            # 评估看板
  tasks/new/            # 创建任务
  evaluations/[id]/     # 评估详情
  api/evaluate/         # AI 评估 API
components/             # UI 组件
lib/                    # 类型、Prompt、Schema、Store
```
