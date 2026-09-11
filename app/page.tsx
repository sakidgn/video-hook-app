"use client";
import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("TikTok / Reels");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform }),
      });

      const data = await response.json();

      if (data.error) {
        alert("Hata: " + data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      alert("Sunucuya bağlanırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center p-6 md:p-12">
      <div className="max-w-xl w-full space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">
            Viral Hook Motoru ⚡
          </h1>
          <p className="text-neutral-400 text-sm">
            Kısa videonun ilk 3 saniyesini kurtar, kaydırmayı durdur.
          </p>
        </header>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">
              VİDEO KONUSU / NİŞ
            </label>
            <input
              type="text"
              placeholder="Örn: Telefon kamerası kıyaslama, Shitpost kurgusu..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">
              PLATFORM
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
            >
              <option>TikTok / Reels</option>
              <option>YouTube Shorts</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:opacity-90 font-bold py-3 rounded-lg text-sm transition disabled:opacity-50"
          >
            {loading ? "Kanca Hazırlanıyor..." : "Viral Kanca Üret 🚀"}
          </button>
        </div>

        {result && (
          <div className="bg-neutral-900 border border-amber-500/30 rounded-xl p-5 space-y-3">
            <div>
              <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                0-3 SN KANCA (HOOK)
              </span>
              <p className="text-lg font-bold mt-1 text-neutral-100">
                {result.hook}
              </p>
            </div>

            <div className="text-sm bg-neutral-950/60 p-3 rounded border border-neutral-800 space-y-1">
              <span className="text-xs font-semibold text-neutral-400 block">
                🎬 Görsel & Ses İpucu:
              </span>
              <p className="text-neutral-300">{result.cue}</p>
            </div>

            <div className="text-sm bg-neutral-950/60 p-3 rounded border border-neutral-800 space-y-1">
              <span className="text-xs font-semibold text-neutral-400 block">
                📝 Video İskeleti:
              </span>
              <p className="text-neutral-300">{result.body}</p>
            </div>

            <div className="text-sm bg-neutral-950/60 p-3 rounded border border-neutral-800 space-y-1">
              <span className="text-xs font-semibold text-neutral-400 block">
                💬 Yorum Tetikleyici (CTA):
              </span>
              <p className="text-neutral-300">{result.cta}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
