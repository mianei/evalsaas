"use client";

import Link from "next/link";
import type { EvaluationTask } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

interface Props {
  task: EvaluationTask;
}

const STATUS_BORDER = {
  pending: "border-l-amber-400",
  evaluated: "border-l-blue-400",
  confirmed: "border-l-emerald-400",
};

const RATING_COLORS: Record<string, string> = {
  "Strong Hire": "bg-emerald-500/20 text-emerald-400",
  Hire: "bg-blue-500/20 text-blue-400",
  "Weak Hire": "bg-amber-500/20 text-amber-400",
  "No Hire": "bg-red-500/20 text-red-400",
};

export default function TaskCard({ task }: Props) {
  return (
    <Link
      href={`/evaluations/${task.id}`}
      className={cn(
        "kit-card block border-l-4 p-4",
        STATUS_BORDER[task.status]
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-white">{task.candidateName}</h3>
          <p className="mt-0.5 text-sm text-zinc-500">{task.positionTitle}</p>
        </div>
        {task.report && (
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
              RATING_COLORS[task.report.rating]
            )}
          >
            {task.report.overallScore}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-zinc-400">
          {STATUS_LABELS[task.status]}
        </span>
        <span>面试官：{task.assignedInterviewers.join("、")}</span>
      </div>

      <p className="mt-2 text-xs text-zinc-600">
        {formatDate(task.updatedAt)}
      </p>
    </Link>
  );
}
