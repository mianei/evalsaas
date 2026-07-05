"use client";

import Link from "next/link";
import type { EvaluationTask } from "@/lib/types";
import { RATING_CONFIG, STATUS_LABELS } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

interface Props {
  task: EvaluationTask;
}

const STATUS_COLORS = {
  pending: "border-l-amber-400 bg-amber-50/50",
  evaluated: "border-l-blue-400 bg-blue-50/50",
  confirmed: "border-l-emerald-400 bg-emerald-50/50",
};

export default function TaskCard({ task }: Props) {
  return (
    <Link
      href={`/evaluations/${task.id}`}
      className={cn(
        "block rounded-xl border border-slate-200 border-l-4 bg-white p-4 shadow-sm transition-all hover:shadow-md",
        STATUS_COLORS[task.status]
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-900">{task.candidateName}</h3>
          <p className="mt-0.5 text-sm text-slate-500">{task.positionTitle}</p>
        </div>
        {task.report && (
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
              RATING_CONFIG[task.report.rating].bg,
              RATING_CONFIG[task.report.rating].color
            )}
          >
            {task.report.overallScore}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="rounded bg-slate-100 px-2 py-0.5">
          {STATUS_LABELS[task.status]}
        </span>
        <span>面试官：{task.assignedInterviewers.join("、")}</span>
      </div>

      <p className="mt-2 text-xs text-slate-400">
        {formatDate(task.updatedAt)}
      </p>
    </Link>
  );
}
