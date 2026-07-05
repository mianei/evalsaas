"use client";

import { useState } from "react";
import { DIMENSION_LABELS, type DimensionKey } from "@/lib/types";

interface Props {
  dimensionKey: DimensionKey;
  originalScore: number;
  onConfirm: (newScore: number, reason: string) => void;
  onClose: () => void;
}

export default function OverrideModal({
  dimensionKey,
  originalScore,
  onConfirm,
  onClose,
}: Props) {
  const [newScore, setNewScore] = useState(originalScore);
  const [reason, setReason] = useState("");
  const meta = DIMENSION_LABELS[dimensionKey];

  const handleSubmit = () => {
    if (!reason.trim()) return;
    if (reason.length > 50) return;
    onConfirm(newScore, reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md animate-fade-in rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900">
          覆盖评分 · {meta.label}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          AI 原始评分：{originalScore} 分
        </p>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-700">新评分</label>
          <div className="mt-2 flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setNewScore(s)}
                className={`h-10 w-10 rounded-lg text-sm font-bold transition-colors ${
                  newScore === s
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-700">
            修改原因 <span className="text-red-500">*</span>
            <span className="ml-2 font-normal text-slate-400">
              {reason.length}/50
            </span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value.slice(0, 50))}
            placeholder="简述修改原因，用于模型校准"
            rows={2}
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason.trim()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            确认覆盖
          </button>
        </div>
      </div>
    </div>
  );
}
