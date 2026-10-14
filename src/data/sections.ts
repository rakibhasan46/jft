import { SectionId, SectionMeta } from '../types/exam';

export const SECTIONS: SectionMeta[] = [
  {
    id: 'vocabulary',
    nameJa: '文字・語彙',
    nameEn: 'Script & Vocabulary',
    nameBn: 'বর্ণ ও শব্দভাণ্ডার',
    icon: 'BookOpen',
    color: '#2563eb', // Blue
    descriptionJa: '漢字の読み方、表記、意味、文脈規定、類義語',
    descriptionBn: 'কাঞ্জি পড়ার নিয়ম, শব্দের অর্থ, বাক্যে সঠিক শব্দের প্রয়োগ ও সমার্থক শব্দ'
  },
  {
    id: 'conversation',
    nameJa: '会話・表現',
    nameEn: 'Conversation & Expression',
    nameBn: 'কথোপকথন ও ভাবপ্রকাশ',
    icon: 'MessageSquareText',
    color: '#059669', // Emerald
    descriptionJa: '日常場面での会話、状況に応じた適切な表現・文法',
    descriptionBn: 'দৈনন্দিন জীবনের বিভিন্ন পরিস্থিতি অনুযায়ী সঠিক কথোপকথন ও অভিব্যাক্তি'
  },
  {
    id: 'listening',
    nameJa: '聴解',
    nameEn: 'Listening Comprehension',
    nameBn: 'শ্রবণ দক্ষতা (লিসেনিং)',
    icon: 'Headphones',
    color: '#7c3aed', // Purple
    descriptionJa: '会話や指示、アナウンスを聞いて質問に答える',
    descriptionBn: 'জাপানি অডিও সংলাপ ও ঘোষণা শুনে প্রশ্নের সঠিক উত্তর বাছাই'
  },
  {
    id: 'reading',
    nameJa: '読解',
    nameEn: 'Reading Comprehension',
    nameBn: 'পাঠ দক্ষতা (রিডিং)',
    icon: 'FileText',
    color: '#ea580c', // Orange
    descriptionJa: '短いお知らせ、案内、メッセージ、メールなどを読んで理解する',
    descriptionBn: 'সংক্ষিপ্ত নোটিশ, নির্দেশনা, সাইনবোর্ড বা ইমেইল পড়ে অর্থ বোঝার দক্ষতা'
  }
];

export const getSectionMeta = (id: SectionId): SectionMeta => {
  return SECTIONS.find((s) => s.id === id) || SECTIONS[0];
};
