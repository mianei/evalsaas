"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import DimensionCard from "@/components/DimensionCard";
import OverrideModal from "@/components/OverrideModal";
import {
  RATING_CONFIG,
  STATUS_LABELS,
  type DimensionKey,
  type EvaluationReport,
} from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

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
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-slate-500">评估任务不存在</p>
        <Link href="/dashboard" className="mt-4 inline-block text-indigo-600">
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
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          ← 返回看板
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {task.candidateName}
          </h1>
          <p className="mt-1 text-slate-500">{task.positionTitle}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">
              {STATUS_LABELS[task.status]}
            </span>
            <span className="text-slate-400">
              面试官：{task.assignedInterviewers.join("、")}
            </span>
          </div>
        </div>

        {report && (
          <div className="text-right">
            <div className="text-4xl font-bold text-slate-900">
              {report.overallScore}
            </div>
            <span
              className={cn(
                "mt-1 inline-block rounded-full px-3 py-1 text-sm font-semibold",
                RATING_CONFIG[report.rating].bg,
                RATING_CONFIG[report.rating].color
              )}
            >
              {report.rating}
            </span>
            {report.isMock && (
              <p className="mt-1 text-xs text-amber-600">模拟评估模式</p>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {notice && (
        <div className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {notice}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">简历</h2>
            <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap text-sm text-slate-600">
              {task.resume || "（未提供）"}
            </pre>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">岗位 JD</h2>
            <pre className="mt-3 max-h-32 overflow-auto whitespace-pre-wrap text-sm text-slate-600">
              {task.jobDescription || "（未提供）"}
            </pre>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">面试记录</h2>
            <textarea
              value={interviewNotes}
              onChange={(e) => setInterviewNotes(e.target.value)}
              disabled={task.status === "confirmed" || !canEvaluate}
              rows={8}
              placeholder="粘贴面试笔记（支持 Markdown）"
              className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50"
            />
            {canEvaluate && task.status !== "confirmed" && (
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="mt-3 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading
                  ? "AI 评估中..."
                  : report
                    ? "重新生成评估"
                    : "生成 AI 评估报告"}
              </button>
            )}
          </section>
        </div>

        <div className="space-y-6">
          {report ? (
            <>
              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <h2 className="font-semibold text-slate-900">AI 总结</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {report.summary}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  生成于 {formatDate(report.generatedAt)}
                </p>
              </section>

              <section>
                <h2 className="mb-3 font-semibold text-slate-900">五维评估</h2>
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
                <section className="rounded-xl border border-slate-200 bg-white p-5">
                  <h2 className="font-semibold text-slate-900">追问建议</h2>
                  <ul className="mt-3 space-y-3">
                    {report.followUps.map((f) => (
                      <li
                        key={f.id}
                        className="rounded-lg bg-slate-50 p-3 text-sm"
                      >
                        <p className="font-medium text-slate-800">
                          {f.question}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          考察点：{f.focus}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          预期方向：{f.expectedDirection}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {report.redFlags.length > 0 && (
                <section className="rounded-xl border border-red-200 bg-red-50 p-5">
                  <h2 className="font-semibold text-red-800">红线预警</h2>
                  <ul className="mt-3 space-y-3">
                    {report.redFlags.map((rf) => (
                      <li
                        key={rf.id}
                        className="rounded-lg bg-white p-3 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "rounded px-1.5 py-0.5 text-xs font-medium",
                              rf.severity === "high"
                                ? "bg-red-100 text-red-700"
                                : rf.severity === "medium"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-600"
                            )}
                          >
                            {rf.type}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-700">{rf.description}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          核实方式：{rf.verificationMethod}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {task.status !== "confirmed" && canEvaluate && (
                <section className="rounded-xl border border-slate-200 bg-white p-5">
                  <h2 className="font-semibold text-slate-900">确认评估</h2>
                  <textarea
                    value={additionalComment}
                    onChange={(e) => setAdditionalComment(e.target.value)}
                    rows={3}
                    placeholder="补充个人判断（可选）"
                    className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    onClick={handleConfirm}
                    className="mt-3 w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    确认评估
                  </button>
                </section>
              )}

              {task.status === "confirmed" && (
                <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                  <p className="text-sm font-medium text-emerald-800">
                    已由 {task.confirmedBy} 确认
                  </p>
                  {task.additionalComment && (
                    <p className="mt-2 text-sm text-emerald-700">
                      {task.additionalComment}
                    </p>
                  )}
                  {task.confirmedAt && (
                    <p className="mt-1 text-xs text-emerald-600">
                      {formatDate(task.confirmedAt)}
                    </p>
                  )}
                </section>
              )}
            </>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
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
