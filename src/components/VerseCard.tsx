export default function VerseCard({ verse }: { verse: string }) {
    return (
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-teal-200 max-w-lg">
        <p className="text-xl text-gray-900 font-arabic leading-relaxed text-right">
          {verse}
        </p>
        <p className="text-sm text-gray-500 mt-2 text-right">﴿ القُرآن الكَريم ﴾</p>
      </div>
    );
  }
  