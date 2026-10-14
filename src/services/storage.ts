import { DEFAULT_QUESTIONS } from '../data/defaultQuestions';
import { AppLanguage, ExamConfig, ExamResult, ExamSession, Question } from '../types/exam';

const STORAGE_KEYS = {
  ACTIVE_SESSION: 'jft_active_exam_session_v2',
  QUESTIONS: 'jft_custom_questions_v2',
  HISTORY: 'jft_exam_history_v2',
  CONFIG: 'jft_exam_config_v2',
  SAVED_QUESTIONS: 'jft_bookmarked_questions_v2',
  LANGUAGE: 'jft_app_language_v2',
};

export const DEFAULT_CONFIG: ExamConfig = {
  durationMinutes: 60,
  questionsPerSection: {
    vocabulary: 6,
    conversation: 3,
    listening: 2,
    reading: 2,
  },
  allowReplayTimes: 2,
  instantFeedbackInPractice: true,
  furiganaDefault: true,
  uiLanguage: 'bn',
};

// ----------------- Language Management -----------------
export const getStoredLanguage = (): AppLanguage => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (raw === 'ja' || raw === 'bn') return raw;
    return 'bn';
  } catch {
    return 'bn';
  }
};

export const setStoredLanguage = (lang: AppLanguage) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  } catch (err) {
    console.error('Failed to save language', err);
  }
};

// ----------------- Questions Management -----------------
export const getStoredQuestions = (): Question[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (!raw) return DEFAULT_QUESTIONS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_QUESTIONS;
    return parsed;
  } catch {
    return DEFAULT_QUESTIONS;
  }
};

export const saveCustomQuestions = (questions: Question[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  } catch (err) {
    console.error('Failed to save questions', err);
  }
};

export const resetQuestionsToDefault = () => {
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(DEFAULT_QUESTIONS));
  return DEFAULT_QUESTIONS;
};

// ----------------- Active Session Management -----------------
export const getActiveSession = (): ExamSession | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    if (!raw) return null;
    const session = JSON.parse(raw) as ExamSession;
    if (session.isCompleted) return null;
    return session;
  } catch {
    return null;
  }
};

export const saveActiveSession = (session: ExamSession) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save active session', err);
  }
};

export const clearActiveSession = () => {
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
};

// ----------------- Exam History -----------------
export const getExamHistory = (): ExamResult[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveExamResult = (result: ExamResult) => {
  try {
    const history = getExamHistory();
    const updated = [result, ...history.slice(0, 49)]; // keep latest 50
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save exam result', err);
  }
};

export const clearExamHistory = () => {
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
};

// ----------------- Bookmarks / Mistakes -----------------
export const getBookmarkedQuestionIds = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_QUESTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const toggleBookmarkQuestion = (questionId: string): boolean => {
  const bookmarks = getBookmarkedQuestionIds();
  const exists = bookmarks.includes(questionId);
  const updated = exists ? bookmarks.filter((id) => id !== questionId) : [...bookmarks, questionId];
  localStorage.setItem(STORAGE_KEYS.SAVED_QUESTIONS, JSON.stringify(updated));
  return !exists;
};

// ----------------- Config -----------------
export const getStoredConfig = (): ExamConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!raw) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
};

export const saveStoredConfig = (config: ExamConfig) => {
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
};
