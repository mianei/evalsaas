import type { Metadata } from "next";
import { AppProvider } from "@/lib/store";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "InterviewEval - AI 面试评估 SaaS",
  description: "面向中小企业招聘场景的 AI 候选人评估工具",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-black text-white antialiased">
        <AppProvider>
          <Header />
          <main>{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
