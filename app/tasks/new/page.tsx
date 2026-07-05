"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function CreateTaskPage() {
  const router = useRouter();
  const { addTask, currentUser, team } = useApp();

  const [candidateName, setCandidateName] = useState("");
  const [positionTitle, setPositionTitle] = useState("");
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedInterviewers, setSelectedInterviewers] = useState<string[]>([]);

  const interviewers = team.filter((m) => m.role === "interviewer");

  const toggleInterviewer = (name: string) => {
    setSelectedInterviewers((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !positionTitle.trim()) return;

    addTask({
      candidateName: candidateName.trim(),
      positionTitle: positionTitle.trim(),
      resume: resume.trim(),
      jobDescription: jobDescription.trim(),
      interviewNotes: "",
      assignedInterviewers:
        selectedInterviewers.length > 0
          ? selectedInterviewers
          : [interviewers[0]?.name || "李工"],
      createdBy: currentUser.name,
    });

    router.push("/dashboard");
  };

  return (
    <div className="kit-container max-w-3xl py-10">
      <p className="kit-section-label mb-2">新建</p>
      <h1 className="text-2xl font-bold tracking-tight">创建评估任务</h1>
      <p className="mt-1 text-sm text-zinc-500">
        上传候选人简历、粘贴 JD，分配给面试官
      </p>

      <form onSubmit={handleSubmit} className="kit-card mt-8 space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-zinc-300">
              候选人姓名 <span className="text-red-400">*</span>
            </label>
            <input
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              required
              className="kit-input mt-1.5"
              placeholder="赵小明"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-300">
              岗位名称 <span className="text-red-400">*</span>
            </label>
            <input
              value={positionTitle}
              onChange={(e) => setPositionTitle(e.target.value)}
              required
              className="kit-input mt-1.5"
              placeholder="高级前端工程师"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-300">候选人简历</label>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            rows={8}
            className="kit-textarea mt-1.5 font-mono"
            placeholder="粘贴简历内容（支持纯文本 / Markdown）"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-300">岗位 JD</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={5}
            className="kit-textarea mt-1.5"
            placeholder="粘贴岗位描述"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-300">分配面试官</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {interviewers.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleInterviewer(m.name)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  selectedInterviewers.includes(m.name)
                    ? "border-white bg-white text-black"
                    : "border-white/20 text-zinc-400 hover:border-white/40 hover:text-white"
                )}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="kit-btn-secondary !py-2 !text-sm"
          >
            取消
          </button>
          <button type="submit" className="kit-btn-primary !py-2 !text-sm">
            创建任务
          </button>
        </div>
      </form>
    </div>
  );
}
