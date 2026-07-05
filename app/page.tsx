import Link from "next/link";

const FEATURES = [
  {
    title: "五维标准化评估",
    desc: "专业能力、项目经验、沟通表达、匹配度、成长潜力，结构化输出证据片段",
    icon: "📊",
  },
  {
    title: "AI 辅助 + 人工覆盖",
    desc: "AI 生成初评，面试官可修改评分并记录原因，用于持续校准",
    icon: "🎯",
  },
  {
    title: "追问建议 & 红线预警",
    desc: "自动生成 3-5 个追问方向，检测简历矛盾、项目夸大等风险",
    icon: "⚠️",
  },
  {
    title: "评估进度看板",
    desc: "待评估 / 已评估 / 已确认三列看板，HR 一目了然",
    icon: "📋",
  },
];

const STATS = [
  { value: "<10min", label: "单候选人评估耗时" },
  { value: "五维", label: "标准化评估框架" },
  { value: "0次", label: "HR 催评语" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-slate-50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
            IE
          </div>
          <span className="text-lg font-bold text-slate-900">InterviewEval</span>
        </div>
        <Link
          href="/dashboard"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          进入工作台
        </Link>
      </nav>

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
          v1.0 MVP · AI 辅助评估
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          让面试评估
          <span className="text-indigo-600"> 标准化、可追溯</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          输入简历、面试记录和岗位 JD，AI 输出结构化评估报告、追问建议和红线预警。
          面试官在 AI 基础上修改确认，HR 通过看板追踪进度。
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
          >
            开始使用
          </Link>
          <Link
            href="/tasks/new"
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50"
          >
            创建评估任务
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="text-3xl font-bold text-indigo-600">{s.value}</div>
              <div className="mt-1 text-sm text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">
          核心能力
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        InterviewEval · 面试评估 SaaS v1.0
      </footer>
    </div>
  );
}
