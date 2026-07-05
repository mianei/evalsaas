import { NextRequest, NextResponse } from "next/server";
import {
  buildEvaluationSystemPrompt,
  buildEvaluationUserMessage,
} from "@/lib/prompts";
import { generateMockEvaluation } from "@/lib/mock-evaluator";
import { normalizeReport, validateEvaluationReport } from "@/lib/schema";

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const codeBlock = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = codeBlock ? codeBlock[1].trim() : trimmed;
  try {
    return JSON.parse(jsonStr);
  } catch {
    const start = jsonStr.indexOf("{");
    const end = jsonStr.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(jsonStr.slice(start, end + 1));
    }
    throw new Error("无法解析 AI 返回的 JSON");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { candidateName, positionTitle, resume, jobDescription, interviewNotes } =
      body as {
        candidateName: string;
        positionTitle: string;
        resume: string;
        jobDescription: string;
        interviewNotes: string;
      };

    if (!interviewNotes?.trim() && !resume?.trim()) {
      return NextResponse.json(
        { error: "请至少提供简历或面试记录" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL || "https://api.deepseek.com/v1";
    const model = process.env.OPENAI_MODEL || "deepseek-chat";

    if (!apiKey) {
      const mockReport = generateMockEvaluation({
        candidateName: candidateName || "候选人",
        positionTitle: positionTitle || "未知岗位",
        resume: resume || "",
        jobDescription: jobDescription || "",
        interviewNotes: interviewNotes || "",
      });
      return NextResponse.json({
        report: mockReport,
        mode: "mock",
        message: "未配置 API Key，使用模拟评估。请在 .env.local 中配置 OPENAI_API_KEY。",
      });
    }

    const systemPrompt = buildEvaluationSystemPrompt();
    const userMessage = buildEvaluationUserMessage({
      candidateName: candidateName || "候选人",
      positionTitle: positionTitle || "未知岗位",
      resume: resume || "",
      jobDescription: jobDescription || "",
      interviewNotes: interviewNotes || "",
    });

    let lastError = "";
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content:
                attempt > 0
                  ? userMessage +
                    "\n\n上次输出格式有误，请严格只输出 JSON，不要任何其他文字。"
                  : userMessage,
            },
          ],
          temperature: 0.3,
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return NextResponse.json(
          { error: `模型 API 错误: ${response.status} ${errText.slice(0, 200)}` },
          { status: 502 }
        );
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        lastError = "模型未返回内容";
        continue;
      }

      try {
        const parsed = extractJson(content);
        if (validateEvaluationReport(parsed)) {
          return NextResponse.json({
            report: normalizeReport(parsed),
            mode: "ai",
          });
        }
        lastError = "输出不符合 Schema";
      } catch (e) {
        lastError = e instanceof Error ? e.message : "JSON 解析失败";
      }
    }

    const fallback = generateMockEvaluation({
      candidateName: candidateName || "候选人",
      positionTitle: positionTitle || "未知岗位",
      resume: resume || "",
      jobDescription: jobDescription || "",
      interviewNotes: interviewNotes || "",
    });
    return NextResponse.json({
      report: fallback,
      mode: "fallback",
      message: `AI 输出校验失败（${lastError}），已使用兜底评估`,
    });
  } catch (e) {
    console.error("Evaluate API error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "服务器错误" },
      { status: 500 }
    );
  }
}
