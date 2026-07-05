import type { DimensionKey, DimensionScore, EvaluationReport } from "./types";

function extractKeywords(text: string): string[] {
  const keywords = [
    "React",
    "Vue",
    "Node",
    "Python",
    "Java",
    "Go",
    "产品",
    "运营",
    "设计",
    "管理",
    "数据分析",
    "AI",
    "机器学习",
    "后端",
    "前端",
    "全栈",
    "SaaS",
    "B端",
    "C端",
  ];
  return keywords.filter((k) => text.includes(k)).slice(0, 3);
}

function scoreFromContent(resume: string, notes: string): number {
  const combined = resume + notes;
  let score = 55;
  if (combined.length > 500) score += 10;
  if (combined.length > 1000) score += 5;
  if (/负责|主导|独立|带领|优化|提升|%\d|增长/.test(combined)) score += 10;
  if (/项目|经验|年/.test(combined)) score += 5;
  if (/模糊|不太|一般|还行/.test(notes)) score -= 5;
  return Math.min(92, Math.max(45, score));
}

export function generateMockEvaluation(input: {
  candidateName: string;
  positionTitle: string;
  resume: string;
  jobDescription: string;
  interviewNotes: string;
}): EvaluationReport {
  const combined = input.resume + input.interviewNotes + input.jobDescription;
  const overall = scoreFromContent(input.resume, input.interviewNotes);
  const baseDim = Math.round(overall / 20);

  const keywords = extractKeywords(combined);
  const kwStr = keywords.length > 0 ? keywords.join("、") : "相关技能";

  let rating: EvaluationReport["rating"];
  if (overall >= 85) rating = "Strong Hire";
  else if (overall >= 70) rating = "Hire";
  else if (overall >= 55) rating = "Weak Hire";
  else rating = "No Hire";

  const redFlags: EvaluationReport["redFlags"] = [];
  if (/20\d{2}.*20\d{2}/.test(input.resume) && input.resume.includes("至今")) {
    redFlags.push({
      id: "rf-1",
      type: "时间线不一致",
      description: "简历中存在可能的时间线重叠，建议核实",
      verificationMethod: "要求候选人补充详细工作经历时间线",
      severity: "medium",
    });
  }
  if (input.interviewNotes.includes("离职") && !/原因|因为/.test(input.interviewNotes)) {
    redFlags.push({
      id: "rf-2",
      type: "离职原因模糊",
      description: "面试记录中未明确离职原因",
      verificationMethod: "在下一轮面试中直接追问离职动机",
      severity: "low",
    });
  }

  return {
    overallScore: overall,
    rating,
    dimensions: (
      [
        {
          key: "professional" as DimensionKey,
          score: Math.min(5, baseDim + 1),
          evidence: [
            `掌握 ${kwStr} 相关技能`,
            input.interviewNotes.slice(0, 80) || "简历中展示了相关技术栈",
          ],
        },
        {
          key: "project" as DimensionKey,
          score: baseDim,
          evidence: [
            /项目/.test(combined)
              ? "有完整项目经历描述"
              : "项目经历描述较少，需进一步核实",
          ],
        },
        {
          key: "communication" as DimensionKey,
          score: Math.min(5, baseDim),
          evidence: [
            input.interviewNotes.length > 100
              ? "面试记录结构较清晰"
              : "面试记录较短，沟通表达能力待进一步观察",
          ],
        },
        {
          key: "fit" as DimensionKey,
          score:
            input.jobDescription && input.resume
              ? Math.min(5, baseDim + 1)
              : baseDim,
          evidence: [
            input.jobDescription
              ? `与「${input.positionTitle}」岗位有一定匹配`
              : "未提供 JD，匹配度基于面试记录推断",
          ],
        },
        {
          key: "growth" as DimensionKey,
          score: /学习|成长|自驱|复盘/.test(combined)
            ? baseDim + 1
            : baseDim - 1,
          evidence: [
            /学习|成长/.test(combined)
              ? "展现了学习意愿"
              : "成长潜力需通过后续面试进一步验证",
          ],
        },
      ] satisfies DimensionScore[]
    ).map((d) => ({ ...d, score: Math.max(1, Math.min(5, d.score)) })),
    followUps: [
      {
        id: "fu-1",
        question: `请详细描述你在 ${kwStr} 相关项目中的具体角色和贡献占比？`,
        focus: "验证项目经历真实性",
        expectedDirection: "能清晰说明个人职责边界和关键决策",
      },
      {
        id: "fu-2",
        question: "遇到最大的技术/业务挑战是什么？你是如何解决的？",
        focus: "考察问题解决能力和思维深度",
        expectedDirection: "有具体案例、方法论和量化结果",
      },
      {
        id: "fu-3",
        question: `为什么选择「${input.positionTitle}」这个方向？你的 3 年职业规划是什么？`,
        focus: "考察匹配度和稳定性",
        expectedDirection: "目标清晰，与岗位方向一致",
      },
    ],
    redFlags,
    summary: `${input.candidateName} 应聘 ${input.positionTitle} 岗位，综合评分 ${overall} 分（${rating}）。${keywords.length > 0 ? `具备 ${kwStr} 相关背景，` : ""}项目经验和沟通能力${baseDim >= 3 ? "表现良好" : "有待加强"}。${redFlags.length > 0 ? `发现 ${redFlags.length} 项需关注的风险点，` : ""}建议${rating === "No Hire" || rating === "Weak Hire" ? "谨慎推进" : "进入下一轮面试"}。`,
    generatedAt: new Date().toISOString(),
    isMock: true,
  };
}
