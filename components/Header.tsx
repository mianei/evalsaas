"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";
import { ROLE_LABELS, type UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "评估看板" },
  { href: "/tasks/new", label: "创建任务" },
];

const ROLES: UserRole[] = ["hr", "interviewer", "hiring_manager"];

export default function Header() {
  const pathname = usePathname();
  const { currentUser, switchRole } = useApp();
  const isLanding = pathname === "/";

  if (isLanding) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="kit-container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-bold text-black">
              IE
            </div>
            <span className="hidden font-semibold tracking-tight sm:inline">
              InterviewEval
            </span>
          </Link>
          <nav className="flex gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  pathname.startsWith(item.href)
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-0.5 rounded-full border border-white/10 p-0.5 sm:flex">
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => switchRole(role)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                  currentUser.role === role
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                {ROLE_LABELS[role]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-xs font-medium text-violet-300">
              {currentUser.name[0]}
            </div>
            <span className="text-sm font-medium text-zinc-300">
              {currentUser.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
