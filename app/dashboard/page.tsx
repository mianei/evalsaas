"use client";

import Link from "next/link";
import { useApp } from "@/lib/store";
import TaskCard from "@/components/TaskCard";
import type { EvaluationStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

const COLUMNS: { status: EvaluationStatus; color: string }[] = [
  { status: "pending", color: "bg-amber-500" },
  { status: "evaluated", color: "bg-blue-500" },
  { status: "confirmed", color: "bg-emerald-500" },
];

export default function DashboardPage() {
  const { tasks, currentUser } = useApp();

  const filtered =
    currentUser.role === "interviewer"
      ? tasks.filter((t) => t.assignedInterviewers.includes(currentUser.name))
      : tasks;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">评估进度看板</h1>
          <p className="mt-1 text-sm text-slate-500">
            共 {filtered.length} 个评估任务
          </p>
        </div>
        <Link
          href="/tasks/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + 创建任务
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {COLUMNS.map(({ status, color }) => {
          const columnTasks = filtered.filter((t) => t.status === status);
          return (
            <div key={status}>
              <div className="mb-4 flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
                <h2 className="font-semibold text-slate-700">
                  {STATUS_LABELS[status]}
                </h2>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                  {columnTasks.length}
                </span>
              </div>
              <div className="space-y-3">
                {columnTasks.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
                    暂无任务
                  </div>
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
