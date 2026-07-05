"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">创建评估任务</h1>
      <p className="mt-1 text-sm text-slate-500">
        上传候选人简历、粘贴 JD，分配给面试官
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">
              候选人姓名 <span className="text-red-500">*</span>
            </label>
            <input
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              required
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              placeholder="赵小明"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">
              岗位名称 <span className="text-red-500">*</span>
            </label>
            <input
              value={positionTitle}
              onChange={(e) => setPositionTitle(e.target.value)}
              required
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              placeholder="高级前端工程师"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            候选人简历
          </label>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            rows={8}
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="粘贴简历内容（支持纯文本 / Markdown）"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">岗位 JD</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={5}
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="粘贴岗位描述"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            分配面试官
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {interviewers.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleInterviewer(m.name)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  selectedInterviewers.includes(m.name)
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
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
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            取消
          </button>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            创建任务
          </button>
        </div>
      </form>
    </div>
  );
}
