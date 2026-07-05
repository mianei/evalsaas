"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import DimensionCard from "@/components/DimensionCard";
import OverrideModal from "@/components/OverrideModal";
import {
  STATUS_LABELS,
  type DimensionKey,
  type EvaluationReport,
  type HireRating,
} from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

const RATING_DARK: Record<HireRating, string> = {
  "Strong Hire": "bg-emerald-500/20 text-emerald-400",
  Hire: "bg-blue-500/20 text-blue-400",
  "Weak Hire": "bg-amber-500/20 text-amber-400",
  "No Hire": "bg-red-500/20 text-red-400",
};

export default function EvaluationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getTask, updateTask, overrideScore, confirmEvaluation, currentUser } =
    useApp();

  const task = getTask(id);
  const [interviewNotes, setInterviewNotes] = useState(task?.interviewNotes || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [overrideDim, setOverrideDim] = useState<DimensionKey | null>(null);
  const [additionalComment, setAdditionalComment] = useState(
    task?.additionalComment || ""
  );

  if (!task) {
    return (
      <div className="kit-container py-16 text-center">
        <p className="text-zinc-500">评估任务不存在</p>
        <Link href="/dashboard" className="mt-4 inline-block text-violet-400 hover:text-violet-300">
          返回看板
        </Link>
      </div>
    );
  }

  const report = task.report;
  const canEvaluate =
    task.assignedInterviewers.includes(currentUser.name) ||
    currentUser.role === "hr" ||
    currentUser.role === "hiring_manager";

  const handleGenerate = async () => {
    if (!interviewNotes.trim() && !task.resume.trim()) {
      setError("请填写面试记录或确保已有简历");
      return;
    }
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName: task.candidateName,
          positionTitle: task.positionTitle,
          resume: task.resume,
          jobDescription: task.jobDescription,
          interviewNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "评估失败");

      updateTask(id, {
        interviewNotes,
        report: data.report as EvaluationReport,
        status: "evaluated",
        overrides: [],
      });

      if (data.message) setNotice(data.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : "评估失败");
    } finally {
      setLoading(false);
    }
  };

  const handleOverride = (newScore: number, reason: string) => {
    if (!overrideDim || !report) return;
    const dim = report.dimensions.find((d) => d.key === overrideDim);
    if (!dim) return;

    overrideScore(id, {
      dimensionKey: overrideDim,
      originalScore: dim.score,
      newScore,
      reason,
      modifiedBy: currentUser.name,
    });
    setOverrideDim(null);
  };

  const handleConfirm = () => {
    confirmEvaluation(id, additionalComment.trim() || undefined);
  };

  return (
    <div className="kit-container max-w-5xl py-10">
      <Link href="/dashboard" className="text-sm text-zinc-500 transition hover:text-white">
        ← 返回看板
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {task.candidateName}
          </h1>
          <p className="mt-1 text-zinc-500">{task.positionTitle}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-zinc-400">
              {STATUS_LABELS[task.status]}
            </span>
            <span className="text-zinc-600">
              面试官：{task.assignedInterviewers.join("、")}
            </span>
          </div>
        </div>

        {report && (
          <div className="text-right">
            <div className="text-4xl font-bold tracking-tight text-white">
              {report.overallScore}
            </div>
            <span className={cn("mt-1 inline-block rounded-full px-3 py-1 text-sm font-semibold", RATING_DARK[report.rating])}>
              {report.rating}
            </span>
            {report.isMock && (
              <p className="mt-1 text-xs text-amber-400">模拟评估模式</p>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {notice && (
        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          {notice}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <section className="kit-card p-5">
            <h2 className="font-semibold text-white">简历</h2>
            <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap text-sm text-zinc-400">
              {task.resume || "（未提供）"}
            </pre>
          </section>

          <section className="kit-card p-5">
            <h2 className="font-semibold text-white">岗位 JD</h2>
            <pre className="mt-3 max-h-32 overflow-auto whitespace-pre-wrap text-sm text-zinc-400">
              {task.jobDescription || "（未提供）"}
            </pre>
          </section>

          <section className="kit-card p-5">
            <h2 className="font-semibold text-white">面试记录</h2>
            <textarea
              value={interviewNotes}
              onChange={(e) => setInterviewNotes(e.target.value)}
              disabled={task.status === "confirmed" || !canEvaluate}
              rows={8}
              placeholder="粘贴面试笔记（支持 Markdown）"
              className="kit-textarea mt-3 disabled:opacity-50"
            />
            {canEvaluate && task.status !== "confirmed" && (
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="kit-btn-primary mt-3 w-full !py-2.5 disabled:opacity-50"
              >
                {loading ? "AI 评估中..." : report ? "重新生成评估" : "生成 AI 评估报告"}
              </button>
            )}
          </section>
        </div>

        <div className="space-y-6">
          {report ? (
            <>
              <section className="kit-card p-5">
                <h2 className="font-semibold text-white">AI 总结</h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{report.summary}</p>
                <p className="mt-2 text-xs text-zinc-600">生成于 {formatDate(report.generatedAt)}</p>
              </section>

              <section>
                <h2 className="mb-3 font-semibold text-white">五维评估</h2>
                <div className="space-y-3">
                  {report.dimensions.map((dim) => (
                    <DimensionCard
                      key={dim.key}
                      dimensionKey={dim.key}
                      aiScore={dim.score}
                      evidence={dim.evidence}
                      overrides={task.overrides}
                      onOverride={
                        task.status !== "confirmed" && canEvaluate
                          ? () => setOverrideDim(dim.key)
                          : undefined
                      }
                      readonly={task.status === "confirmed"}
                    />
                  ))}
                </div>
              </section>

              {report.followUps.length > 0 && (
                <section className="kit-card p-5">
                  <h2 className="font-semibold text-white">追问建议</h2>
                  <ul className="mt-3 space-y-3">
                    {report.followUps.map((f) => (
                      <li key={f.id} className="rounded-lg bg-white/5 p-3 text-sm">
                        <p className="font-medium text-zinc-200">{f.question}</p>
                        <p className="mt-1 text-xs text-zinc-500">考察点：{f.focus}</p>
                        <p className="mt-0.5 text-xs text-zinc-600">预期方向：{f.expectedDirection}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {report.redFlags.length > 0 && (
                <section className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
                  <h2 className="font-semibold text-red-400">红线预警</h2>
                  <ul className="mt-3 space-y-3">
                    {report.redFlags.map((rf) => (
                      <li key={rf.id} className="kit-card p-3 text-sm">
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-xs font-medium",
                            rf.severity === "high"
                              ? "bg-red-500/20 text-red-400"
                              : rf.severity === "medium"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-white/5 text-zinc-400"
                          )}
                        >
                          {rf.type}
                        </span>
                        <p className="mt-1 text-zinc-300">{rf.description}</p>
                        <p className="mt-1 text-xs text-zinc-500">核实方式：{rf.verificationMethod}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {task.status !== "confirmed" && canEvaluate && (
                <section className="kit-card p-5">
                  <h2 className="font-semibold text-white">确认评估</h2>
                  <textarea
                    value={additionalComment}
                    onChange={(e) => setAdditionalComment(e.target.value)}
                    rows={3}
                    placeholder="补充个人判断（可选）"
                    className="kit-textarea mt-3"
                  />
                  <button
                    onClick={handleConfirm}
                    className="mt-3 w-full rounded-full bg-emerald-500 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400"
                  >
                    确认评估
                  </button>
                </section>
              )}

              {task.status === "confirmed" && (
                <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                  <p className="text-sm font-medium text-emerald-400">
                    已由 {task.confirmedBy} 确认
                  </p>
                  {task.additionalComment && (
                    <p className="mt-2 text-sm text-emerald-300">{task.additionalComment}</p>
                  )}
                  {task.confirmedAt && (
                    <p className="mt-1 text-xs text-emerald-500/60">{formatDate(task.confirmedAt)}</p>
                  )}
                </section>
              )}
            </>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-zinc-600">
              填写面试记录后，点击「生成 AI 评估报告」
            </div>
          )}
        </div>
      </div>

      {overrideDim && report && (
        <OverrideModal
          dimensionKey={overrideDim}
          originalScore={
            report.dimensions.find((d) => d.key === overrideDim)?.score || 3
          }
          onConfirm={handleOverride}
          onClose={() => setOverrideDim(null)}
        />
      )}
    </div>
  );
}
