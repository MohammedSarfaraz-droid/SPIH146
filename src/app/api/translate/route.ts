import { NextResponse } from "next/server";

function decodeHtmlEntities(str: string): string {
  if (!str) return str;
  return str
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

/**
 * Primary engine: Google Chrome Translation API (Fast, High Quality, Free)
 */
async function translateWithGoogle(
  text: string,
  from: string,
  to: string
): Promise<string | null> {
  try {
    const url =
      `https://clients5.google.com/translate_a/t?client=dict-chrome-ex` +
      `&sl=${encodeURIComponent(from)}` +
      `&tl=${encodeURIComponent(to)}` +
      `&q=${encodeURIComponent(text)}`;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(3000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) return null;

    const data = await response.json();

    if (Array.isArray(data)) {
      if (typeof data[0] === "string") {
        return decodeHtmlEntities(data[0].trim());
      }
      if (Array.isArray(data[0]) && typeof data[0][0] === "string") {
        return decodeHtmlEntities(data[0][0].trim());
      }
    }
  } catch (err) {
    console.warn("Google translate tier failed:", err);
  }
  return null;
}

/**
 * Fallback engine: MyMemory Machine Translation
 */
async function translateWithMyMemory(
  text: string,
  from: string,
  to: string
): Promise<string | null> {
  try {
    const url =
      `https://api.mymemory.translated.net/get` +
      `?q=${encodeURIComponent(text)}` +
      `&langpair=${encodeURIComponent(from)}|${encodeURIComponent(to)}` +
      `&de=safespeak_hackathon_app@gmail.com`;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) return null;

    const data = await response.json();

    if (data.responseStatus !== 200 && data.responseStatus !== "200") {
      return null;
    }

    // Look for neural machine translation in matches first
    if (Array.isArray(data.matches)) {
      const mtMatch = data.matches.find(
        (m: any) =>
          m.id === 0 ||
          m["created-by"] === "MT!" ||
          m.model === "neural" ||
          (m.segment && m.segment.toLowerCase().trim() === text.toLowerCase().trim())
      );

      if (mtMatch && mtMatch.translation) {
        const trans = mtMatch.translation.trim();
        if (!trans.toUpperCase().startsWith("MYMEMORY WARNING")) {
          return decodeHtmlEntities(trans);
        }
      }
    }

    // Fallback to responseData.translatedText if not a warning
    const raw = data.responseData?.translatedText;
    if (raw && typeof raw === "string" && !raw.toUpperCase().startsWith("MYMEMORY WARNING")) {
      return decodeHtmlEntities(raw.trim());
    }
  } catch (err) {
    console.warn("MyMemory translate tier failed:", err);
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const { text, from, to } = await request.json();

    if (!text || typeof text !== "string" || !from || !to) {
      return NextResponse.json(
        { error: "Missing text, from, or to fields" },
        { status: 400 }
      );
    }

    const trimmed = text.trim();

    // If same language or empty, no translation needed
    if (from === to || !trimmed) {
      return NextResponse.json({
        translation: trimmed,
      });
    }

    // 1. Try Primary Google Translation
    const googleResult = await translateWithGoogle(trimmed, from, to);
    if (googleResult) {
      return NextResponse.json({
        translation: googleResult,
      });
    }

    // 2. Try Secondary MyMemory Machine Translation
    const myMemoryResult = await translateWithMyMemory(trimmed, from, to);
    if (myMemoryResult) {
      return NextResponse.json({
        translation: myMemoryResult,
      });
    }

    // 3. Graceful fallback: return original text
    return NextResponse.json({
      translation: trimmed,
    });
  } catch (error) {
    console.error("Translation route error:", error);

    return NextResponse.json({
      translation: "",
    });
  }
}