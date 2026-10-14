export type SectionId = 'vocabulary' | 'conversation' | 'listening' | 'reading';
export type AppLanguage = 'bn' | 'ja';

export interface SectionMeta {
  id: SectionId;
  nameJa: string;
  nameEn: string;
  nameBn: string;
  icon: string;
  color: string;
  descriptionJa: string;
  descriptionBn: string;
}

export interface KanjiCompound {
  word: string;
  reading: string;
  meaningBn: string;
  meaningJa?: string;
}

export interface KanjiDetail {
  kanji: string;
  readingHiragana: string; // e.g. あたら・しい
  onyomi?: string; // e.g. シン (SHIN)
  kunyomi?: string; // e.g. あたら-しい (atarashii)
  meaningBn: string; // বাংলা অর্থ e.g. নতুন
  meaningJa?: string; // 日本語意味 e.g. 新しい、新規
  strokeCount?: number;
  compounds?: KanjiCompound[]; // e.g. 新聞 (しんぶん), 新年 (しんねん)
  sentenceExample?: {
    sentence: string;
    reading: string;
    meaningBn: string;
  };
}

export interface Question {
  id: string;
  section: SectionId;
  subCategory?: string;
  title: string; // Question instruction
  passage?: string; // Long text for Reading, or dialogue context
  rubyText?: string; // Text with HTML <ruby> tag for Furigana
  question: string; // The core target sentence or question
  underlinedWord?: string; // Specific word or kanji underlined in the question
  options: [string, string, string, string] | string[]; // 4 options
  correctAnswer: number; // 0, 1, 2, or 3
  audioText?: string; // Japanese text to be voiced by TTS player
  audioUrl?: string; // Optional audio file URL
  audioPlayLimit?: number; // Times allowed to replay (default 2 in CBT)
  audioTranscriptJa?: string; // Transcript of listening dialogue
  kanjiDetails?: KanjiDetail[]; // Kanji breakdown for deep learning
  explanationBn: {
    meaningBn: string; // Bengali translation of the sentence/dialogue
    correctReasonBn: string; // Why the correct option is right
    distractorReasonsBn?: string[]; // Why other options are incorrect
    vocabularyNotesBn?: string[]; // Vocabulary meanings in Bengali
    grammarNotesBn?: string; // Grammar notes in Bengali
  };
  explanationJa?: {
    meaningJa: string;
    correctReasonJa: string;
    grammarNotesJa?: string;
  };
  isCustom?: boolean; // false = official sample question, true = user created
  createdAt?: number;
}

export interface ExamConfig {
  durationMinutes: number; // default 60
  questionsPerSection: {
    vocabulary: number;
    conversation: number;
    listening: number;
    reading: number;
  };
  allowReplayTimes: number; // 2 for CBT
  instantFeedbackInPractice: boolean;
  furiganaDefault: boolean;
  uiLanguage: AppLanguage;
}

export interface ExamSession {
  id: string;
  mode: 'exam' | 'practice';
  activeSection?: SectionId | 'all';
  startedAt: number;
  durationMinutes: number;
  timeRemainingSeconds: number;
  questionIds: string[];
  answers: Record<string, number>; // questionId -> optionIndex
  flagged: Record<string, boolean>; // questionId -> isFlagged
  currentQuestionIndex: number;
  isCompleted: boolean;
  completedAt?: number;
}

export interface SectionResult {
  score: number;
  maxScore: number;
  percentage: number;
  totalQuestions: number;
  correctCount: number;
}

export interface ExamResult {
  id: string;
  sessionId: string;
  mode: 'exam' | 'practice';
  startedAt: number;
  completedAt: number;
  timeSpentSeconds: number;
  totalScore: number; // scaled benchmark out of 250 in standard JFT simulation
  maxScore: number;
  percentage: number;
  isPassed: boolean; // simulation benchmark >= 200 points (80%)
  sectionScores: Record<SectionId, SectionResult>;
  totalQuestions: number;
  correctAnswersCount: number;
  answers: Record<string, number>;
  flagged: Record<string, boolean>;
  questions: Question[];
  weakAreas: {
    sectionId: SectionId;
    sectionNameJa: string;
    sectionNameBn: string;
    percentage: number;
    suggestionBn: string;
  }[];
}
