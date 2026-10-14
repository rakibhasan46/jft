import React from 'react';
import { Clock, Flag, AlertTriangle, CheckSquare, Sparkles, Type } from 'lucide-react';
import { SectionId, AppLanguage } from '../types/exam';
import { getSectionMeta } from '../data/sections';
import { getTranslation } from '../data/translations';

interface CBTHeaderProps {
  currentSection: SectionId;
  currentQuestionIndex: number;
  totalQuestions: number;
  timeRemainingSeconds: number;
  mode: 'exam' | 'practice';
  lang: AppLanguage;
  isFlagged: boolean;
  furiganaEnabled: boolean;
  largeFontEnabled: boolean;
  onToggleFlag: () => void;
  onToggleFurigana: () => void;
  onToggleLargeFont: () => void;
  onSubmitExam: () => void;
  onExitSession: () => void;
}

export const CBTHeader: React.FC<CBTHeaderProps> = ({
  currentSection,
  currentQuestionIndex,
  totalQuestions,
  timeRemainingSeconds,
  mode,
  lang,
  isFlagged,
  furiganaEnabled,
  largeFontEnabled,
  onToggleFlag,
  onToggleFurigana,
  onToggleLargeFont,
  onSubmitExam,
  onExitSession,
}) => {
  const meta = getSectionMeta(currentSection);
  const t = getTranslation(lang);

  // Format time MM:SS
  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTimeCritical = mode === 'exam' && timeRemainingSeconds <= 300; // <= 5 min

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-xs">
      {/* Top Banner (Prometric CBT style info bar) */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-wider text-blue-400">JFT-Basic CBT</span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="text-slate-300 font-medium">
            {lang === 'ja'
              ? '国際交流基金 日本語基礎テスト（A2）'
              : 'আন্তর্জাতিক জাপানি ভাষা পরীক্ষা (A2)'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onExitSession}
            className="text-slate-400 hover:text-white transition-colors underline text-[11px]"
          >
            {t.backToHome}
          </button>
        </div>
      </div>

      {/* Main CBT Control Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Section and Question Number */}
        <div className="flex items-center gap-3">
          <div
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs flex items-center gap-1.5"
            style={{ backgroundColor: meta.color }}
          >
            <span>{meta.nameJa}</span>
            <span className="opacity-90 font-normal">
              ({lang === 'ja' ? meta.nameEn : meta.nameBn})
            </span>
          </div>

          <div className="text-sm font-semibold text-gray-700">
            {t.question}{' '}
            <span className="text-blue-600 font-bold text-base">
              {currentQuestionIndex + 1}
            </span>{' '}
            / {totalQuestions}
          </div>
        </div>

        {/* Center: Countdown Timer or Practice Indicator */}
        <div className="flex items-center gap-3">
          {mode === 'exam' ? (
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono text-base font-bold shadow-xs transition-colors ${
                isTimeCritical
                  ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                  : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-rose-600' : 'text-slate-600'}`} />
              <span>{formattedTime}</span>
              {isTimeCritical && (
                <span title="সময় প্রায় শেষ!">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.practiceMode}</span>
            </div>
          )}
        </div>

        {/* Right: Controls & End Exam Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Furigana Toggle */}
          <button
            type="button"
            onClick={onToggleFurigana}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              furiganaEnabled
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-gray-100 border-gray-200 text-gray-500 line-through'
            }`}
            title="ふりがな ON/OFF"
          >
            ふりがな {furiganaEnabled ? t.on : t.off}
          </button>

          {/* Font Size Toggle */}
          <button
            type="button"
            onClick={onToggleLargeFont}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1 ${
              largeFontEnabled
                ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold'
                : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}
            title="文字サイズ変更"
          >
            <Type className="w-3.5 h-3.5" />
            <span>{largeFontEnabled ? t.largeFont : t.normalFont}</span>
          </button>

          {/* Flag for Review */}
          <button
            type="button"
            onClick={onToggleFlag}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              isFlagged
                ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{t.flagForReview}</span>
          </button>

          {/* Submit / Finish Button */}
          <button
            type="button"
            onClick={onSubmitExam}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-xs transition-all"
          >
            <CheckSquare className="w-4 h-4" />
            <span>{t.endExam}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
