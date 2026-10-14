/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  getActiveSession,
  saveActiveSession,
  clearActiveSession,
  getStoredQuestions,
  saveCustomQuestions,
  resetQuestionsToDefault,
  getExamHistory,
  saveExamResult,
  clearExamHistory,
  getBookmarkedQuestionIds,
  toggleBookmarkQuestion,
  getStoredConfig,
  getStoredLanguage,
  setStoredLanguage,
} from './services/storage';
import { AppLanguage, ExamConfig, ExamResult, ExamSession, Question, SectionId, SectionResult, KanjiDetail } from './types/exam';
import { Navbar } from './components/Navbar';
import { HomeDashboardView } from './components/HomeDashboardView';
import { CBTExamView } from './components/CBTExamView';
import { PracticeModeView } from './components/PracticeModeView';
import { KanjiLearningDeck } from './components/KanjiLearningDeck';
import { ResultReviewView } from './components/ResultReviewView';
import { HistoryView } from './components/HistoryView';
import { ExamSetupModal } from './components/ExamSetupModal';
import { QuestionBankModal } from './components/QuestionBankModal';
import { ExportToGoogleFormsModal } from './components/ExportToGoogleFormsModal';
import { KanjiInspectorModal } from './components/KanjiInspectorModal';
import { SECTIONS } from './data/sections';

