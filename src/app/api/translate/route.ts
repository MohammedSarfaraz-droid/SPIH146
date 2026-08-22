import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text, from, to } = await request.json();

    if (!text || !from || !to) {
      return NextResponse.json(
        { error: "Missing translation data" },
        { status: 400 }
      );
    }

    if (from === to) {
      return NextResponse.json({
        translation: text,
      });
    }

    const url =
      `https://api.mymemory.translated.net/get` +
      `?q=${encodeURIComponent(text)}` +
      `&langpair=${from}|${to}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Translation API failed");
    }

    const data = await response.json();

    return NextResponse.json({
      translation:
        data.responseData?.translatedText || text,
    });
  } catch (error) {
    console.error("Translation error:", error);

    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}