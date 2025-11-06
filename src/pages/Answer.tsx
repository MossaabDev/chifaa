import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: import.meta.env.VITE_AZURE_LLM_ENDPOINT,
  apiKey: import.meta.env.VITE_AZURE_LLM_KEY,
  dangerouslyAllowBrowser: true,
});

interface Verse {
  answer: string;
}

export default function Answer() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state?.prompt) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // --- Fetch AI Reflection ---
        const completion = await client.chat.completions.create({
            model: import.meta.env.VITE_AZURE_LLM_DEPLOYMENT,
            messages: [
              {
                role: "system",
                content:
                  "You are a compassionate Islamic guide who offers emotional and spiritual comfort. Keep your answers short (no more than 50 words). Do not include or quote Qur’an verses — simply provide warm, faith-inspired reflections and gentle advice based on Islamic values.",
    },
              {
                role: "user",
                content: state.prompt,
              },
            ],
          });
          const generatedAnswer =
      completion.choices?.[0]?.message?.content || "No response received.";
        // --- Fetch Qur'an Verses ---
        const verseRes = await fetch(
          "https://mossaabdev-shifaa-api.hf.space/ask/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: state.prompt }),
          }
        );
        const verseData = await verseRes.json();

        setAnswer(generatedAnswer);
        setVerses(verseData.results || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [state, navigate]);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-emerald-50 to-amber-50 flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Top bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-600 to-green-800"></div>

      <div className="relative w-full flex flex-col items-center justify-center text-center 
                      bg-white/30 backdrop-blur-xl border-t border-b border-green-100 py-20 px-8 shadow-xl
                      lg:px-32 xl:px-48 2xl:px-60">
        <h1 className="text-5xl font-bold text-green-900 mb-8 font-serif tracking-wide">
          Reflection
        </h1>

        {loading ? (
          <p className="text-gray-700 text-lg italic">Reflecting deeply...</p>
        ) : (
          <>
            <p className="text-gray-700 mb-10 leading-relaxed text-lg max-w-4xl">
              {answer || "No reflection found."}
            </p>

            <div className="flex flex-col gap-6 w-full max-w-3xl">
              {verses.map((v, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white/60 border border-green-200 text-green-800 shadow-md hover:shadow-lg transition"
                >
                  <p className="font-serif text-lg">{v.answer}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <button
          onClick={() => navigate("/")}
          className="mt-12 bg-gradient-to-r from-green-700 to-emerald-700 text-white py-4 px-8 rounded-2xl 
                     font-semibold hover:from-green-800 hover:to-emerald-800 transition-all duration-300 
                     transform hover:scale-[1.03] active:scale-[0.98] shadow-lg hover:shadow-xl"
        >
          Reflect Again
        </button>
      </div>

      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -right-40 -top-40 w-[32rem] h-[32rem] bg-green-300 rounded-full opacity-10"></div>
        <div className="absolute -left-40 -bottom-40 w-[32rem] h-[32rem] bg-amber-300 rounded-full opacity-10"></div>
      </div>
    </div>
  );
}
