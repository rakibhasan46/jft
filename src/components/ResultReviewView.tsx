import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  Share2,
  Filter,
  Flag,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';
import { ExamResult, Question, SectionId, AppLanguage, KanjiDetail } from '../types/exam';
import { SECTIONS, getSectionMeta } from '../data/sections';
import { AudioPlayerControl } from './AudioPlayerControl';
import { KanjiInspectorModal } from './KanjiInspectorModal';
import { getTranslation } from '../data/translations';

interface ResultReviewViewProps {
  result: ExamResult;
  lang: AppLanguage;
  onRetakeExam: () => void;
  onGoToPractice: () => void;
  onExportToGoogleForms: () => void;
  onExit: () => void;
}

export const ResultReviewView: React.FC<ResultReviewViewProps> = ({
  result,
  lang,
  onRetakeExam,
  onGoToPractice,
  onExportToGoogleForms,
  onExit,
}) => {
  const t = getTranslation(lang);
  const [filter, setFilter] = useState<'all' | 'wrong' | 'correct' | 'flagged'>('all');
  const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});
  const [inspectingKanji, setInspectingKanji] = useState<KanjiDetail | null>(null);

  // Confetti on passing
  useEffect(() => {
    if (result.isPassed) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [result.isPassed]);

  const mins = Math.floor(result.timeSpentSeconds / 60);
  const secs = result.timeSpentSeconds % 60;
  const timeFormatted = `${mins} মিনিট ${secs} সেকেন্ড`;

  const toggleExpand = (qId: string) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const filteredQuestions = result.questions.filter((q) => {
    const userAns = result.answers[q.id];
    const isCorrect = userAns === q.correctAnswer;
    const isFlagged = Boolean(result.flagged[q.id]);

    if (filter === 'wrong') return !isCorrect;
    if (filter === 'correct') return isCorrect;
    if (filter === 'flagged') return isFlagged;
    return true;
  });

  const wrongCount = result.totalQuestions - result.correctAnswersCount;

  // Determine weak areas where percentage < 80%
  const weakSections = SECTIONS.filter((sec) => {
    const s = result.sectionScores[sec.id];
    return s && s.totalQuestions > 0 && s.percentage < 80;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Banner: Score & Verdict */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs mb-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4 bg-slate-100 text-slate-800">
            <span>{t.examResultTitle}</span>
          </div>

          {/* Pass/Fail Verdict */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <Trophy className={`w-8 h-8 sm:w-10 sm:h-10 ${result.isPassed ? 'text-amber-500' : 'text-slate-400'}`} />
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
              {result.isPassed ? (
                <span className="text-emerald-600">{t.passVerdict}</span>
              ) : (
                <span className="text-rose-600">{t.failVerdict}</span>
              )}
            </h1>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            {result.isPassed ? t.passDescription : t.failDescription}
          </p>

          {/* Big Score Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
              <span className="text-xs text-blue-700 font-medium block mb-1">{t.totalScore}</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-900 font-mono">
                {result.totalScore}
                <span className="text-sm font-normal text-blue-600"> / {result.maxScore}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-xs text-emerald-700 font-medium block mb-1">{t.answered}</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 font-mono">
                {result.correctAnswersCount}
                <span className="text-sm font-normal text-emerald-600"> / {result.totalQuestions}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
              <span className="text-xs text-purple-700 font-medium block mb-1">{t.accuracyRate}</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-900 font-mono">
                {result.percentage}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-600 font-medium block mb-1">{t.timeSpent}</span>
              <div className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-1.5 mt-1 font-mono">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>{timeFormatted}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={onRetakeExam}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.retakeExam}</span>
            </button>

            <button
              onClick={onGoToPractice}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.practiceMode}</span>
            </button>

            <button
              onClick={onExportToGoogleForms}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-xs transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{t.googleFormsExport}</span>
            </button>

            <button
              onClick={onExit}
              className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-sm transition-colors"
            >
              {t.backToHome}
            </button>
          </div>
        </div>
      </div>

      {/* Weak Areas & Improvement Recommendations Card */}
      {weakSections.length > 0 && (
        <div className="bg-amber-50/80 rounded-3xl border border-amber-200 p-6 mb-8 text-amber-950">
          <h3 className="text-base font-bold flex items-center gap-2 mb-2 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>{t.weakAreasTitle}</span>
          </h3>
          <p className="text-xs text-amber-800 mb-4">
            নিচের বিভাগগুলোতে কাঙ্ক্ষিত ৮০% স্কোরের চেয়ে কম হয়েছে। পরবর্তী পরীক্ষার আগে এগুলো রিভিশন করার পরামর্শ দেওয়া হচ্ছে:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {weakSections.map((sec) => {
              const s = result.sectionScores[sec.id];
              return (
                <div key={sec.id} className="p-3 bg-white/90 rounded-xl border border-amber-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-900 font-jp">{sec.nameJa} ({sec.nameBn})</span>
                    <span className="font-bold text-rose-600">{s.percentage}%</span>
                  </div>
                  <p className="text-gray-600 text-[11px] font-bn">
                    সঠিক হয়েছে {s.correctCount}/{s.totalQuestions}টি প্রশ্ন। কাঞ্জি ও ভোকাবুলারি ডেক থেকে সংশ্লিষ্ট অংশ অনুশীলন করুন।
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section-by-Section Performance Breakdown */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs mb-8">
        <h3 className="text-base font-bold text-gray-900 mb-4">
          {t.sectionAnalysis}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SECTIONS.map((sec) => {
            const secResult = result.sectionScores[sec.id] || {
              score: 0,
              maxScore: 0,
              percentage: 0,
              totalQuestions: 0,
              correctCount: 0,
            };

            return (
              <div
                key={sec.id}
                className="p-4 rounded-2xl border border-gray-200 bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-900 font-jp">{sec.nameJa}</span>
                    <span className="text-xs font-semibold text-gray-600 font-mono">{secResult.percentage}%</span>
                  </div>
                  <span className="text-xs text-gray-500 block mb-3 font-bn">{sec.nameBn}</span>

                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${secResult.percentage}%`,
                        backgroundColor: sec.color,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-700 pt-2 border-t border-gray-200">
                  <span>সঠিক উত্তর:</span>
                  <span className="font-bold font-mono">
                    {secResult.correctCount} / {secResult.totalQuestions}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Disclaimer Box as strictly requested */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700 mb-8 space-y-1">
        <strong className="text-slate-900 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-slate-600" />
          <span>{t.disclaimerTitle}</span>
        </strong>
        <p className="leading-relaxed font-bn">
          {t.disclaimerText}
        </p>
      </div>

      {/* Question Review Section with Bengali Explanations & Kanji */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              প্রশ্নের উত্তর ও বিস্তারিত বাংলা ব্যাখ্যা
            </h3>
            <p className="text-xs text-gray-500">
              প্রতিটি প্রশ্নের সাথে কাঞ্জি বিশদ, শব্দার্থ, ব্যাকরণ ও সঠিক উত্তরের যুক্তি সংযোজিত রয়েছে।
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 p-1 rounded-xl text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'all' ? 'bg-slate-900 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              সকল ({result.questions.length})
            </button>
            <button
              onClick={() => setFilter('wrong')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'wrong' ? 'bg-rose-600 text-white' : 'text-rose-600 hover:bg-rose-50'
              }`}
            >
              ভুল ({wrongCount})
            </button>
            <button
              onClick={() => setFilter('correct')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'correct' ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              সঠিক ({result.correctAnswersCount})
            </button>
            <button
              onClick={() => setFilter('flagged')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'flagged' ? 'bg-amber-500 text-white' : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              ফ্ল্যাগ করা
            </button>
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const userAns = result.answers[q.id];
            const isCorrect = userAns === q.correctAnswer;
            const isUnanswered = userAns === undefined;
            const isExpanded = expandedExplanations[q.id] ?? true;
            const secMeta = getSectionMeta(q.section);

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl border-2 p-5 sm:p-6 transition-all ${
                  isCorrect ? 'border-emerald-200' : isUnanswered ? 'border-gray-200' : 'border-rose-200'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 text-xs font-bold text-white rounded"
                      style={{ backgroundColor: secMeta.color }}
                    >
                      {secMeta.nameJa}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">{q.subCategory}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>সঠিক</span>
                      </span>
                    ) : isUnanswered ? (
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                        উত্তর দেওয়া হয়নি
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>ভুল উত্তর</span>
                      </span>
                    )}

                    <button
                      onClick={() => toggleExpand(q.id)}
                      className="p-1 text-gray-400 hover:text-gray-700"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Question title & passage */}
                <p className="text-sm font-medium text-gray-700 font-jp mb-2">{q.title}</p>
                {q.passage && (
                  <div className="p-3 bg-slate-50 border rounded-xl text-xs sm:text-sm font-jp text-slate-800 whitespace-pre-line mb-3">
                    {q.passage}
                  </div>
                )}

                {/* Audio for Listening */}
                {q.section === 'listening' && (
                  <div className="my-3">
                    <AudioPlayerControl
                      audioText={q.audioText}
                      audioUrl={q.audioUrl}
                      questionId={`review-${q.id}`}
                      isPracticeMode={true}
                    />
                  </div>
                )}

                {/* Target question with Underline */}
                <div className="p-3 rounded-xl bg-blue-50/40 border border-blue-100 mb-3 font-jp text-base text-gray-900 leading-relaxed">
                  {q.rubyText ? (
                    <span dangerouslySetInnerHTML={{ __html: q.rubyText }} />
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: q.question }} />
                  )}
                </div>

                {/* Interactive Kanji Pills in Review */}
                {q.kanjiDetails && q.kanjiDetails.length > 0 && (
                  <div className="mb-4 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-gray-500 mr-1 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-blue-600" />
                      <span>কাঞ্জি বিস্তারিত:</span>
                    </span>
                    {q.kanjiDetails.map((kd) => (
                      <button
                        key={kd.kanji}
                        type="button"
                        onClick={() => setInspectingKanji(kd)}
                        className="px-2.5 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-jp font-semibold transition-colors"
                      >
                        {kd.kanji} ({kd.readingHiragana})
                      </button>
                    ))}
                  </div>
                )}

                {/* Options Review Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {q.options.map((opt, oIdx) => {
                    const isUserChoice = userAns === oIdx;
                    const isRightChoice = q.correctAnswer === oIdx;

                    let cardClass = 'border-gray-200 bg-gray-50/50 text-gray-700';
                    if (isRightChoice) {
                      cardClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                    } else if (isUserChoice && !isRightChoice) {
                      cardClass = 'border-rose-400 bg-rose-50 text-rose-950 line-through';
                    }

                    return (
                      <div
                        key={oIdx}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-jp ${cardClass}`}
                      >
                        <span className="w-6 h-6 rounded-full bg-white border flex items-center justify-center font-bold text-xs shrink-0">
                          {oIdx + 1}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isRightChoice && (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                            {t.correctAnswer}
                          </span>
                        )}
                        {isUserChoice && !isRightChoice && (
                          <span className="text-[11px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full shrink-0">
                            {t.yourAnswer}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Expandable Bengali Explanation Box */}
                {isExpanded && (
                  <div className="mt-4 p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-gray-900 space-y-3 text-xs sm:text-sm">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                      <HelpCircle className="w-4 h-4 text-amber-700" />
                      <span>{t.explanationTitle}:</span>
                    </div>

                    <div>
                      <strong className="text-gray-700">{t.meaningTitle}: </strong>
                      <span className="text-gray-900 font-medium font-bn">{q.explanationBn.meaningBn}</span>
                    </div>

                    <div>
                      <strong className="text-gray-700">{t.reasonTitle}: </strong>
                      <span className="text-gray-800 font-bn">{q.explanationBn.correctReasonBn}</span>
                    </div>

                    {q.explanationBn.distractorReasonsBn && q.explanationBn.distractorReasonsBn.length > 0 && (
                      <div>
                        <strong className="text-gray-700 block mb-1">{t.distractorsTitle}:</strong>
                        <ul className="list-disc list-inside space-y-0.5 text-xs font-bn text-gray-700">
                          {q.explanationBn.distractorReasonsBn.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {q.explanationBn.vocabularyNotesBn && (
                      <div className="pt-1">
                        <strong className="text-gray-700 block mb-1">{t.vocabNotesTitle}:</strong>
                        <div className="flex flex-wrap gap-1.5">
                          {q.explanationBn.vocabularyNotesBn.map((note, nIdx) => (
                            <span
                              key={nIdx}
                              className="bg-white/90 border border-amber-200 px-2 py-1 rounded text-xs text-gray-800 font-bn"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {q.explanationBn.grammarNotesBn && (
                      <div className="pt-1">
                        <strong className="text-gray-700">{t.grammarNotesTitle}: </strong>
                        <span className="text-gray-800 font-bn">{q.explanationBn.grammarNotesBn}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
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
