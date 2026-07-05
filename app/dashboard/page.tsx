"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import TaskCard from "@/components/TaskCard";
import type { EvaluationStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

const COLUMNS: { status: EvaluationStatus; color: string }[] = [
  { status: "pending", color: "bg-amber-400" },
  { status: "evaluated", color: "bg-blue-400" },
  { status: "confirmed", color: "bg-emerald-400" },
];

export default function DashboardPage() {
  const { tasks, currentUser } = useApp();

  const filtered =
    currentUser.role === "interviewer"
      ? tasks.filter((t) => t.assignedInterviewers.includes(currentUser.name))
      : tasks;

  return (
    <div className="kit-container py-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="kit-section-label mb-2">工作台</p>
          <h1 className="text-2xl font-bold tracking-tight text-theme">评估进度看板</h1>
          <p className="mt-1 text-sm text-theme-muted">
            共 {filtered.length} 个评估任务
          </p>
        </div>
        <Link href="/tasks/new" className="kit-btn-primary !py-2.5 !text-sm">
          + 创建任务
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {COLUMNS.map(({ status, color }) => {
          const columnTasks = filtered.filter((t) => t.status === status);
          return (
            <div key={status}>
              <div className="mb-4 flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${color}`} />
                <h2 className="text-sm font-semibold text-theme-muted">
                  {STATUS_LABELS[status]}
                </h2>
                <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-xs font-medium text-theme-subtle">
                  {columnTasks.length}
                </span>
              </div>
              <div className="space-y-3">
                {columnTasks.length === 0 ? (
                  <div className="kit-empty">暂无任务</div>
                ) : (
                  columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
