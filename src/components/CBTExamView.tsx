import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
} from 'lucide-react';
import { ExamSession, Question, AppLanguage } from '../types/exam';
import { CBTHeader } from './CBTHeader';
import { QuestionPalette } from './QuestionPalette';
import { AudioPlayerControl } from './AudioPlayerControl';
import { getTranslation } from '../data/translations';
import { translateInstruction } from '../data/instructionTranslations';

interface CBTExamViewProps {
  session: ExamSession;
  questions: Question[];
  lang: AppLanguage;
  onAnswerQuestion: (questionId: string, optionIndex: number) => void;
  onClearAnswer: (questionId: string) => void;
  onToggleFlag: (questionId: string) => void;
  onNavigateQuestion: (index: number) => void;
  onSubmitExam: () => void;
  onExitSession: () => void;
}

export const CBTExamView: React.FC<CBTExamViewProps> = ({
  session,
  questions,
  lang,
  onAnswerQuestion,
  onClearAnswer,
  onToggleFlag,
  onNavigateQuestion,
  onSubmitExam,
  onExitSession,
}) => {
  const t = getTranslation(lang);
  const [furiganaEnabled, setFuriganaEnabled] = useState(true);
  const [largeFontEnabled, setLargeFontEnabled] = useState(false);
  const [showPaletteMobile, setShowPaletteMobile] = useState(false);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);

  const currentQuestion = questions[session.currentQuestionIndex];
  const isFirst = session.currentQuestionIndex === 0;
  const isLast = session.currentQuestionIndex === questions.length - 1;

  const currentAnswer = currentQuestion ? session.answers[currentQuestion.id] : undefined;
  const isCurrentFlagged = currentQuestion ? Boolean(session.flagged[currentQuestion.id]) : false;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowLeft' && !isFirst) {
        onNavigateQuestion(session.currentQuestionIndex - 1);
      } else if (e.key === 'ArrowRight' && !isLast) {
        onNavigateQuestion(session.currentQuestionIndex + 1);
      } else if (['1', '2', '3', '4'].includes(e.key) && currentQuestion) {
        const optionIdx = parseInt(e.key, 10) - 1;
        if (optionIdx < currentQuestion.options.length) {
          onAnswerQuestion(currentQuestion.id, optionIdx);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [session.currentQuestionIndex, isFirst, isLast, currentQuestion, onNavigateQuestion, onAnswerQuestion]);

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-xs border">
          <p className="text-gray-600 mb-4">{t.audioNotAvailable}</p>
          <button
            onClick={onExitSession}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            {t.backToHome}
          </button>
        </div>
      </div>
    );
  }

  const answeredCount = questions.filter((q) => session.answers[q.id] !== undefined).length;
  const unansweredCount = questions.length - answeredCount;
  const flaggedCount = questions.filter((q) => session.flagged[q.id]).length;

  return (
    <div className={`min-h-screen flex flex-col bg-slate-100 ${!furiganaEnabled ? 'no-furigana' : ''}`}>
      {/* CBT Header */}
      <CBTHeader
        currentSection={currentQuestion.section}
        currentQuestionIndex={session.currentQuestionIndex}
        totalQuestions={questions.length}
        timeRemainingSeconds={session.timeRemainingSeconds}
        mode={session.mode}
        lang={lang}
        isFlagged={isCurrentFlagged}
        furiganaEnabled={furiganaEnabled}
        largeFontEnabled={largeFontEnabled}
        onToggleFlag={() => onToggleFlag(currentQuestion.id)}
        onToggleFurigana={() => setFuriganaEnabled(!furiganaEnabled)}
        onToggleLargeFont={() => setLargeFontEnabled(!largeFontEnabled)}
        onSubmitExam={() => setShowSubmitConfirmModal(true)}
        onExitSession={onExitSession}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left: Question Pane */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            {/* Question SubCategory & Prompt Instruction */}
            <div className="border-b border-gray-100 pb-4 mb-6">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  {currentQuestion.subCategory || 'JFT-Basic A2 Question'}
                </span>
                <span className="text-xs text-gray-700 font-mono">
                  {t.question} {session.currentQuestionIndex + 1} / {questions.length}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-blue-950 leading-relaxed font-bn bg-blue-50/70 p-3 rounded-xl border border-blue-100 mb-2">
                📌 নির্দেশনা: {lang === 'bn' ? translateInstruction(currentQuestion.title, 'bn') : currentQuestion.title}
              </h2>
              {lang === 'bn' && (
                <p className="text-xs text-gray-500 font-jp italic">
                  原文: {currentQuestion.title}
                </p>
              )}
            </div>

            {/* Reading / Dialog Passage Box */}
            {currentQuestion.passage && (
              <div className="mb-6 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed font-jp whitespace-pre-line text-sm sm:text-base">
                {currentQuestion.passage}
              </div>
            )}

            {/* Listening Section Audio Player */}
            {currentQuestion.section === 'listening' && (
              <AudioPlayerControl
                audioText={currentQuestion.audioText}
                audioUrl={currentQuestion.audioUrl}
                questionId={currentQuestion.id}
                playLimit={2}
                isPracticeMode={session.mode === 'practice'}
              />
            )}

            {/* Main Target Question text with Underline emphasis */}
            <div className="my-6 p-4 rounded-xl bg-blue-50/40 border border-blue-100">
              <div
                className={`font-jp text-gray-900 leading-loose ${
                  largeFontEnabled ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
                }`}
              >
                {currentQuestion.rubyText ? (
                  <span
                    dangerouslySetInnerHTML={{ __html: currentQuestion.rubyText }}
                    className="select-text"
                  />
                ) : (
                  <span
                    dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
                    className="select-text"
                  />
                )}
              </div>
            </div>

            {/* Options list (4 choices) */}
            <div className="space-y-3 mt-6">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = currentAnswer === idx;
                const optionLabel = idx + 1;

                return (
                  <label
                    key={idx}
                    onClick={() => onAnswerQuestion(currentQuestion.id, idx)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-slate-50/70 bg-white'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'border-2 border-gray-300 text-gray-600 bg-gray-50'
                      }`}
                    >
                      {optionLabel}
                    </div>

                    <div
                      className={`flex-1 font-jp leading-relaxed ${
                        largeFontEnabled ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
                      } ${isSelected ? 'text-blue-950 font-semibold' : 'text-gray-800'}`}
                    >
                      {option}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Bottom CBT Navigation Toolbar */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateQuestion(session.currentQuestionIndex - 1)}
                disabled={isFirst}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t.previousQuestion}</span>
              </button>

              {currentAnswer !== undefined && (
                <button
                  type="button"
                  onClick={() => onClearAnswer(currentQuestion.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors"
                  title="নির্বাচিত উত্তর মুছুন"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.clearAnswer}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPaletteMobile(!showPaletteMobile)}
                className="lg:hidden flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium bg-slate-50"
              >
                <Menu className="w-4 h-4" />
                <span>প্রশ্ন তালিকা</span>
              </button>

              {isLast ? (
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirmModal(true)}
                  className="flex items-center gap-1.5 px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-xs transition-colors"
                >
                  <span>{t.endExam}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigateQuestion(session.currentQuestionIndex + 1)}
                  className="flex items-center gap-1.5 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-xs transition-colors"
                >
                  <span>{t.nextQuestion}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Question Palette Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-20">
          <QuestionPalette
            questions={questions}
            currentQuestionIndex={session.currentQuestionIndex}
            answers={session.answers}
            flagged={session.flagged}
            onSelectQuestion={(idx) => onNavigateQuestion(idx)}
          />
        </div>
      </div>

      {/* Mobile Question Palette Modal Drawer */}
      {showPaletteMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white h-full p-4 overflow-y-auto flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b mb-3">
              <span className="font-bold text-gray-900 text-sm">প্রশ্ন নির্বাচন করুন</span>
              <button
                onClick={() => setShowPaletteMobile(false)}
                className="p-1 text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1">
              <QuestionPalette
                questions={questions}
                currentQuestionIndex={session.currentQuestionIndex}
                answers={session.answers}
                flagged={session.flagged}
                onSelectQuestion={(idx) => {
                  onNavigateQuestion(idx);
                  setShowPaletteMobile(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center gap-3 text-blue-600 mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{t.confirmSubmitTitle}</h3>
                <p className="text-xs text-gray-500">{t.confirmSubmitDesc}</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-4 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-gray-700">
                <span>সর্বমোট প্রশ্ন:</span>
                <span className="font-bold">{questions.length}টি</span>
              </div>
              <div className="flex justify-between items-center text-emerald-700">
                <span>{t.answered}:</span>
                <span className="font-bold">{answeredCount}টি</span>
              </div>
              <div className="flex justify-between items-center text-rose-600">
                <span>{t.unanswered}:</span>
                <span className="font-bold">{unansweredCount}টি</span>
              </div>
              {flaggedCount > 0 && (
                <div className="flex justify-between items-center text-amber-700">
                  <span>{t.flagged}:</span>
                  <span className="font-bold">{flaggedCount}টি</span>
                </div>
              )}
            </div>

            {unansweredCount > 0 && (
              <p className="text-xs text-amber-600 font-medium mb-4 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>সতর্কতা: আপনার এখনও {unansweredCount}টি প্রশ্নের উত্তর দেওয়া বাকি আছে!</span>
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitConfirmModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                পরীক্ষায় ফিরে যান
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitConfirmModal(false);
                  onSubmitExam();
                }}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-xs transition-colors"
              >
                হ্যাঁ, জমা দিন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
