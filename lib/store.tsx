"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  AppState,
  DimensionKey,
  EvaluationTask,
  ScoreOverride,
  TeamMember,
  UserRole,
} from "./types";
import { generateId } from "./utils";

const STORAGE_KEY = "interview-eval-state-v1";

const DEFAULT_TEAM: TeamMember[] = [
  { id: "u1", name: "张敏", email: "zhangmin@demo.com", role: "hr" },
  { id: "u2", name: "李工", email: "ligong@demo.com", role: "interviewer" },
  { id: "u3", name: "王芳", email: "wangfang@demo.com", role: "interviewer" },
  { id: "u4", name: "陈总", email: "chenzong@demo.com", role: "hiring_manager" },
];

const DEMO_TASKS: EvaluationTask[] = [
  {
    id: "demo-1",
    candidateName: "赵小明",
    positionTitle: "高级前端工程师",
    resume: `赵小明 | 5年前端开发经验

工作经历：
2021.03 - 至今 | 某互联网 SaaS 公司 | 高级前端工程师
- 负责 B 端管理后台架构升级，React + TypeScript 技术栈
- 主导组件库建设，覆盖 30+ 业务模块，开发效率提升 40%
- 优化首屏加载，LCP 从 3.2s 降至 1.1s

2019.06 - 2021.02 | 某电商公司 | 前端工程师
- 参与 C 端商城重构，Vue2 迁移至 React
- 负责商品详情页性能优化，转化率提升 8%

技能：React, TypeScript, Node.js, Webpack, 性能优化`,
    jobDescription: `高级前端工程师

要求：
- 3年以上前端开发经验，精通 React/TypeScript
- 有 B 端 SaaS 产品经验优先
- 熟悉性能优化和工程化
- 良好的沟通能力和团队协作`,
    interviewNotes: "",
    assignedInterviewers: ["李工", "王芳"],
    status: "pending",
    createdBy: "张敏",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    overrides: [],
  },
  {
    id: "demo-2",
    candidateName: "孙丽华",
    positionTitle: "产品经理",
    resume: `孙丽华 | 3年产品经验

2022.01 - 至今 | 某 AI 创业公司 | 产品经理
- 负责 AI 写作助手从 0 到 1，DAU 10万+
- 设计 Prompt 评测体系，输出质量提升 35%

2020.07 - 2021.12 | 某教育公司 | 产品助理
- 参与在线课程平台迭代`,
    jobDescription: `产品经理（AI 方向）
- 2年以上产品经验，有 AI 产品经验优先
- 熟悉 Prompt 工程和评测方法论
- 数据驱动，有从 0 到 1 经验`,
    interviewNotes: `技术面（李工）：
- 对 AI 产品理解较深，能讲清楚 Prompt 迭代过程
- 有具体的 badcase 分析和指标口径
- 沟通结构清晰，结论先行
- 不足：B 端经验较少，偏 C 端

综合印象：Strong Hire 倾向，建议加面业务负责人`,
    assignedInterviewers: ["李工"],
    status: "evaluated",
    createdBy: "张敏",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    overrides: [],
    report: {
      overallScore: 82,
      rating: "Strong Hire",
      dimensions: [
        { key: "professional", score: 4, evidence: ["熟悉 Prompt 工程和评测方法论", "能设计 MECE 评分 rubric"] },
        { key: "project", score: 4, evidence: ["AI 写作助手从 0 到 1，DAU 10万+", "有量化成果"] },
        { key: "communication", score: 5, evidence: ["结论先行，结构清晰"] },
        { key: "fit", score: 3, evidence: ["AI 方向匹配，B 端经验不足"] },
        { key: "growth", score: 4, evidence: ["有明确的评测迭代意识"] },
      ],
      followUps: [
        { id: "fu-1", question: "B 端 SaaS 产品的决策逻辑与 C 端有何不同？", focus: "考察 B 端产品思维", expectedDirection: "能从客户付费、ROI 角度分析" },
        { id: "fu-2", question: "AI 写作助手的 badcase 占比是多少？如何定义？", focus: "验证数据真实性", expectedDirection: "有具体口径和样本量" },
        { id: "fu-3", question: "如果让你从 0 设计一个面试评估 AI，你会怎么做？", focus: "考察产品方法论迁移", expectedDirection: "有 eval 体系、Golden Set 思路" },
      ],
      redFlags: [],
      summary: "孙丽华 AI 产品经验丰富，Prompt 评测体系设计能力突出，沟通表达优秀。主要风险是 B 端经验偏少，建议业务面重点考察 toB 产品思维。综合推荐 Strong Hire。",
      generatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
  },
];

function getDefaultState(): AppState {
  return {
    currentUser: DEFAULT_TEAM[0],
    team: DEFAULT_TEAM,
    tasks: DEMO_TASKS,
  };
}

interface AppContextValue extends AppState {
  switchRole: (role: UserRole) => void;
  addTask: (task: Omit<EvaluationTask, "id" | "createdAt" | "updatedAt" | "overrides" | "status">) => void;
  updateTask: (id: string, updates: Partial<EvaluationTask>) => void;
  getTask: (id: string) => EvaluationTask | undefined;
  overrideScore: (taskId: string, override: Omit<ScoreOverride, "modifiedAt">) => void;
  confirmEvaluation: (taskId: string, additionalComment?: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(getDefaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState(JSON.parse(saved));
      }
    } catch {
      /* use default */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, hydrated]);

  const switchRole = useCallback((role: UserRole) => {
    setState((prev) => {
      const member = prev.team.find((m) => m.role === role) || prev.team[0];
      return { ...prev, currentUser: member };
    });
  }, []);

  const addTask = useCallback(
    (task: Omit<EvaluationTask, "id" | "createdAt" | "updatedAt" | "overrides" | "status">) => {
      const now = new Date().toISOString();
      const newTask: EvaluationTask = {
        ...task,
        id: generateId(),
        status: "pending",
        overrides: [],
        createdAt: now,
        updatedAt: now,
      };
      setState((prev) => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
    },
    []
  );

  const updateTask = useCallback((id: string, updates: Partial<EvaluationTask>) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      ),
    }));
  }, []);

  const getTask = useCallback(
    (id: string) => state.tasks.find((t) => t.id === id),
    [state.tasks]
  );

  const overrideScore = useCallback(
    (taskId: string, override: Omit<ScoreOverride, "modifiedAt">) => {
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => {
          if (t.id !== taskId) return t;
          const filtered = t.overrides.filter(
            (o) => o.dimensionKey !== override.dimensionKey
          );
          return {
            ...t,
            overrides: [
              ...filtered,
              { ...override, modifiedAt: new Date().toISOString() },
            ],
            updatedAt: new Date().toISOString(),
          };
        }),
      }));
    },
    []
  );

  const confirmEvaluation = useCallback(
    (taskId: string, additionalComment?: string) => {
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: "confirmed",
                additionalComment,
                confirmedBy: prev.currentUser.name,
                confirmedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : t
        ),
      }));
    },
    []
  );

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        switchRole,
        addTask,
        updateTask,
        getTask,
        overrideScore,
        confirmEvaluation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export type { DimensionKey };
