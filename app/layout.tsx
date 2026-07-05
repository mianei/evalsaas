import type { Metadata } from "next";
import { AppProvider } from "@/lib/store";
import { ThemeProvider } from "@/lib/theme";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "InterviewEval - AI 面试评估 SaaS",
  description: "面向中小企业招聘场景的 AI 候选人评估工具",
};

const themeScript = `(function(){try{var t=localStorage.getItem("interview-eval-theme");var theme=t==="light"?"light":"dark";document.documentElement.setAttribute("data-theme",theme);document.documentElement.style.colorScheme=theme}catch(e){document.documentElement.setAttribute("data-theme","dark");document.documentElement.style.colorScheme="dark"}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-theme text-theme antialiased">
        <ThemeProvider>
          <AppProvider>
            <Header />
            <main>{children}</main>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
