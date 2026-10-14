import React from 'react';
import {
  Play,
  Sparkles,
  BookOpen,
  Clock,
  CheckCircle2,
  Trophy,
  Share2,
  Headphones,
  FileText,
  MessageSquareText,
  AlertCircle,
  HelpCircle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ExamSession, Question, SectionId, AppLanguage } from '../types/exam';
import { SECTIONS, getSectionMeta } from '../data/sections';
import { getTranslation } from '../data/translations';

interface HomeDashboardViewProps {
  questions: Question[];
  activeSession: ExamSession | null;
  lang: AppLanguage;
  onResumeSession: () => void;
  onOpenExamSetup: () => void;
  onStartPractice: (sectionId?: SectionId) => void;
  onOpenKanjiDeck: () => void;
  onOpenQuestionBank: () => void;
  onViewHistory: () => void;
  onOpenGoogleFormsExport: () => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  questions,
  activeSession,
  lang,
  onResumeSession,
  onOpenExamSetup,
  onStartPractice,
  onOpenKanjiDeck,
  onOpenQuestionBank,
  onViewHistory,
  onOpenGoogleFormsExport,
}) => {
  const t = getTranslation(lang);

  // Format remaining time if session active
  let remainingFormatted = '';
  let answeredCount = 0;
  if (activeSession) {
    const mins = Math.floor(activeSession.timeRemainingSeconds / 60);
    const secs = activeSession.timeRemainingSeconds % 60;
    remainingFormatted = `${mins} মিনিট ${secs} সেকেন্ড`;
    answeredCount = Object.keys(activeSession.answers).length;
  }

  const iconMap: Record<string, React.ReactNode> = {
    vocabulary: <BookOpen className="w-5 h-5" />,
    conversation: <MessageSquareText className="w-5 h-5" />,
    listening: <Headphones className="w-5 h-5" />,
    reading: <FileText className="w-5 h-5" />,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Active Session Resume Banner */}
      {activeSession && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {t.activeExamAlert}
              </h3>
              <p className="text-xs text-white/90">
                {t.completedQuestions}: {answeredCount} / {activeSession.questionIds.length}টি প্রশ্ন • {t.timeRemaining}: {remainingFormatted}
              </p>
            </div>
          </div>

          <button
            onClick={onResumeSession}
            className="px-6 py-3 bg-white text-orange-700 hover:bg-orange-50 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all active:scale-95"
          >
            {t.resumeActiveExam}
          </button>
        </div>
      )}

      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>Japan Foundation Test for Basic Japanese (JFT-Basic A2)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            {lang === 'ja' ? (
              <>
                JFT-Basic <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  本格的 CBT 試験シミュレーター
                </span>
              </>
            ) : (
              <>
                ব্যক্তিগত JFT-Basic <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  CBT রিয়েল এক্সাম সিমুলেটর
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 max-w-2xl font-bn">
            প্রকৃত CBT পরীক্ষার নিয়ম অনুযায়ী ৬০ মিনিটের টাইমার, লিসেনিং অডিও প্লেয়ার, ফুড়িগানা সাপোর্ট এবং পরীক্ষা শেষে কাঞ্জি বিশ্লেষণ ও বাংলা ব্যাখ্যাসহ নির্ভুল প্রস্তুতি নিন।
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenExamSetup}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{t.startExam}</span>
            </button>

            <button
              onClick={() => onStartPractice()}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.startPractice}</span>
            </button>

            <button
              onClick={onOpenKanjiDeck}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-amber-600/80 hover:bg-amber-600 text-white font-semibold text-sm backdrop-blur-xs transition-colors border border-amber-500/40"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t.navKanjiDeck}</span>
            </button>

            <button
              onClick={onOpenQuestionBank}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-xs transition-colors border border-white/10"
            >
              <Layers className="w-4 h-4" />
              <span>{t.navQuestionBank} ({questions.length})</span>
            </button>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-10 top-10 text-9xl font-jp font-black text-white/5 select-none pointer-events-none">
          試験
        </div>
      </div>

      {/* Two Modes Explanation (Real Exam Mode vs Practice Mode) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Real Exam Mode Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.realExamMode}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">বাস্তব পরীক্ষার অভিজ্ঞতা</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-bn mb-4">
              নির্দিষ্ট সময় (৬০ মিনিট), CBT প্রশ্ন নেভিগেশন গ্রিড, স্বয়ংক্রিয় সাবমিশন এবং অডিও প্লে সীমা। উত্তরপত্র জমা দেওয়ার আগে কোনো অর্থ বা অনুবাদ দেখানো হবে না।
            </p>
          </div>
          <button
            onClick={onOpenExamSetup}
            className="flex items-center justify-between p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors"
          >
            <span>মক টেস্ট সেটআপ ও শুরু</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Practice Mode Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.practiceMode}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">তাৎক্ষণিক উত্তর ও বাংলা ব্যাখ্যা</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-bn mb-4">
              টাইমার ছাড়া রিল্যাক্সড অনুশীলন। প্রতিটি অপশনে ক্লিক করলেই সাথে সাথে সঠিক উত্তর, কাঞ্জি বিশদ (Onyomi/Kunyomi), অডিও ট্রান্সক্রিপ্ট এবং বাংলা ব্যাখ্যা প্রকাশিত হবে।
            </p>
          </div>
          <button
            onClick={() => onStartPractice()}
            className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs transition-colors"
          >
            <span>অনুশীলন মোড শুরু করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 JFT-Basic Sections Showcase */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">JFT-Basic পরীক্ষার ৪টি মূল বিভাগ</h2>
            <p className="text-xs text-gray-500">প্রতিটি বিভাগে ক্লিক করে আলাদাভাবে অনুশীলন করতে পারেন</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SECTIONS.map((sec) => {
            const count = questions.filter((q) => q.section === sec.id).length;

            return (
              <div
                key={sec.id}
                className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xs"
                    style={{ backgroundColor: sec.color }}
                  >
                    {iconMap[sec.id] || <BookOpen className="w-5 h-5" />}
                  </div>

                  <h3 className="font-bold text-base text-gray-900 font-jp mb-1">
                    {sec.nameJa}
                  </h3>
                  <span className="text-xs font-semibold text-gray-600 block mb-2 font-bn">
                    {lang === 'ja' ? sec.nameEn : sec.nameBn}
                  </span>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4 font-bn">
                    {lang === 'ja' ? sec.descriptionJa : sec.descriptionBn}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">
                    প্রশ্ন: <strong>{count}টি</strong>
                  </span>

                  <button
                    onClick={() => onStartPractice(sec.id)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>অনুশীলন</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kanji Learning System Highlights Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl border border-amber-200 p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>কাঞ্জি লার্নিং ফিচার</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            কাঞ্জি উচ্চারণ, ওন-ইয়োমি ও যৌগিক শব্দ বিশ্লেষণ
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-bn">
            শব্দের ভেতর কাঞ্জির সঠিক ব্যবহার, হিরাগানা রিডিং, ওন-ইয়োমি (音読み) ও কুন-ইয়োমি (訓読み), বাংলা অর্থ এবং অন্যান্য উদাহরণ শব্দ কার্ডের মাধ্যমে শেখার ডেডিকেটেড ডেক।
          </p>
        </div>

        <button
          onClick={onOpenKanjiDeck}
          className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
        >
          কাঞ্জি ডেক খুলুন
        </button>
      </div>
    </div>
  );
};
