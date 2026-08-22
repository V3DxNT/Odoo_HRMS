import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const fallbackResponses: Record<string, string> = {
  default: "I'm your Dayflow AI Assistant. You currently have 12 days of Vacation Leave remaining. Your next payroll disbursement is scheduled for August 30th.",
  leave: "According to Dayflow company policy, vacation leave requests must be submitted at least 48 hours in advance. Sick leaves can be logged retroactively with a doctor's note.",
  payroll: "Your current base salary is configured at $85,000/year. Direct deposit is active for Chase Bank (ending in ****4892).",
  attendance: "Your average check-in time this month is 8:58 AM. You have logged 162 total working hours in August with 100% compliance."
};

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are Dayflow AI, an intelligent HR assistant embedded in an HRMS system. Answer the following employee query professionally and concisely (max 3 sentences): "${message}"`;
        
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        if (responseText) {
          return NextResponse.json({ reply: responseText, source: 'gemini' });
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, using intelligent fallback response:", geminiError);
      }
    }

    // Dynamic Fallback Logic if API Key is missing or call fails
    const lower = (message || "").toLowerCase();
    let reply = fallbackResponses.default;
    if (lower.includes("leave") || fontCheck(lower, ["vacation", "pto", "sick", "off"])) {
      reply = fallbackResponses.leave;
    } else if (fontCheck(lower, ["pay", "salary", "paycheck", "slip", "money"])) {
      reply = fallbackResponses.payroll;
    } else if (fontCheck(lower, ["attendance", "time", "clock", "hours", "check"])) {
      reply = fallbackResponses.attendance;
    }

    return NextResponse.json({ reply, source: 'fallback' });
  } catch (error) {
    return NextResponse.json({ reply: fallbackResponses.default, source: 'fallback' });
  }
}

function fontCheck(text: string, keywords: string[]) {
  return keywords.some(k => text.includes(k));
}
