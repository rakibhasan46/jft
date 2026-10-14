import React, { useState } from 'react';
import {
  Clock,
  Layers,
  X,
  Play,
  Settings,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { ExamConfig, Question, SectionId, AppLanguage } from '../types/exam';
import { SECTIONS } from '../data/sections';
import { MOCK_TESTS_METADATA, getQuestionsForMockTest } from '../data/mockTests';
import { getTranslation } from '../data/translations';

interface ExamSetupModalProps {
  questions: Question[];
  defaultConfig: ExamConfig;
  lang: AppLanguage;
  onStartExam: (config: {
    durationMinutes: number;
    selectedSections: SectionId[];
    customQuestions?: Question[];
  }) => void;
  onClose: () => void;
}

export const ExamSetupModal: React.FC<ExamSetupModalProps> = ({
  questions,
  defaultConfig,
  lang,
  onStartExam,
  onClose,
}) => {
  const t = getTranslation(lang);
  const [tab, setTab] = useState<'quick' | '20tests'>('20tests'); // default to the 20 mock tests selector
  const [durationMinutes, setDurationMinutes] = useState<number>(defaultConfig.durationMinutes || 60);
  const [selectedSections, setSelectedSections] = useState<SectionId[]>([
    'vocabulary',
    'conversation',
    'listening',
    'reading',
  ]);

  const toggleSection = (secId: SectionId) => {
    if (selectedSections.includes(secId)) {
      if (selectedSections.length === 1) return;
      setSelectedSections(selectedSections.filter((s) => s !== secId));
    } else {
      setSelectedSections([...selectedSections, secId]);
    }
  };

  const matchingQuestions = questions.filter((q) => selectedSections.includes(q.section));

  const durations = [
    { label: '৬০ মিনিট (অফিসিয়াল JFT স্ট্যান্ডার্ড)', value: 60 },
    { label: '৪৫ মিনিট (মাঝারি)', value: 45 },
    { label: '৩০ মিনিট (দ্রুত প্রস্তুতি)', value: 30 },
  ];

  const handleStartSpecificMockTest = (testId: string) => {
    const testQuestions = getQuestionsForMockTest(testId);
    onStartExam({
      durationMinutes: 60,
      selectedSections: ['vocabulary', 'conversation', 'listening', 'reading'],
      customQuestions: testQuestions,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 my-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">JFT-Basic মক টেস্ট নির্বাচন ও সেটআপ</h3>
              <p className="text-xs text-gray-500">২০টি পূর্ণাঙ্গ মক টেস্ট অথবা কাস্টম সেকশন সেটআপ করুন</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs: 20 Mock Tests vs Custom Setup */}
        <div className="px-6 pt-4 bg-slate-50 border-b border-gray-100 flex gap-2">
          <button
            onClick={() => setTab('20tests')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-all ${
              tab === '20tests'
                ? 'bg-white text-blue-700 border-t border-x border-gray-200 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📚 ২০টি পূর্ণাঙ্গ মক টেস্ট সেট (20 Mock Tests)
          </button>
          <button
            onClick={() => setTab('quick')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-all ${
              tab === 'quick'
                ? 'bg-white text-blue-700 border-t border-x border-gray-200 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ⚙️ কাস্টম পরীক্ষা ও সময় নির্ধারণ
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {tab === '20tests' ? (
            <div className="space-y-3">
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 text-xs text-blue-950">
                <p className="font-bold mb-1">যাচাইকৃত ও বৈচিত্র্যময় ২০টি মক টেস্ট:</p>
                <p className="text-blue-900 leading-relaxed">
                  প্রতিটি মক টেস্টে JFT-Basic A2 সিলেবাসের সমস্ত বিভাগ অন্তর্ভুক্ত রয়েছে। যেকোনো টেস্টে ক্লিক করে সরাসরি রিয়েল এক্সাম মোড শুরু করুন।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {MOCK_TESTS_METADATA.map((meta) => (
                  <div
                    key={meta.id}
                    onClick={() => handleStartSpecificMockTest(meta.id)}
                    className="p-4 rounded-2xl border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50/40 bg-white cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                          {meta.testNumber}
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm group-hover:text-blue-700 font-jp">
                          {meta.titleJa}
                        </h4>
                      </div>
                      <p className="text-[11px] text-gray-500 font-bn">
                        {meta.titleBn} • ৬০ মিনিট
                      </p>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-gray-500 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Time duration */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>পরীক্ষার সময়সীমা (Exam Duration)</span>
                </label>

                <div className="space-y-2">
                  {durations.map((d) => (
                    <label
                      key={d.value}
                      onClick={() => setDurationMinutes(d.value)}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all text-xs font-medium ${
                        durationMinutes === d.value
                          ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span>{d.label}</span>
                      <span className="font-mono font-bold text-blue-600">{d.value} মি.</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sections to include */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>অন্তর্ভুক্ত বিভাগসমূহ (Sections to Test)</span>
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {SECTIONS.map((sec) => {
                    const isChecked = selectedSections.includes(sec.id);
                    const count = questions.filter((q) => q.section === sec.id).length;

                    return (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => toggleSection(sec.id)}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          isChecked
                            ? 'border-emerald-500 bg-emerald-50/60 text-emerald-950'
                            : 'border-gray-200 opacity-60 text-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs font-jp">{sec.nameJa}</span>
                          <span className="text-[10px] font-semibold bg-white/80 px-1.5 py-0.5 rounded border">
                            {count}টি
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-600 block truncate">
                          {lang === 'ja' ? sec.nameEn : sec.nameBn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <p className="font-semibold mb-1">পরীক্ষার নির্দেশিকা:</p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
                  <li>টাইমার শেষ হলে পরীক্ষা স্বয়ংক্রিয়ভাবে জমা হবে।</li>
                  <li>নির্বাচিত প্রশ্ন সংখ্যা: <strong>{matchingQuestions.length}টি</strong>।</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50"
                >
                  {t.cancel}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onStartExam({
                      durationMinutes,
                      selectedSections,
                    })
                  }
                  disabled={matchingQuestions.length === 0}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{t.startExam}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
