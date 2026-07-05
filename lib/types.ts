export type UserRole = "hr" | "interviewer" | "hiring_manager" | "admin";

export type EvaluationStatus = "pending" | "evaluated" | "confirmed";

export type HireRating = "Strong Hire" | "Hire" | "Weak Hire" | "No Hire";

export type DimensionKey =
  | "professional"
  | "project"
  | "communication"
  | "fit"
  | "growth";

export interface DimensionScore {
  key: DimensionKey;
  score: number;
  evidence: string[];
}

export interface FollowUpSuggestion {
  id: string;
  question: string;
  focus: string;
  expectedDirection: string;
  adopted?: boolean;
}

export interface RedFlag {
  id: string;
  type: string;
  description: string;
  verificationMethod: string;
  severity: "high" | "medium" | "low";
}

export interface ScoreOverride {
  dimensionKey: DimensionKey;
  originalScore: number;
  newScore: number;
  reason: string;
  modifiedBy: string;
  modifiedAt: string;
}

export interface EvaluationReport {
  overallScore: number;
  rating: HireRating;
  dimensions: DimensionScore[];
  followUps: FollowUpSuggestion[];
  redFlags: RedFlag[];
  summary: string;
  generatedAt: string;
  isMock?: boolean;
}

export interface EvaluationTask {
  id: string;
  candidateName: string;
  positionTitle: string;
  resume: string;
  jobDescription: string;
  interviewNotes: string;
  assignedInterviewers: string[];
  status: EvaluationStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  report?: EvaluationReport;
  overrides: ScoreOverride[];
  additionalComment?: string;
  confirmedBy?: string;
  confirmedAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AppState {
  currentUser: TeamMember;
  team: TeamMember[];
  tasks: EvaluationTask[];
}

export const DIMENSION_LABELS: Record<
  DimensionKey,
  { label: string; description: string }
> = {
  professional: {
    label: "专业能力",
    description: "岗位所需的硬技能和知识深度",
  },
  project: {
    label: "项目经验",
    description: "过往项目的复杂度、角色和成果",
  },
  communication: {
    label: "沟通表达",
    description: "逻辑清晰度和信息组织能力",
  },
  fit: {
    label: "匹配度",
    description: "技能、经验和岗位要求的契合度",
  },
  growth: {
    label: "成长潜力",
    description: "学习能力、自驱力和职业规划",
  },
};

export const RATING_CONFIG: Record<
  HireRating,
  { label: string; color: string; bg: string }
> = {
  "Strong Hire": { label: "Strong Hire", color: "text-emerald-700", bg: "bg-emerald-100" },
  Hire: { label: "Hire", color: "text-blue-700", bg: "bg-blue-100" },
  "Weak Hire": { label: "Weak Hire", color: "text-amber-700", bg: "bg-amber-100" },
  "No Hire": { label: "No Hire", color: "text-red-700", bg: "bg-red-100" },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  hr: "HR",
  interviewer: "面试官",
  hiring_manager: "招聘负责人",
  admin: "管理员",
};

export const STATUS_LABELS: Record<EvaluationStatus, string> = {
  pending: "待评估",
  evaluated: "已评估",
  confirmed: "已确认",
};
