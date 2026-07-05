"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";
import { ROLE_LABELS, type UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";

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
    <header className="kit-header">
      <div className="kit-container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2.5 text-theme">
            <div className="kit-logo-icon">IE</div>
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
                  "kit-nav-link",
                  pathname.startsWith(item.href) && "active"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="kit-role-switch hidden sm:flex">
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => switchRole(role)}
                className={cn(
                  "kit-role-btn",
                  currentUser.role === role && "active"
                )}
              >
                {ROLE_LABELS[role]}
              </button>
            ))}
          </div>
          <div className="kit-user-pill">
            <div className="kit-avatar h-6 w-6 text-xs">
              {currentUser.name[0]}
            </div>
            <span>{currentUser.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
