export interface QuestionInstructionTranslation {
  ja: string;
  bn: string;
}

export const INSTRUCTION_TRANSLATIONS: Record<string, string> = {
  // Common JFT-Basic Question Instructions
  '＿＿＿の ことばの よみかたとして いちばん いい ものを ひとつ えらんでください。': 'নিচের শব্দটির সঠিক উচ্চারণ বা হিরাগানা রিডিং নির্বাচন করুন।',
  '＿＿＿の ことばは どう かきますか。いちばん いい ものを ひとつ えらんでください。': 'চিহ্নিত শব্দটির সঠিক কাঞ্জি বা বানান নির্বাচন করুন।',
  '（　）に なにを いれますか。いちばん いい ものを ひとつ えらんでください。': 'শূন্যস্থানে সঠিক শব্দ বা ব্যাকরণ নির্বাচন করুন।',
  '＿＿＿の ぶんと だいたい おなじ いみの ぶんは どれですか。': 'মূল বাক্যের সাথে প্রায় সমার্থক বা একই অর্থবোধক বাক্যটি নির্বাচন করুন।',
  '（　）に はいる いちばん いい ものを ひとつ えらんでください。': 'শূন্যস্থানে সবচেয়ে উপযুক্ত শব্দটি নির্বাচন করুন।',
  '音声を聞いて、質問に答えてください。質問の答えとして最もよいものを一つ選んでください。': 'অডিও শুনে প্রশ্নটির সঠিক উত্তর নির্বাচন করুন।',
  'つぎの ごみの すてかたの お知らせを よんで、しつもんに こたえてください。': 'নিচের আবর্জনা অপসারণ সংক্রান্ত নোটিশটি পড়ে প্রশ্নের সঠিক উত্তর দিন।',
  'つぎの メールを よんで、しつもんに こたえてください。': 'নিচের ইমেইলটি পড়ে প্রশ্নের সঠিক উত্তর দিন।',
  'つぎの スーパーの チラシを よんで、しつもんに こたえてください。': 'নিচের সুপারমার্কেটের লিফলেট বা বিজ্ঞাপনটি পড়ে প্রশ্নের সঠিক উত্তর দিন।',
};

export const translateInstruction = (title: string, lang: 'bn' | 'ja'): string => {
  if (lang === 'ja') return title;
  
  // Exact match lookup
  if (INSTRUCTION_TRANSLATIONS[title]) {
    return INSTRUCTION_TRANSLATIONS[title];
  }

  // Fallback pattern matching for custom or variant questions
  const lower = title.toLowerCase();
  if (lower.includes('よみかた') || lower.includes('読')) {
    return 'নিচের শব্দটির সঠিক উচ্চারণ বা হিরাগানা রিডিং নির্বাচন করুন।';
  }
  if (lower.includes('かきますか') || lower.includes('書')) {
    return 'চিহ্নিত শব্দটির সঠিক কাঞ্জি বা বানান নির্বাচন করুন।';
  }
  if (lower.includes('えらんで') || lower.includes('選')) {
    return 'সঠিক উত্তরটি নির্বাচন করুন।';
  }
  if (lower.includes('きいて') || lower.includes('音声') || lower.includes('聞')) {
    return 'অডিও শুনে সঠিক উত্তর দিন।';
  }
  if (lower.includes('よんで') || lower.includes('読')) {
    return 'নিচের লেখাটি পড়ে প্রশ্নের সঠিক উত্তর দিন।';
  }

  // Default fallback if no pattern matches
  return 'নিচের প্রশ্নটির সঠিক উত্তর নির্বাচন করুন।';
};
