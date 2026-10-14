import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle,
  FileText,
  Volume2,
} from 'lucide-react';
import { Question, SectionId, AppLanguage, KanjiDetail } from '../types/exam';
import { SECTIONS, getSectionMeta } from '../data/sections';
import { AudioPlayerControl } from './AudioPlayerControl';
import { KanjiInspectorModal } from './KanjiInspectorModal';
import { getTranslation } from '../data/translations';
import { translateInstruction } from '../data/instructionTranslations';

interface PracticeModeViewProps {
  questions: Question[];
  lang: AppLanguage;
  bookmarkedIds: string[];
  onToggleBookmark: (questionId: string) => void;
  onExit: () => void;
}

export const PracticeModeView: React.FC<PracticeModeViewProps> = ({
  questions,
  lang,
  bookmarkedIds,
  onToggleBookmark,
  onExit,
}) => {
  const t = getTranslation(lang);
  const [selectedSection, setSelectedSection] = useState<SectionId | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showAudioScript, setShowAudioScript] = useState<boolean>(false);
  const [furiganaEnabled, setFuriganaEnabled] = useState<boolean>(true);
  const [inspectingKanji, setInspectingKanji] = useState<KanjiDetail | null>(null);

  // Filter questions by section
  const filteredQuestions = selectedSection === 'all'
    ? questions
    : questions.filter((q) => q.section === selectedSection);

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];
  const total = filteredQuestions.length;

  if (!currentQ) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border max-w-lg mx-auto mt-12">
        <p className="text-gray-600 mb-4">এই বিভাগে কোনো প্রশ্ন পাওয়া যায়নি।</p>
        <button
          onClick={() => setSelectedSection('all')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
        >
          সব প্রশ্ন দেখুন
        </button>
      </div>
    );
  }

  const userAnswer = selectedAnswers[currentQ.id];
  const isAnswered = userAnswer !== undefined;
  const isCorrect = isAnswered && userAnswer === currentQ.correctAnswer;
  const isBookmarked = bookmarkedIds.includes(currentQ.id);

  const handleSelectOption = (idx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: idx }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAudioScript(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowAudioScript(false);
    }
  };

  const currentMeta = getSectionMeta(currentQ.section);

  return (
    <div className={`max-w-4xl mx-auto px-4 py-6 ${!furiganaEnabled ? 'no-furigana' : ''}`}>
      {/* Top Navigation & Section Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>{t.practiceMode}</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              উত্তর দেওয়ার সাথে সাথেই সঠিক উত্তর, কাঞ্জি বিশ্লেষণ, শব্দের অর্থ ও বাংলা ব্যাখ্যা দেখুন।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFuriganaEnabled(!furiganaEnabled)}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100"
            >
              ふりがな: {furiganaEnabled ? t.on : t.off}
            </button>
            <button
              onClick={onExit}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              {t.backToHome}
            </button>
          </div>
        </div>

        {/* Section Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={() => {
              setSelectedSection('all');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedSection === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            সব বিভাগ ({questions.length})
          </button>
          {SECTIONS.map((sec) => {
            const count = questions.filter((q) => q.section === sec.id).length;
            const isSelected = selectedSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  setSelectedSection(sec.id);
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                style={isSelected ? { backgroundColor: sec.color } : {}}
              >
                {sec.nameJa} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Practice Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs mb-6">
        {/* Question Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-1 text-xs font-bold text-white rounded-md"
              style={{ backgroundColor: currentMeta.color }}
            >
              {currentMeta.nameJa}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {currentQ.subCategory || 'নমুনা প্রশ্ন'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600 font-medium font-mono">
              {currentIndex + 1} / {total}
            </span>
            <button
              onClick={() => onToggleBookmark(currentQ.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isBookmarked
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600'
              }`}
              title={isBookmarked ? 'বুকমার্ক থেকে সরান' : 'পরে অনুশীলনের জন্য সেভ করুন'}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Prompt */}
        <div className="mb-4 bg-blue-50/70 p-3.5 rounded-xl border border-blue-100">
          <p className="text-sm sm:text-base font-bold text-blue-950 font-bn leading-relaxed mb-1">
            📌 নির্দেশনা: {lang === 'bn' ? translateInstruction(currentQ.title, 'bn') : currentQ.title}
          </p>
          {lang === 'bn' && (
            <p className="text-xs text-gray-500 font-jp italic">
              原文: {currentQ.title}
            </p>
          )}
        </div>

        {/* Passage if present */}
        {currentQ.passage && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-jp text-sm sm:text-base leading-relaxed whitespace-pre-line mb-6">
            {currentQ.passage}
          </div>
        )}

        {/* Audio Player for Listening */}
        {currentQ.section === 'listening' && (
          <div className="mb-6">
            <AudioPlayerControl
              audioText={currentQ.audioText}
              audioUrl={currentQ.audioUrl}
              questionId={currentQ.id}
              isPracticeMode={true}
            />

            {/* Toggle Audio Script in Practice Mode */}
            {(currentQ.audioTranscriptJa || currentQ.audioText) && (
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={() => setShowAudioScript(!showAudioScript)}
                  className="text-xs text-purple-700 hover:text-purple-900 font-medium underline inline-flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>
                    {showAudioScript ? t.hideTranscript : t.showTranscript}
                  </span>
                </button>

                {showAudioScript && (
                  <div className="mt-2 text-left p-3.5 bg-purple-50 rounded-xl border border-purple-200 text-xs sm:text-sm text-purple-950 font-jp whitespace-pre-line leading-relaxed shadow-xs">
                    <span className="font-bold block text-purple-900 mb-1">【会話スクリプト / ট্রান্সক্রিপ্ট】</span>
                    {currentQ.audioTranscriptJa || currentQ.audioText}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Target Sentence with Underline */}
        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 mb-4">
          <div className="text-lg sm:text-xl font-jp text-gray-900 leading-loose">
            {currentQ.rubyText ? (
              <span dangerouslySetInnerHTML={{ __html: currentQ.rubyText }} />
            ) : (
              <span dangerouslySetInnerHTML={{ __html: currentQ.question }} />
            )}
          </div>
        </div>

        {/* Interactive Kanji Inspector Buttons (Practice Mode only) */}
        {currentQ.kanjiDetails && currentQ.kanjiDetails.length > 0 && (
          <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-600 flex items-center gap-1 mr-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>{t.kanjiInspector}:</span>
            </span>
            {currentQ.kanjiDetails.map((kd) => (
              <button
                key={kd.kanji}
                type="button"
                onClick={() => setInspectingKanji(kd)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg text-xs font-jp font-semibold text-blue-900 shadow-2xs hover:border-blue-400 transition-all"
                title={`${kd.kanji} কাঞ্জির বিস্তারিত দেখুন`}
              >
                <span className="text-sm font-black text-blue-600">{kd.kanji}</span>
                <span className="text-gray-500 font-normal">({kd.readingHiragana})</span>
              </button>
            ))}
          </div>
        )}

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQ.options.map((opt, idx) => {
            const isSelected = userAnswer === idx;
            const isThisOptionCorrect = idx === currentQ.correctAnswer;

            let optionStyle = 'border-gray-200 hover:border-gray-300 hover:bg-slate-50 bg-white';
            let circleStyle = 'border-2 border-gray-300 text-gray-600 bg-gray-50';

            if (isAnswered) {
              if (isThisOptionCorrect) {
                optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                circleStyle = 'bg-emerald-600 text-white border-emerald-600';
              } else if (isSelected && !isThisOptionCorrect) {
                optionStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                circleStyle = 'bg-rose-500 text-white border-rose-500';
              }
            } else if (isSelected) {
              optionStyle = 'border-blue-600 bg-blue-50';
              circleStyle = 'bg-blue-600 text-white';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${optionStyle}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${circleStyle}`}>
                  {idx + 1}
                </div>
                <div className="flex-1 font-jp text-base sm:text-lg">
                  {opt}
                </div>
                {isAnswered && isThisOptionCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswered && isSelected && !isThisOptionCorrect && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Detailed Bengali Explanation (Shows immediately when answered) */}
        {isAnswered && (
          <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-gray-900 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-700" />
                <span>{t.explanationTitle}</span>
              </h4>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {t.correctAnswer}: অপশন {currentQ.correctAnswer + 1}
              </span>
            </div>

            {/* Meaning */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                {t.meaningTitle}:
              </p>
              <p className="text-sm font-bn text-gray-900 leading-relaxed font-medium">
                {currentQ.explanationBn.meaningBn}
              </p>
            </div>

            {/* Why Correct */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                {t.reasonTitle}:
              </p>
              <p className="text-sm font-bn text-gray-800 leading-relaxed">
                {currentQ.explanationBn.correctReasonBn}
              </p>
            </div>

            {/* Distractor reasons */}
            {currentQ.explanationBn.distractorReasonsBn && currentQ.explanationBn.distractorReasonsBn.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {t.distractorsTitle}:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs font-bn text-gray-700">
                  {currentQ.explanationBn.distractorReasonsBn.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Vocabulary Breakdown */}
            {currentQ.explanationBn.vocabularyNotesBn && currentQ.explanationBn.vocabularyNotesBn.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {t.vocabNotesTitle}:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bn text-gray-800">
                  {currentQ.explanationBn.vocabularyNotesBn.map((note, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-white/80 p-2 rounded-lg border border-amber-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grammar Note */}
            {currentQ.explanationBn.grammarNotesBn && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {t.grammarNotesTitle}:
                </p>
                <div className="text-xs font-bn text-gray-800 bg-white/80 p-2.5 rounded-lg border border-amber-100 leading-relaxed">
                  {currentQ.explanationBn.grammarNotesBn}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Pagination */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t.previousQuestion}</span>
          </button>

          <span className="text-xs text-gray-500 font-mono">
            {currentIndex + 1} / {total}
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === total - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>{t.nextQuestion}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Kanji Inspector Modal */}
      {inspectingKanji && (
        <KanjiInspectorModal
          kanjiDetail={inspectingKanji}
          lang={lang}
          onClose={() => setInspectingKanji(null)}
        />
      )}
    </div>
  );
};
