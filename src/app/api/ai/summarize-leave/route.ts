import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { remarks } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Summarize this employee leave request remark into a 1-sentence bullet point for HR managers: "${remarks}"`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        if (text) {
          return NextResponse.json({ summary: text.trim(), source: 'gemini' });
        }
      } catch (err) {
        console.warn("Gemini API call failed, falling back:", err);
      }
    }

    // Fallback summary
    const fallbackSummary = `Summary: Employee requested leave for "${remarks?.slice(0, 40) || 'personal reasons'}..."`;
    return NextResponse.json({ summary: fallbackSummary, source: 'fallback' });
  } catch (error) {
    return NextResponse.json({ summary: "Summary: Standard leave request", source: 'fallback' });
  }
}
