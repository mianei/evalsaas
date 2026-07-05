import Link from "next/link";

const LOGOS = ["Acme Corp", "Quantum", "Echo", "Celestial", "Pulse", "Apex"];

const FEATURES = [
  {
    title: "五维标准化评估",
    desc: "专业能力、项目经验、沟通表达、匹配度、成长潜力，每维 1-5 分 + 证据片段。",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "AI 辅助 + 人工覆盖",
    desc: "AI 生成初评，面试官可修改评分并记录原因，持续校准模型偏好。",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "追问建议 & 红线预警",
    desc: "自动生成 3-5 个追问方向，检测简历矛盾、项目夸大等风险信号。",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  {
    title: "评估进度看板",
    desc: "待评估 / 已评估 / 已确认三列 Kanban，HR 零催评，进度一目了然。",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
      </svg>
    ),
  },
  {
    title: "团队协作",
    desc: "多面试官评审同一候选人，提交后才可见他人评估，避免锚定效应。",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "结构化报告导出",
    desc: "单候选人评估报告、多候选人对比表一键导出 PDF，归档合规。",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

const PRICING = [
  {
    name: "免费版",
    price: "¥0",
    period: "/月",
    desc: "体验 AI 评估核心能力",
    features: ["5 次评估/月", "1 个面试官席位", "基础五维评估", "追问建议 & 红线预警"],
    cta: "免费开始",
    href: "/dashboard",
    highlight: false,
  },
  {
    name: "团队版",
    price: "¥299",
    period: "/月",
    desc: "中小企业招聘团队首选",
    features: ["50 次评估/月", "5 个面试官席位", "多候选人对比", "团队协作 & 邮件通知"],
    cta: "立即升级",
    href: "/dashboard",
    highlight: true,
    badge: "最受欢迎",
  },
  {
    name: "企业版",
    price: "¥999",
    period: "/月",
    desc: "大型团队与定制需求",
    features: ["200 次评估/月", "不限面试官席位", "API 接入 & SSO", "审计日志 & 优先支持"],
    cta: "联系销售",
    href: "/dashboard",
    highlight: false,
  },
];

const TESTIMONIALS = [
  { quote: "以前汇总 5 个面试官的评语要 40 分钟，现在 10 分钟搞定。", name: "张敏", role: "HR 总监 @ 某 SaaS 公司", avatar: "张" },
  { quote: "五维框架让我写评语有结构了，不再面完就忘。", name: "李工", role: "技术面试官", avatar: "李" },
  { quote: "AI 评分和资深面试官一致性达 0.82，可以信赖。", name: "陈总", role: "招聘负责人", avatar: "陈" },
  { quote: "红线预警帮我们发现两次简历时间线矛盾，避免了招错人。", name: "王芳", role: "业务面试官", avatar: "王" },
  { quote: "招错一个人成本 55K，年费不到 10%，ROI 非常清晰。", name: "刘总", role: "CEO @ 创业公司", avatar: "刘" },
  { quote: "面试官覆盖机制设计得很好，既辅助又不替代判断。", name: "赵明", role: "HRBP", avatar: "赵" },
];

const FAQ = [
  { q: "AI 评估会替代面试官吗？", a: "不会。InterviewEval 定位为 AI 辅助，所有评分均可被面试官覆盖修正，覆盖数据用于持续校准。" },
  { q: "支持哪些简历格式？", a: "支持 PDF、Markdown 和纯文本粘贴。MVP 版本以文本粘贴为主，PDF 解析在 v1.1 中完善。" },
  { q: "数据安全如何保障？", a: "企业间 tenant 隔离、HTTPS 全链路加密、支持候选人数据一键删除，符合个保法要求。" },
  { q: "免费版有什么限制？", a: "免费版每月 5 次评估、1 个面试官席位，不含多候选人对比和团队协作功能。" },
];

function Shape3D({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute ${className}`}>
      <div className="h-32 w-32 rounded-full bg-gradient-to-br from-violet-500/40 to-blue-500/30 blur-2xl animate-float" />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Announcement bar */}
      <div className="border-b border-white/5 bg-white/[0.02] py-2 text-center text-sm text-zinc-400">
        <span className="text-white">v1.0 已发布</span>
        <span className="mx-2">·</span>
        AI 辅助面试评估，免费体验 5 次
        <Link href="/dashboard" className="ml-2 text-violet-400 hover:text-violet-300">
          立即体验 →
        </Link>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="kit-container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-bold text-black">IE</div>
            <span className="font-semibold tracking-tight">InterviewEval</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-zinc-400 transition hover:text-white">功能</a>
            <a href="#pricing" className="text-sm text-zinc-400 transition hover:text-white">定价</a>
            <a href="#testimonials" className="text-sm text-zinc-400 transition hover:text-white">客户评价</a>
            <a href="#faq" className="text-sm text-zinc-400 transition hover:text-white">FAQ</a>
          </div>
          <Link href="/dashboard" className="kit-btn-primary !px-5 !py-2.5 !text-sm">
            免费开始
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden kit-gradient-bg pb-24 pt-20">
        <Shape3D className="right-[10%] top-10" />
        <Shape3D className="left-[5%] top-32 opacity-60" />
        <div className="kit-container relative grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-in">
            <p className="kit-section-label mb-4">AI 面试评估 SaaS</p>
            <h1 className="kit-heading mb-6">
              通往高效
              <br />
              <span className="kit-gradient-text">招聘决策</span>
              的路径
            </h1>
            <p className="kit-body-lg mb-8 max-w-lg">
              输入简历、面试记录和岗位 JD，AI 输出五维评估报告、追问建议和红线预警。让评估标准化、可追溯。
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard" className="kit-btn-primary">免费开始</Link>
              <Link href="#features" className="kit-btn-secondary">
                了解更多
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
          <div className="relative animate-fade-in">
            <div className="kit-card overflow-hidden p-1">
              <div className="rounded-xl bg-zinc-900 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs text-zinc-500">评估看板</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["待评估", "已评估", "已确认"].map((col, i) => (
                    <div key={col} className="rounded-lg bg-white/5 p-2">
                      <p className="mb-2 text-[10px] font-medium text-zinc-400">{col}</p>
                      {[0, 1].map((j) => (
                        <div key={j} className="mb-1.5 rounded-md bg-white/5 p-2">
                          <div className="h-1.5 w-12 rounded bg-white/20" />
                          <div className="mt-1 h-1 w-8 rounded bg-white/10" />
                          {i === 1 && j === 0 && (
                            <span className="mt-1 inline-block rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[8px] text-emerald-400">82 · Hire</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 opacity-80 blur-sm animate-float" />
          </div>
        </div>
      </section>

      {/* Logo bar */}
      <section className="border-y border-white/5 py-10">
        <div className="kit-container overflow-hidden">
          <p className="mb-6 text-center text-sm text-zinc-500">受到创新型团队信赖</p>
          <div className="flex overflow-hidden">
            <div className="logo-marquee flex shrink-0 gap-16">
              {[...LOGOS, ...LOGOS].map((logo, i) => (
                <span key={i} className="shrink-0 text-lg font-semibold tracking-tight text-zinc-600">{logo}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product preview */}
      <section className="py-24">
        <div className="kit-container text-center">
          <p className="kit-section-label mb-4">产品预览</p>
          <h2 className="kit-subheading mx-auto mb-4 max-w-2xl">更高效的候选人评估方式</h2>
          <p className="kit-body-lg mx-auto mb-16 max-w-xl">从简历解析到五维评分，从追问建议到红线预警，一站式完成面试后评估。</p>
          <div className="kit-card mx-auto max-w-4xl overflow-hidden p-2">
            <div className="rounded-xl bg-zinc-900/80 p-6 text-left">
              <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-lg font-semibold">孙丽华 · 产品经理</h3>
                  <p className="text-sm text-zinc-500">Strong Hire · 综合 82 分</p>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">已评估</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-5">
                {["专业能力 4", "项目经验 4", "沟通表达 5", "匹配度 3", "成长潜力 4"].map((d) => (
                  <div key={d} className="rounded-lg bg-white/5 p-3 text-center">
                    <p className="text-xs text-zinc-500">{d.split(" ")[0]}</p>
                    <p className="mt-1 text-2xl font-bold">{d.split(" ")[1]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-white/5 py-24">
        <div className="kit-container">
          <div className="mb-16 text-center">
            <p className="kit-section-label mb-4">核心能力</p>
            <h2 className="kit-subheading">你需要的一切</h2>
            <p className="kit-body-lg mx-auto mt-4 max-w-xl">专为中小企业招聘场景设计，覆盖评估全流程。</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="kit-card p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                  {f.icon}
                </div>
                <h3 className="mb-2 font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-white/5 py-24">
        <div className="kit-container">
          <div className="mb-16 text-center">
            <p className="kit-section-label mb-4">定价</p>
            <h2 className="kit-subheading">选择适合你的方案</h2>
            <p className="kit-body-lg mx-auto mt-4 max-w-xl">招错一个人成本约 55K，SaaS 年费不到 10%，ROI 清晰。</p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 ${
                  plan.highlight
                    ? "bg-white text-black"
                    : "kit-card"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                    {plan.badge}
                  </span>
                )}
                <h3 className="font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                  <span className={plan.highlight ? "text-zinc-600" : "text-zinc-500"}>{plan.period}</span>
                </div>
                <p className={`mt-2 text-sm ${plan.highlight ? "text-zinc-600" : "text-zinc-400"}`}>{plan.desc}</p>
                <ul className="my-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <svg className={`h-4 w-4 shrink-0 ${plan.highlight ? "text-black" : "text-violet-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block w-full rounded-full py-3 text-center text-sm font-semibold transition ${
                    plan.highlight
                      ? "bg-black text-white hover:bg-zinc-800"
                      : "border border-white/20 hover:bg-white/5"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="border-t border-white/5 py-24">
        <div className="kit-container">
          <div className="mb-16 text-center">
            <p className="kit-section-label mb-4">客户评价</p>
            <h2 className="kit-subheading">用户怎么说</h2>
          </div>
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="kit-card mb-4 break-inside-avoid p-5">
                <p className="mb-4 text-sm leading-relaxed text-zinc-300">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/20 text-sm font-medium text-violet-300">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-white/5 py-24">
        <div className="kit-container max-w-2xl">
          <div className="mb-12 text-center">
            <p className="kit-section-label mb-4">FAQ</p>
            <h2 className="kit-subheading">常见问题</h2>
          </div>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <details key={item.q} className="kit-card group p-5">
                <summary className="cursor-pointer font-medium marker:content-none flex items-center justify-between">
                  {item.q}
                  <svg className="h-5 w-5 text-zinc-500 transition group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-white/5 py-24">
        <Shape3D className="left-[15%] top-0" />
        <Shape3D className="right-[15%] bottom-0" />
        <div className="kit-container relative text-center">
          <h2 className="kit-subheading mb-4">今天免费开始</h2>
          <p className="kit-body-lg mx-auto mb-8 max-w-md">每月 5 次免费评估，无需信用卡，立即体验 AI 辅助面试评估。</p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard" className="kit-btn-primary">免费开始</Link>
            <Link href="/tasks/new" className="kit-btn-secondary">创建评估任务</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16">
        <div className="kit-container grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-bold text-black">IE</div>
              <span className="font-semibold">InterviewEval</span>
            </div>
            <p className="max-w-xs text-sm text-zinc-500">面向中小企业招聘场景的 AI 候选人评估工具。</p>
          </div>
          {[
            { title: "产品", links: ["功能", "定价", "更新日志"] },
            { title: "公司", links: ["关于", "博客", "联系我们"] },
            { title: "资源", links: ["文档", "API", "帮助中心"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-semibold">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}><a href="#" className="text-sm text-zinc-500 hover:text-white">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="kit-container mt-12 border-t border-white/5 pt-8 text-center text-sm text-zinc-600">
          © 2026 InterviewEval. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