export default function App() {
  const [lang, setLang] = useState<AppLanguage>(getStoredLanguage);
  const [questions, setQuestions] = useState<Question[]>(getStoredQuestions);
  const [activeSession, setActiveSession] = useState<ExamSession | null>(getActiveSession);
  const [history, setHistory] = useState<ExamResult[]>(getExamHistory);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(getBookmarkedQuestionIds);
  const [config, setConfig] = useState<ExamConfig>(getStoredConfig);

  const [activeView, setActiveView] = useState<'home' | 'cbt-exam' | 'practice' | 'kanji-deck' | 'results' | 'history'>(() => {
    const session = getActiveSession();
    return session && !session.isCompleted ? 'cbt-exam' : 'home';
  });

  const [currentReviewResult, setCurrentReviewResult] = useState<ExamResult | null>(null);
  const [inspectingKanji, setInspectingKanji] = useState<KanjiDetail | null>(null);

  // Modals
  const [showExamSetupModal, setShowExamSetupModal] = useState(false);
  const [showQuestionBankModal, setShowQuestionBankModal] = useState(false);
  const [showGoogleFormsModal, setShowGoogleFormsModal] = useState(false);

  // Handle language switch
  const handleLanguageChange = (newLang: AppLanguage) => {
    setLang(newLang);
    setStoredLanguage(newLang);
  };

  // Active exam questions array corresponding to activeSession.questionIds
  const activeExamQuestions = activeSession
    ? activeSession.questionIds
        .map((id) => questions.find((q) => q.id === id))
        .filter((q): q is Question => q !== undefined)
    : [];

  // Countdown timer for CBT exam
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (activeView === 'cbt-exam' && activeSession && activeSession.mode === 'exam') {
      timerRef.current = setInterval(() => {
        setActiveSession((prev) => {
          if (!prev || prev.isCompleted) return prev;
          if (prev.timeRemainingSeconds <= 1) {
            // Auto submit when time reaches 0!
            clearInterval(timerRef.current!);
            setTimeout(() => {
              handleSubmitExam(prev);
            }, 0);
            return { ...prev, timeRemainingSeconds: 0 };
          }
          const updated = {
            ...prev,
            timeRemainingSeconds: prev.timeRemainingSeconds - 1,
          };
          saveActiveSession(updated);
          return updated;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeView, activeSession?.id]);

  // Start new Exam
  const handleStartExam = (setupOptions: {
    durationMinutes: number;
    selectedSections: SectionId[];
    customQuestions?: Question[];
  }) => {
    const pool = setupOptions.customQuestions || questions;
    const matchingQuestions = pool.filter((q) => setupOptions.selectedSections.includes(q.section));
    if (matchingQuestions.length === 0) return;

    const newSession: ExamSession = {
      id: `session-${Date.now()}`,
      mode: 'exam',
      startedAt: Date.now(),
      durationMinutes: setupOptions.durationMinutes,
      timeRemainingSeconds: setupOptions.durationMinutes * 60,
      questionIds: matchingQuestions.map((q) => q.id),
      answers: {},
      flagged: {},
      currentQuestionIndex: 0,
      isCompleted: false,
    };

    saveActiveSession(newSession);
    setActiveSession(newSession);
    setShowExamSetupModal(false);
    setActiveView('cbt-exam');
  };

  // Answer a question
  const handleAnswerQuestion = (questionId: string, optionIndex: number) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: optionIndex,
        },
      };
      saveActiveSession(updated);
      return updated;
    });
  };

  // Clear answer
  const handleClearAnswer = (questionId: string) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      const newAnswers = { ...prev.answers };
      delete newAnswers[questionId];
      const updated = {
        ...prev,
        answers: newAnswers,
      };
      saveActiveSession(updated);
      return updated;
    });
  };

  // Toggle flag for review
  const handleToggleFlag = (questionId: string) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        flagged: {
          ...prev.flagged,
          [questionId]: !prev.flagged[questionId],
        },
      };
      saveActiveSession(updated);
      return updated;
    });
  };

  // Navigate question
  const handleNavigateQuestion = (index: number) => {
    setActiveSession((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        currentQuestionIndex: Math.max(0, Math.min(index, prev.questionIds.length - 1)),
      };
      saveActiveSession(updated);
      return updated;
    });
  };

  // Submit Exam
  const handleSubmitExam = (sessionToSubmit?: ExamSession) => {
    const session = sessionToSubmit || activeSession;
    if (!session) return;

    const examQuestions = session.questionIds
      .map((id) => questions.find((q) => q.id === id))
      .filter((q): q is Question => q !== undefined);

    const now = Date.now();
    const timeSpentSeconds = Math.max(0, Math.round((now - session.startedAt) / 1000));

    // Calculate scores
    let correctCount = 0;
    const sectionStats: Record<SectionId, { total: number; correct: number }> = {
      vocabulary: { total: 0, correct: 0 },
      conversation: { total: 0, correct: 0 },
      listening: { total: 0, correct: 0 },
      reading: { total: 0, correct: 0 },
    };

    examQuestions.forEach((q) => {
      const userAns = session.answers[q.id];
      const isCorrect = userAns === q.correctAnswer;
      if (isCorrect) correctCount++;

      if (sectionStats[q.section]) {
        sectionStats[q.section].total++;
        if (isCorrect) sectionStats[q.section].correct++;
      }
    });

    const totalQuestions = examQuestions.length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const maxScore = 250;
    const totalScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * maxScore) : 0;
    const isPassed = totalScore >= 200 || percentage >= 80;

    const sectionScores: Record<SectionId, SectionResult> = {
      vocabulary: {
        score: Math.round((sectionStats.vocabulary.correct / (sectionStats.vocabulary.total || 1)) * 62.5),
        maxScore: 62.5,
        percentage: Math.round((sectionStats.vocabulary.correct / (sectionStats.vocabulary.total || 1)) * 100),
        totalQuestions: sectionStats.vocabulary.total,
        correctCount: sectionStats.vocabulary.correct,
      },
      conversation: {
        score: Math.round((sectionStats.conversation.correct / (sectionStats.conversation.total || 1)) * 62.5),
        maxScore: 62.5,
        percentage: Math.round((sectionStats.conversation.correct / (sectionStats.conversation.total || 1)) * 100),
        totalQuestions: sectionStats.conversation.total,
        correctCount: sectionStats.conversation.correct,
      },
      listening: {
        score: Math.round((sectionStats.listening.correct / (sectionStats.listening.total || 1)) * 62.5),
        maxScore: 62.5,
        percentage: Math.round((sectionStats.listening.correct / (sectionStats.listening.total || 1)) * 100),
        totalQuestions: sectionStats.listening.total,
        correctCount: sectionStats.listening.correct,
      },
      reading: {
        score: Math.round((sectionStats.reading.correct / (sectionStats.reading.total || 1)) * 62.5),
        maxScore: 62.5,
        percentage: Math.round((sectionStats.reading.correct / (sectionStats.reading.total || 1)) * 100),
        totalQuestions: sectionStats.reading.total,
        correctCount: sectionStats.reading.correct,
      },
    };

    // Calculate weak areas needing practice
    const weakAreas = SECTIONS.filter((sec) => {
      const s = sectionScores[sec.id];
      return s && s.totalQuestions > 0 && s.percentage < 80;
    }).map((sec) => ({
      sectionId: sec.id,
      sectionNameJa: sec.nameJa,
      sectionNameBn: sec.nameBn,
      percentage: sectionScores[sec.id].percentage,
      suggestionBn: `${sec.nameBn}-এ কাঙ্ক্ষিত ৮০% স্কোরের চেয়ে কম হয়েছে। কাঞ্জি ও ভোকাবুলারি ডেক থেকে সংশ্লিষ্ট অংশ অনুশীলন করুন।`,
    }));

    const examResult: ExamResult = {
      id: `result-${Date.now()}`,
      sessionId: session.id,
      mode: session.mode,
      startedAt: session.startedAt,
      completedAt: now,
      timeSpentSeconds,
      totalScore,
      maxScore,
      percentage,
      isPassed,
      sectionScores,
      totalQuestions,
      correctAnswersCount: correctCount,
      answers: session.answers,
      flagged: session.flagged,
      questions: examQuestions,
      weakAreas,
    };

    saveExamResult(examResult);
    setHistory(getExamHistory());
    clearActiveSession();
    setActiveSession(null);
    setCurrentReviewResult(examResult);
    setActiveView('results');
  };

  // Bookmark question
  const handleToggleBookmark = (questionId: string) => {
    toggleBookmarkQuestion(questionId);
    setBookmarkedIds(getBookmarkedQuestionIds());
  };

  // Questions update
  const handleSaveQuestions = (updated: Question[]) => {
    saveCustomQuestions(updated);
    setQuestions(updated);
  };

  const handleResetQuestions = () => {
    const defaults = resetQuestionsToDefault();
    setQuestions(defaults);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Navbar (hidden during active CBT exam) */}
      {activeView !== 'cbt-exam' && (
        <Navbar
          activeView={activeView}
          lang={lang}
          onLanguageChange={handleLanguageChange}
          onNavigate={(view) => setActiveView(view)}
          onOpenQuestionBank={() => setShowQuestionBankModal(true)}
          onStartExamClick={() => setShowExamSetupModal(true)}
          hasActiveSession={Boolean(activeSession)}
          onResumeActiveSession={() => setActiveView('cbt-exam')}
        />
      )}

      {/* Main Views */}
      <main className="flex-1">
        {activeView === 'home' && (
          <HomeDashboardView
            questions={questions}
            activeSession={activeSession}
            lang={lang}
            onResumeSession={() => setActiveView('cbt-exam')}
            onOpenExamSetup={() => setShowExamSetupModal(true)}
            onStartPractice={(secId) => setActiveView('practice')}
            onOpenKanjiDeck={() => setActiveView('kanji-deck')}
            onOpenQuestionBank={() => setShowQuestionBankModal(true)}
            onViewHistory={() => setActiveView('history')}
            onOpenGoogleFormsExport={() => setShowGoogleFormsModal(true)}
          />
        )}

        {activeView === 'cbt-exam' && activeSession && (
          <CBTExamView
            session={activeSession}
            questions={activeExamQuestions}
            lang={lang}
            onAnswerQuestion={handleAnswerQuestion}
            onClearAnswer={handleClearAnswer}
            onToggleFlag={handleToggleFlag}
            onNavigateQuestion={handleNavigateQuestion}
            onSubmitExam={() => handleSubmitExam()}
            onExitSession={() => setActiveView('home')}
          />
        )}

        {activeView === 'practice' && (
          <PracticeModeView
            questions={questions}
            lang={lang}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onExit={() => setActiveView('home')}
          />
        )}

        {activeView === 'kanji-deck' && (
          <KanjiLearningDeck
            questions={questions}
            lang={lang}
            onExit={() => setActiveView('home')}
            onOpenInspector={(kd) => setInspectingKanji(kd)}
          />
        )}

        {activeView === 'results' && currentReviewResult && (
          <ResultReviewView
            result={currentReviewResult}
            lang={lang}
            onRetakeExam={() => setShowExamSetupModal(true)}
            onGoToPractice={() => setActiveView('practice')}
            onExportToGoogleForms={() => setShowGoogleFormsModal(true)}
            onExit={() => setActiveView('home')}
          />
        )}

        {activeView === 'history' && (
          <HistoryView
            history={history}
            lang={lang}
            onSelectResultToReview={(res) => {
              setCurrentReviewResult(res);
              setActiveView('results');
            }}
            onClearHistory={() => {
              clearExamHistory();
              setHistory([]);
            }}
            onExit={() => setActiveView('home')}
          />
        )}
      </main>

      {/* Footer */}
      {activeView !== 'cbt-exam' && (
        <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              Personal JFT-Basic CBT Exam Simulator • জাপানি ভাষা পরীক্ষার ব্যক্তিগত প্রস্তুতি
            </p>
            <p className="text-gray-400">
              * এই সিমুলেটরটি শুধুমাত্র ব্যক্তিগত শিক্ষা ও পরীক্ষার অনুশীলনের জন্য তৈরি।
            </p>
          </div>
        </footer>
      )}

      {/* Modals */}
      {showExamSetupModal && (
        <ExamSetupModal
          questions={questions}
          defaultConfig={config}
          lang={lang}
          onStartExam={handleStartExam}
          onClose={() => setShowExamSetupModal(false)}
        />
      )}

      {showQuestionBankModal && (
        <QuestionBankModal
          questions={questions}
          lang={lang}
          onSaveQuestions={handleSaveQuestions}
          onResetDefault={handleResetQuestions}
          onClose={() => setShowQuestionBankModal(false)}
        />
      )}

      {showGoogleFormsModal && (
        <ExportToGoogleFormsModal
          questions={currentReviewResult ? currentReviewResult.questions : questions}
          onClose={() => setShowGoogleFormsModal(false)}
        />
      )}

      {inspectingKanji && (
        <KanjiInspectorModal
          kanjiDetail={inspectingKanji}
          lang={lang}
          onClose={() => setInspectingKanji(null)}
        />
      )}
    </div>
  );
}
