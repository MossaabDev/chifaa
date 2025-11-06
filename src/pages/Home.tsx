import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/answer", { state: { prompt } });
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-emerald-50 to-amber-50 flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Top geometric bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-600 to-green-800">
        <div className="absolute inset-0 bg-repeat-x bg-[length:40px_20px] bg-[linear-gradient(45deg,transparent_0%,transparent_25%,#fef3c7_25%,#fef3c7_50%,transparent_50%,transparent_75%,#fef3c7_75%)] opacity-20"></div>
      </div>

    {/* Main content container */}
    <div className="relative w-full flex flex-col items-center justify-center text-center 
                    bg-white/30 backdrop-blur-xl border-t border-b border-green-100 py-20 px-8 shadow-xl
                    lg:px-32 xl:px-48 2xl:px-60">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative w-24 h-24 mb-4">
            <div className="absolute inset-0 bg-green-700 rounded-full opacity-20"></div>
            <div className="absolute inset-3 border-2 border-green-800 rounded-full border-dashed animate-spin-slow"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl text-green-800 font-serif">﷽</span>
            </div>
          </div>
        </div>

        {/* Headings */}
        <h1 className="text-5xl font-bold text-green-900 mb-4 font-serif tracking-wide">
          Shifaa
        </h1>
        <p className="text-gray-700 mb-10 leading-relaxed text-lg w-full">

        Open your heart, find a verse, a prayer, and guidance for your spiritual journey.
        </p>

        {/* Input Form */}
        <form
  onSubmit={handleSubmit}
  className="w-full flex flex-col sm:flex-row items-center gap-4"
>

          <div className="relative flex-1">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask your question with sincerity..."
              className="w-full p-5 pr-12 rounded-2xl border-2 border-green-200 bg-white/70 backdrop-blur-sm 
                         focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 
                         transition-all duration-300 text-gray-800 placeholder-green-600/60 text-lg"
              required
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-green-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-green-700 to-emerald-700 text-white py-5 px-8 rounded-2xl 
                       font-semibold hover:from-green-800 hover:to-emerald-800 transition-all duration-300 
                       transform hover:scale-[1.03] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center gap-3 group"
          >
            <span>Seek Wisdom</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </form>

        {/* Decorative basmala */}
        <div className="mt-16 opacity-70">
          <div className="text-green-800 text-lg font-serif tracking-widest">
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>
        </div>
      </div>

      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -right-40 -top-40 w-[32rem] h-[32rem] bg-green-300 rounded-full opacity-10"></div>
        <div className="absolute -left-40 -bottom-40 w-[32rem] h-[32rem] bg-amber-300 rounded-full opacity-10"></div>
      </div>
    </div>
  );
}
