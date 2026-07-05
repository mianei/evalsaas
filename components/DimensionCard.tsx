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

const SCORE_STYLE = (score: number) =>
  score >= 4
    ? "bg-emerald-500/20 text-emerald-400"
    : score >= 3
      ? "bg-blue-500/20 text-blue-400"
      : score >= 2
        ? "bg-amber-500/20 text-amber-400"
        : "bg-red-500/20 text-red-400";

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
    <div className="kit-card p-4">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-white">{meta.label}</h3>
          <p className="mt-0.5 text-xs text-zinc-500">{meta.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold",
              SCORE_STYLE(effectiveScore)
            )}
          >
            {effectiveScore}
          </div>
          {!readonly && onOverride && (
            <button
              onClick={onOverride}
              className="rounded-full px-2.5 py-1 text-xs text-violet-400 hover:bg-violet-500/10"
            >
              修改
            </button>
          )}
        </div>
      </div>

      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/5">
        <div
          className="score-bar h-full rounded-full transition-all"
          style={{ width: `${(effectiveScore / 5) * 100}%` }}
        />
      </div>

      <ul className="space-y-1.5">
        {evidence.map((e, i) => (
          <li key={i} className="flex gap-2 text-sm text-zinc-400">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-400" />
            {e}
          </li>
        ))}
      </ul>

      {isOverridden && override && (
        <div className="mt-3 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
          <span className="font-medium">已覆盖：</span>
          AI {override.originalScore} → {override.newScore} 分
          <span className="mx-1">·</span>
          {override.reason}
          <span className="mx-1 text-amber-500/60">·</span>
          {override.modifiedBy}
        </div>
      )}
    </div>
  );
}
