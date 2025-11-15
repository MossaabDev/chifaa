import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCopy, FaExternalLinkAlt, FaPlay, FaStop } from "react-icons/fa";

interface Verse {
  question: string;
  answer: string;
  arabic: string;
  link?: string;
}

interface Reflection {
  reflection: string;
}

interface ApiResponse {
  reflection: Reflection;
  ayahs: Verse[];
}

export default function Answer() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [reflection, setReflection] = useState("");
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!state?.prompt) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://mossaabdev-shifaa-api.hf.space/ask/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: state.prompt }),
          }
        );

        if (!response.ok) throw new Error("Failed to fetch reflection");
        const data: ApiResponse = await response.json();
        setReflection(data.reflection.reflection);
        setVerses(data.ayahs || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [state, navigate]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  // Extract chapter:verse from link
  const getChapterVerse = (link?: string) => {
    if (!link) return "";
    const match = link.match(/quran\.com\/(\d+)\/(\d+)/);
    if (!match) return "";
    return `${match[1]}:${match[2]}`;
  };

  const toggleAudio = async (link?: string) => {
    if (!link) return;
  
    // If already playing → STOP
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }
  
    // Otherwise → PLAY normally
    const match = link.match(/quran\.com\/(\d+)\/(\d+)/);
    if (!match) return;
  
    const chapter = Number(match[1]);
    const verse = Number(match[2]);
  
    const res = await fetch(
      `http://api.alquran.cloud/v1/surah/${chapter}/ar.alafasy`
    );
  
    const data = await res.json();
    const ayah = data.data.ayahs.find((a: any) => a.numberInSurah === verse);
  
    if (!ayah) return;
  
    const audioUrl = ayah.audio;
  
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
  
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log("Audio error:", e));
  
      // when audio ends → reset
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };
  

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-emerald-50 to-amber-50 flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-600 to-green-800"></div>

      <div
        className="relative w-full flex flex-col items-center justify-center text-center 
                      bg-white/30 backdrop-blur-xl border-t border-b border-green-100 py-20 px-8 shadow-xl
                      lg:px-32 xl:px-48 2xl:px-60"
      >
        <h1 className="text-5xl font-bold text-green-900 mb-8 font-serif tracking-wide">
          Reflection
        </h1>

        {loading ? (
          <p className="text-gray-700 text-lg italic">Reflecting deeply...</p>
        ) : (
          <>
            <p className="text-gray-700 mb-10 leading-relaxed text-lg max-w-4xl">
              {reflection || "No reflection found."}
            </p>

            <div className="flex flex-col gap-6 w-full max-w-3xl">
              {verses.slice(0, 1).map((v, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white/70 border border-green-200 text-center 
                             text-green-900 shadow-md hover:shadow-lg transition-all duration-300 relative"
                >
                  {/* Chapter:Verse */}
                  <div className="absolute top-3 right-3 text-green-800 font-semibold">
                    [{getChapterVerse(v.link)}]
                  </div>

                  {/* Arabic verse */}
                  <p className="font-[Amiri] text-2xl md:text-3xl leading-relaxed mb-3 text-green-950">
                    {v.arabic}
                  </p>

                  {/* English translation */}
                  <p className="font-serif text-base md:text-lg text-green-700/80 italic mb-3">
                    {v.answer}
                  </p>

                  {/* Icon controls */}
                  <div className="flex justify-center gap-4 mt-2">
                    {/* Copy */}
                    <button
                      onClick={() => copyToClipboard(`${v.arabic}\n${v.answer}`)}
                      className="p-2 rounded-full hover:bg-green-100 transition-all"
                      title="Copy verse"
                    >
                      <FaCopy className="text-green-800" />
                    </button>

                    {/* Go to Ayah */}
                    {v.link && (
                      <button
                        onClick={() => window.open(v.link, "_blank")}
                        className="p-2 rounded-full hover:bg-green-100 transition-all"
                        title="Go to Ayah"
                      >
                        <FaExternalLinkAlt className="text-green-800" />
                      </button>
                    )}

                    {/* Play */}
                    <button
                      onClick={() => toggleAudio(v.link)}
                      className="p-2 rounded-full hover:bg-green-100 transition-all"
                      title={isPlaying ? "Stop" : "Play"}
                    >
                      {isPlaying ? (
                        <FaStop className="text-green-800" />  // looks like a stop/pause
                      ) : (
                        <FaPlay className="text-green-800" />
                      )}
                    </button>
                  </div>
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

      {/* Hidden audio element */}
      <audio ref={audioRef} hidden />

      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -right-40 -top-40 w-[32rem] h-[32rem] bg-green-300 rounded-full opacity-10"></div>
        <div className="absolute -left-40 -bottom-40 w-[32rem] h-[32rem] bg-amber-300 rounded-full opacity-10"></div>
      </div>
    </div>
  );
}
