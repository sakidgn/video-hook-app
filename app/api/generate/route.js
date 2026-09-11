
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, platform } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API anahtarı bulunamadı (.env.local kontrol edin)." },
        { status: 500 }
      );
    }

    const prompt = `
Sen viral bir video kurgucususun. Platform: ${platform}, Konu: "${topic}".
İzleyiciyi ilk 3 saniyede tutacak bir kurgu hazırla. 
MUTLAKA sadece aşağıdaki JSON şablonuna birebir uyarak yanıt ver, JSON dışında hiçbir şey yazma:

{
  "hook": "Buraya çarpıcı ilk 3 saniye kancası",
  "cue": "Buraya kamera hareketi ve ses efekti önerisi",
  "body": "Buraya videonun 15-20 saniyelik ana gövde özeti",
  "cta": "Buraya yorum yaptıracak kapanış sorusu"
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Hatası:", data);
      return NextResponse.json(
        { error: data.error?.message || "Gemini isteği reddetti." },
        { status: 500 }
      );
    }

    const rawText = data.candidates[0].content.parts[0].text;
    const parsedData = JSON.parse(rawText);

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("İşlem hatası:", error);
    return NextResponse.json(
      { error: "Sunucu tarafında bir hata oluştu." },
      { status: 500 }
    );
  }
}
