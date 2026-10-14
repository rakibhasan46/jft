import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  Volume2,
  RotateCw,
  Layers,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Question, KanjiDetail, AppLanguage } from '../types/exam';
import { getTranslation } from '../data/translations';
import { audioPlayer } from '../services/audioPlayer';

interface KanjiLearningDeckProps {
  questions: Question[];
  lang: AppLanguage;
  onExit: () => void;
  onOpenInspector: (detail: KanjiDetail) => void;
}

export const KanjiLearningDeck: React.FC<KanjiLearningDeckProps> = ({
  questions,
  lang,
  onExit,
  onOpenInspector,
}) => {
  const t = getTranslation(lang);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'flashcard'>('grid');
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Extract all unique kanji from questions
  const allKanjiMap = new Map<string, KanjiDetail>();
  questions.forEach((q) => {
    q.kanjiDetails?.forEach((kd) => {
      if (!allKanjiMap.has(kd.kanji)) {
        allKanjiMap.set(kd.kanji, kd);
      }
    });
  });

  const allKanji = Array.from(allKanjiMap.values());

  const filteredKanji = allKanji.filter((k) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      k.kanji.includes(q) ||
      k.readingHiragana.includes(q) ||
      k.meaningBn.toLowerCase().includes(q) ||
      (k.onyomi && k.onyomi.includes(q)) ||
      (k.kunyomi && k.kunyomi.includes(q))
    );
  });

  const currentFlashcard = filteredKanji[flashcardIndex] || filteredKanji[0];

  const handleSpeak = (text: string) => {
    audioPlayer.play(text, { rate: 0.9 });
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    if (flashcardIndex < filteredKanji.length - 1) {
      setFlashcardIndex((prev) => prev + 1);
    } else {
      setFlashcardIndex(0);
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    if (flashcardIndex > 0) {
      setFlashcardIndex((prev) => prev - 1);
    } else {
      setFlashcardIndex(filteredKanji.length - 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>JFT-Basic A2 Kanji Master</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            কাঞ্জি লার্নিং ডেক (Kanji Learning System)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            কাঞ্জির সঠিক উচ্চারণ, ওন-ইয়োমি, কুন-ইয়োমি, বাংলা অর্থ ও যৌগিক শব্দের ব্যবহার শিখুন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-gray-900 font-bold' : 'text-gray-600'
              }`}
            >
              গ্রিড তালিকা
            </button>
            <button
              onClick={() => {
                setViewMode('flashcard');
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'flashcard' ? 'bg-white shadow-xs text-gray-900 font-bold' : 'text-gray-600'
              }`}
            >
              ফ্ল্যাশকার্ড মোড
            </button>
          </div>

          <button
            onClick={onExit}
            className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            {t.backToHome}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-xs flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400 ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setFlashcardIndex(0);
          }}
          placeholder="কাঞ্জি, হিরাগানা রিডিং বা বাংলা অর্থ দিয়ে খুঁজুন (যেমন: 新, あたら, নতুন)..."
          className="flex-1 text-xs sm:text-sm focus:outline-hidden"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-gray-400 hover:text-gray-600 px-2"
          >
            ক্লিয়ার
          </button>
        )}
      </div>

      {/* View: Flashcard Mode */}
      {viewMode === 'flashcard' && currentFlashcard && (
        <div className="max-w-md mx-auto text-center space-y-4">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="bg-white rounded-3xl border-2 border-gray-200 p-8 shadow-md hover:shadow-lg transition-all cursor-pointer min-h-[320px] flex flex-col justify-center items-center relative select-none"
          >
            <span className="absolute top-4 right-4 text-[11px] font-bold text-gray-400">
              {flashcardIndex + 1} / {filteredKanji.length}
            </span>

            {!isFlipped ? (
              /* Front of Flashcard */
              <div className="space-y-4">
                <div className="text-8xl font-jp font-black text-slate-900 animate-in zoom-in-95">
                  {currentFlashcard.kanji}
                </div>
                <p className="text-xs text-gray-400 font-medium">
                  কার্ডে ক্লিক করে অর্থ ও ব্যাখ্যা দেখুন (Click to Flip)
                </p>
              </div>
            ) : (
              /* Back of Flashcard */
              <div className="space-y-3 w-full text-left animate-in fade-in">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="text-4xl font-jp font-black text-blue-600">
                    {currentFlashcard.kanji}
                  </div>
                  <span className="text-base font-bold text-emerald-700 font-bn">
                    {currentFlashcard.meaningBn}
                  </span>
                </div>

                <div className="text-xs space-y-1 font-jp">
                  <div><strong>রিডিং:</strong> {currentFlashcard.readingHiragana}</div>
                  <div><strong>音 (Onyomi):</strong> {currentFlashcard.onyomi || '—'}</div>
                  <div><strong>訓 (Kunyomi):</strong> {currentFlashcard.kunyomi || '—'}</div>
                </div>

                {currentFlashcard.compounds && (
                  <div className="pt-2 border-t text-xs">
                    <strong className="text-gray-500 block mb-1">শব্দ ব্যবহার:</strong>
                    <div className="flex flex-wrap gap-1.5">
                      {currentFlashcard.compounds.map((c, i) => (
                        <span key={i} className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {c.word} ({c.reading}) - {c.meaningBn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Flashcard Navigation */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handlePrevCard}
              className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold hover:bg-gray-50"
            >
              পূর্ববর্তী
            </button>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>উল্টান (Flip)</span>
            </button>
            <button
              onClick={handleNextCard}
              className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold hover:bg-gray-50"
            >
              পরবর্তী
            </button>
          </div>
        </div>
      )}

      {/* View: Grid List Mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredKanji.map((kd) => (
            <div
              key={kd.kanji}
              className="bg-white rounded-2xl border border-gray-200 hover:border-blue-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-4xl font-black font-jp text-slate-900 group-hover:text-blue-600 transition-colors">
                    {kd.kanji}
                  </span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700 font-bn block">
                      {kd.meaningBn}
                    </span>
                    <span className="text-[11px] text-gray-500 font-jp">
                      {kd.readingHiragana}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-2.5 text-[11px] space-y-1 mb-3">
                  <div className="text-gray-600">
                    <strong className="text-gray-800">音:</strong> {kd.onyomi || '—'}
                  </div>
                  <div className="text-gray-600">
                    <strong className="text-gray-800">訓:</strong> {kd.kunyomi || '—'}
                  </div>
                </div>

                {kd.compounds && kd.compounds.length > 0 && (
                  <div className="text-[11px] text-gray-600 line-clamp-2 mb-2 font-bn">
                    উদাহরণ: <strong>{kd.compounds[0].word}</strong> ({kd.compounds[0].meaningBn})
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleSpeak(kd.readingHiragana)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  title="উচ্চারণ শুনুন"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenInspector(kd)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>বিস্তারিত</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
