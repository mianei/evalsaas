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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              IE
            </div>
            <span className="hidden font-semibold text-slate-900 sm:inline">
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
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 rounded-lg border border-slate-200 p-0.5 sm:flex">
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => switchRole(role)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  currentUser.role === role
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {ROLE_LABELS[role]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5">
            <div className="h-6 w-6 rounded-full bg-indigo-200 text-center text-xs leading-6 text-indigo-700">
              {currentUser.name[0]}
            </div>
            <span className="text-sm font-medium text-slate-700">
              {currentUser.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
