"use client";

import {
  DIMENSION_LABELS,
  type DimensionKey,
  type ScoreOverride,
} from "@/lib/types";
import { cn, getEffectiveScore } from "@/lib/utils";

interface Props {
  dimensionKey: DimensionKey;
  aiScore: number;
  evidence: string[];
  overrides: ScoreOverride[];
  onOverride?: () => void;
  readonly?: boolean;
}

export default function DimensionCard({
  dimensionKey,
  aiScore,
  evidence,
  overrides,
  onOverride,
  readonly,
}: Props) {
  const meta = DIMENSION_LABELS[dimensionKey];
  const effectiveScore = getEffectiveScore(dimensionKey, aiScore, overrides);
  const override = overrides.find((o) => o.dimensionKey === dimensionKey);
  const isOverridden = !!override;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{meta.label}</h3>
          <p className="mt-0.5 text-xs text-slate-500">{meta.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold",
              effectiveScore >= 4
                ? "bg-emerald-100 text-emerald-700"
                : effectiveScore >= 3
                  ? "bg-blue-100 text-blue-700"
                  : effectiveScore >= 2
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
            )}
          >
            {effectiveScore}
          </div>
          {!readonly && onOverride && (
            <button
              onClick={onOverride}
              className="rounded-md px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50"
            >
              修改
            </button>
          )}
        </div>
      </div>

      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="score-bar h-full rounded-full transition-all"
          style={{ width: `${(effectiveScore / 5) * 100}%` }}
        />
      </div>

      <ul className="space-y-1.5">
        {evidence.map((e, i) => (
          <li key={i} className="flex gap-2 text-sm text-slate-600">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
            {e}
          </li>
        ))}
      </ul>

      {isOverridden && override && (
        <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <span className="font-medium">已覆盖：</span>
          AI {override.originalScore} → {override.newScore} 分
          <span className="mx-1">·</span>
          {override.reason}
          <span className="mx-1 text-amber-600">·</span>
          {override.modifiedBy}
        </div>
      )}
    </div>
  );
}
