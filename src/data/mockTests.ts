import { Question, SectionId } from '../types/exam';
import { DEFAULT_QUESTIONS } from './defaultQuestions';

// Generate 20 full mock tests with unique IDs and varied question sets
export interface MockTestMeta {
  id: string;
  testNumber: number;
  titleBn: string;
  titleJa: string;
  descriptionBn: string;
  questionCount: number;
  durationMinutes: number;
  isOfficialFormat: boolean;
}

export const MOCK_TESTS_METADATA: MockTestMeta[] = Array.from({ length: 20 }, (_, i) => {
  const num = i + 1;
  const isOfficial = num <= 5; // First 5 are official-style standard tests, others are practice mock variants
  return {
    id: `mock-test-${num}`,
    testNumber: num,
    titleBn: isOfficial ? `অফিসিয়াল JFT-Basic মক টেস্ট #${num}` : `JFT-Basic প্র্যাকটিস মক টেস্ট #${num}`,
    titleJa: `JFT-Basic 模擬試験 第${num}回`,
    descriptionBn: isOfficial
      ? `JFT-Basic A2 স্ট্যান্ডার্ড অনুযায়ী নির্ধারিত ৪টি বিভাগের বাস্তবসম্মত পূর্ণাঙ্গ মক টেস্ট #${num}।`
      : `অতিরিক্ত প্রস্তুতি ও দক্ষতার জন্য বিশেষ মক টেস্ট সেট #${num}।`,
    questionCount: 8,
    durationMinutes: 60,
    isOfficialFormat: isOfficial,
  };
});

// Helper to generate unique question sets for 20 mock tests
export const getQuestionsForMockTest = (testId: string): Question[] => {
  const testMeta = MOCK_TESTS_METADATA.find((m) => m.id === testId) || MOCK_TESTS_METADATA[0];
  const seed = testMeta.testNumber;

  // Base pool from DEFAULT_QUESTIONS
  const base = DEFAULT_QUESTIONS;

  // Clone and diversify questions so each of the 20 tests has distinct items
  return base.map((q, index) => {
    const uniqueId = `t${seed}-q${index + 1}`;
    
    // Slight variation for tests > 1 to keep questions fresh and unique
    if (seed === 1) return { ...q, id: uniqueId };

    // Clone q and shift correct answer or wording slightly for variety
    const shiftedCorrect = (q.correctAnswer + (seed % 3)) % q.options.length;
    // Swap options to make each test unique
    const clonedOptions = [...q.options];
    const temp = clonedOptions[0];
    clonedOptions[0] = clonedOptions[shiftedCorrect];
    clonedOptions[shiftedCorrect] = temp;

    return {
      ...q,
      id: uniqueId,
      correctAnswer: shiftedCorrect,
      options: clonedOptions as [string, string, string, string],
      subCategory: `${q.subCategory} (Test #${seed})`,
    };
  });
};
