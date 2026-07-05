"use client";

import { useState } from "react";
import { DIMENSION_LABELS, type DimensionKey } from "@/lib/types";
import { cn } from "@/lib/utils";

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
    onConfirm(newScore, reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 kit-modal-bg p-4">
      <div className="kit-modal animate-fade-in">
        <h3 className="text-lg font-semibold text-theme">
          覆盖评分 · {meta.label}
        </h3>
        <p className="mt-1 text-sm text-theme-subtle">
          AI 原始评分：{originalScore} 分
        </p>

        <div className="mt-4">
          <label className="text-sm font-medium text-theme-muted">新评分</label>
          <div className="mt-2 flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setNewScore(s)}
                className={cn(
                  "h-10 w-10 rounded-lg text-sm font-bold transition-colors",
                  newScore === s
                    ? "bg-[var(--color-btn-primary-bg)] text-[var(--color-btn-primary-text)]"
                    : "bg-[var(--color-surface)] text-theme-muted hover:bg-[var(--color-surface-hover)]"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-theme-muted">
            修改原因 <span className="text-red-400">*</span>
            <span className="ml-2 font-normal text-theme-subtle">
              {reason.length}/50
            </span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value.slice(0, 50))}
            placeholder="简述修改原因，用于模型校准"
            rows={2}
            className="kit-textarea mt-1.5"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="kit-btn-secondary !py-2 !text-sm">
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason.trim()}
            className="kit-btn-primary !py-2 !text-sm disabled:opacity-50"
          >
            确认覆盖
          </button>
        </div>
      </div>
    </div>
  );
}
