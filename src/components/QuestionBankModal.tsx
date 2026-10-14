import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  RotateCcw,
  BookOpen,
  Volume2,
  CheckCircle2,
  X,
  FileQuestion,
  HelpCircle,
  Tag,
} from 'lucide-react';
import { Question, SectionId, AppLanguage, KanjiDetail } from '../types/exam';
import { SECTIONS, getSectionMeta } from '../data/sections';
import { getTranslation } from '../data/translations';

interface QuestionBankModalProps {
  questions: Question[];
  lang: AppLanguage;
  onSaveQuestions: (updatedQuestions: Question[]) => void;
  onResetDefault: () => void;
  onClose: () => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  questions,
  lang,
  onSaveQuestions,
  onResetDefault,
  onClose,
}) => {
  const t = getTranslation(lang);
  const [selectedFilterSection, setSelectedFilterSection] = useState<SectionId | 'all'>('all');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form State
  const [formSection, setFormSection] = useState<SectionId>('vocabulary');
  const [formSubCategory, setFormSubCategory] = useState('漢字の読み方');
  const [formTitle, setFormTitle] = useState('＿＿＿の ことばの よみかたとして いちばん いい ものを ひとつ えらんでください。');
  const [formPassage, setFormPassage] = useState('');
  const [formQuestion, setFormQuestion] = useState('');
  const [formUnderlinedWord, setFormUnderlinedWord] = useState('');
  const [formRubyText, setFormRubyText] = useState('');
  const [formOption1, setFormOption1] = useState('');
  const [formOption2, setFormOption2] = useState('');
  const [formOption3, setFormOption3] = useState('');
  const [formOption4, setFormOption4] = useState('');
  const [formCorrectIndex, setFormCorrectIndex] = useState(0);
  const [formAudioText, setFormAudioText] = useState('');
  const [formAudioUrl, setFormAudioUrl] = useState('');
  const [formMeaningBn, setFormMeaningBn] = useState('');
  const [formReasonBn, setFormReasonBn] = useState('');
  const [formDistractorReasonsBn, setFormDistractorReasonsBn] = useState('');
  const [formVocabNotesBn, setFormVocabNotesBn] = useState('');
  const [formGrammarNotesBn, setFormGrammarNotesBn] = useState('');
  // Kanji details inputs
  const [formKanjiChar, setFormKanjiChar] = useState('');
  const [formKanjiReading, setFormKanjiReading] = useState('');
  const [formKanjiOnyomi, setFormKanjiOnyomi] = useState('');
  const [formKanjiKunyomi, setFormKanjiKunyomi] = useState('');
  const [formKanjiMeaningBn, setFormKanjiMeaningBn] = useState('');

  const [formError, setFormError] = useState('');

  const filteredQuestions = selectedFilterSection === 'all'
    ? questions
    : questions.filter((q) => q.section === selectedFilterSection);

  const startCreate = () => {
    setIsCreatingNew(true);
    setEditingQuestion(null);
    setFormSection('vocabulary');
    setFormSubCategory('漢字の読み方');
    setFormTitle('＿＿＿の ことばの よみかたとして いちばん いい ものを ひとつ えらんでください。');
    setFormPassage('');
    setFormQuestion('');
    setFormUnderlinedWord('');
    setFormRubyText('');
    setFormOption1('');
    setFormOption2('');
    setFormOption3('');
    setFormOption4('');
    setFormCorrectIndex(0);
    setFormAudioText('');
    setFormAudioUrl('');
    setFormMeaningBn('');
    setFormReasonBn('');
    setFormDistractorReasonsBn('');
    setFormVocabNotesBn('');
    setFormGrammarNotesBn('');
    setFormKanjiChar('');
    setFormKanjiReading('');
    setFormKanjiOnyomi('');
    setFormKanjiKunyomi('');
    setFormKanjiMeaningBn('');
    setFormError('');
  };

  const startEdit = (q: Question) => {
    setIsCreatingNew(false);
    setEditingQuestion(q);
    setFormSection(q.section);
    setFormSubCategory(q.subCategory || '');
    setFormTitle(q.title);
    setFormPassage(q.passage || '');
    setFormQuestion(q.question);
    setFormUnderlinedWord(q.underlinedWord || '');
    setFormRubyText(q.rubyText || '');
    setFormOption1(q.options[0] || '');
    setFormOption2(q.options[1] || '');
    setFormOption3(q.options[2] || '');
    setFormOption4(q.options[3] || '');
    setFormCorrectIndex(q.correctAnswer);
    setFormAudioText(q.audioText || '');
    setFormAudioUrl(q.audioUrl || '');
    setFormMeaningBn(q.explanationBn.meaningBn);
    setFormReasonBn(q.explanationBn.correctReasonBn);
    setFormDistractorReasonsBn(
      q.explanationBn.distractorReasonsBn ? q.explanationBn.distractorReasonsBn.join('\n') : ''
    );
    setFormVocabNotesBn(
      q.explanationBn.vocabularyNotesBn ? q.explanationBn.vocabularyNotesBn.join('\n') : ''
    );
    setFormGrammarNotesBn(q.explanationBn.grammarNotesBn || '');

    if (q.kanjiDetails && q.kanjiDetails[0]) {
      const kd = q.kanjiDetails[0];
      setFormKanjiChar(kd.kanji);
      setFormKanjiReading(kd.readingHiragana);
      setFormKanjiOnyomi(kd.onyomi || '');
      setFormKanjiKunyomi(kd.kunyomi || '');
      setFormKanjiMeaningBn(kd.meaningBn);
    } else {
      setFormKanjiChar('');
      setFormKanjiReading('');
      setFormKanjiOnyomi('');
      setFormKanjiKunyomi('');
      setFormKanjiMeaningBn('');
    }
    setFormError('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি এই প্রশ্নটি মুছে ফেলতে চান?')) {
      const updated = questions.filter((q) => q.id !== id);
      onSaveQuestions(updated);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim() || !formOption1.trim() || !formOption2.trim()) {
      setFormError('দয়া করে প্রশ্ন এবং কমপক্ষে ২টি অপশন প্রদান করুন।');
      return;
    }
    if (!formMeaningBn.trim() || !formReasonBn.trim()) {
      setFormError('বাংলা অনুবাদ এবং সঠিক উত্তরের ব্যাখ্যা আবশ্যক।');
      return;
    }

    const options = [formOption1.trim(), formOption2.trim(), formOption3.trim(), formOption4.trim()].filter(Boolean);
    if (options.length < 2) {
      setFormError('কমপক্ষে ২টি অপশন থাকতে হবে।');
      return;
    }

    let kanjiDetails: KanjiDetail[] | undefined = undefined;
    if (formKanjiChar.trim()) {
      kanjiDetails = [
        {
          kanji: formKanjiChar.trim(),
          readingHiragana: formKanjiReading.trim() || formKanjiChar.trim(),
          onyomi: formKanjiOnyomi.trim() || undefined,
          kunyomi: formKanjiKunyomi.trim() || undefined,
          meaningBn: formKanjiMeaningBn.trim() || 'অর্থ দেওয়া হয়নি',
        },
      ];
    }

    const newQuestion: Question = {
      id: editingQuestion ? editingQuestion.id : `custom-${Date.now()}`,
      section: formSection,
      subCategory: formSubCategory.trim(),
      title: formTitle.trim(),
      passage: formPassage.trim() || undefined,
      question: formQuestion.trim(),
      underlinedWord: formUnderlinedWord.trim() || undefined,
      rubyText: formRubyText.trim() || undefined,
      options: options as [string, string, string, string],
      correctAnswer: Math.min(formCorrectIndex, options.length - 1),
      audioText: formAudioText.trim() || undefined,
      audioUrl: formAudioUrl.trim() || undefined,
      kanjiDetails,
      explanationBn: {
        meaningBn: formMeaningBn.trim(),
        correctReasonBn: formReasonBn.trim(),
        distractorReasonsBn: formDistractorReasonsBn
          ? formDistractorReasonsBn.split('\n').map((s) => s.trim()).filter(Boolean)
          : undefined,
        vocabularyNotesBn: formVocabNotesBn
          ? formVocabNotesBn.split('\n').map((s) => s.trim()).filter(Boolean)
          : undefined,
        grammarNotesBn: formGrammarNotesBn.trim() || undefined,
      },
      isCustom: true,
      createdAt: editingQuestion?.createdAt || Date.now(),
    };

    let updated: Question[];
    if (editingQuestion) {
      updated = questions.map((q) => (q.id === editingQuestion.id ? newQuestion : q));
    } else {
      updated = [newQuestion, ...questions];
    }

    onSaveQuestions(updated);
    setIsCreatingNew(false);
    setEditingQuestion(null);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(questions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `jft_questions_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onSaveQuestions(parsed);
          alert(`সফলভাবে ${parsed.length}টি প্রশ্ন ইমপোর্ট করা হয়েছে!`);
        } else {
          alert('অবৈধ JSON ফাইল ফরম্যাট।');
        }
      } catch (err) {
        alert('ফাইল পড়তে সমস্যা হয়েছে। সঠিক JSON দিন।');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 my-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <span>{t.questionBankTitle}</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              নমুনা প্রশ্ন দেখুন এবং নিজের নতুন কাঞ্জি, অডিও ও ব্যাখ্যাসহ প্রশ্ন যোগ করুন।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={startCreate}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addNewQuestion}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Bar */}
        {!isCreatingNew && !editingQuestion && (
          <div className="px-6 py-3 bg-slate-50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedFilterSection('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedFilterSection === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border text-gray-700 hover:bg-gray-100'
                }`}
              >
                সব বিভাগ ({questions.length})
              </button>
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setSelectedFilterSection(sec.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedFilterSection === sec.id
                      ? 'text-white'
                      : 'bg-white border text-gray-700 hover:bg-gray-100'
                  }`}
                  style={selectedFilterSection === sec.id ? { backgroundColor: sec.color } : {}}
                >
                  {sec.nameJa}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer font-medium">
                <Upload className="w-3.5 h-3.5" />
                <span>{t.importJson}</span>
                <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
              </label>

              <button
                onClick={handleExportJSON}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.exportJson}</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('সকল প্রশ্ন পূর্বনির্ধারিত ডিফল্ট নমুনা প্রশ্নে রিসেট করতে চান?')) {
                    onResetDefault();
                  }
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.resetDefault}</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isCreatingNew || editingQuestion ? (
            <form onSubmit={handleSaveForm} className="space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className="font-bold text-gray-900 text-base">
                  {editingQuestion ? t.editQuestion : t.addNewQuestion}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingQuestion(null);
                  }}
                  className="text-xs text-gray-500 hover:underline"
                >
                  {t.cancel}
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {formError}
                </div>
              )}

              {/* Section & SubCategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    বিভাগ (Section)
                  </label>
                  <select
                    value={formSection}
                    onChange={(e) => setFormSection(e.target.value as SectionId)}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                  >
                    {SECTIONS.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.nameJa} ({sec.nameBn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    উপ-বিভাগ (SubCategory)
                  </label>
                  <input
                    type="text"
                    value={formSubCategory}
                    onChange={(e) => setFormSubCategory(e.target.value)}
                    placeholder="যেমন: 漢字の読み方 / 職場会話"
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                  />
                </div>
              </div>

              {/* Instruction Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  নির্দেশনা (Instruction Title)
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 font-jp"
                />
              </div>

              {/* Passage */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  প্যাসেজ / সংলাপ (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  value={formPassage}
                  onChange={(e) => setFormPassage(e.target.value)}
                  placeholder="জাপানি অনুচ্ছেদ বা সংলাপ লিখুন..."
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 font-jp"
                />
              </div>

              {/* Target Question */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  মূল প্রশ্ন (Question Text) *
                </label>
                <input
                  type="text"
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="きのう、<u>新しい</u> じてんしゃを かいました。"
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 font-jp"
                  required
                />
              </div>

              {/* Underlined Word */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  আন্ডারলাইন বা নির্দিষ্ট শব্দ (Underlined Word)
                </label>
                <input
                  type="text"
                  value={formUnderlinedWord}
                  onChange={(e) => setFormUnderlinedWord(e.target.value)}
                  placeholder="যেমন: 新しい"
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 font-jp"
                />
              </div>

              {/* Kanji Details Section */}
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3">
                <div className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-700" />
                  <span>কাঞ্জি বিশ্লেষণ তথ্য (Kanji Learning Details)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">কাঞ্জি অক্ষর:</label>
                    <input
                      type="text"
                      value={formKanjiChar}
                      onChange={(e) => setFormKanjiChar(e.target.value)}
                      placeholder="যেমন: 新"
                      className="w-full text-xs p-2 rounded border border-blue-200 bg-white font-jp text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">হিরাগানা রিডিং:</label>
                    <input
                      type="text"
                      value={formKanjiReading}
                      onChange={(e) => setFormKanjiReading(e.target.value)}
                      placeholder="あたら・しい"
                      className="w-full text-xs p-2 rounded border border-blue-200 bg-white font-jp"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">বাংলা অর্থ:</label>
                    <input
                      type="text"
                      value={formKanjiMeaningBn}
                      onChange={(e) => setFormKanjiMeaningBn(e.target.value)}
                      placeholder="নতুন"
                      className="w-full text-xs p-2 rounded border border-blue-200 bg-white font-bn"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">音読み (Onyomi):</label>
                    <input
                      type="text"
                      value={formKanjiOnyomi}
                      onChange={(e) => setFormKanjiOnyomi(e.target.value)}
                      placeholder="シン (SHIN)"
                      className="w-full text-xs p-2 rounded border border-blue-200 bg-white font-jp"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">訓読み (Kunyomi):</label>
                    <input
                      type="text"
                      value={formKanjiKunyomi}
                      onChange={(e) => setFormKanjiKunyomi(e.target.value)}
                      placeholder="あたら-しい"
                      className="w-full text-xs p-2 rounded border border-blue-200 bg-white font-jp"
                    />
                  </div>
                </div>
              </div>

              {/* 4 Options */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  ৪টি অপশন ও সঠিক উত্তর নির্বাচন *
                </label>
                <div className="space-y-2">
                  {[
                    { val: formOption1, setVal: setFormOption1, idx: 0 },
                    { val: formOption2, setVal: setFormOption2, idx: 1 },
                    { val: formOption3, setVal: setFormOption3, idx: 2 },
                    { val: formOption4, setVal: setFormOption4, idx: 3 },
                  ].map((opt) => (
                    <div key={opt.idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswerRadio"
                        checked={formCorrectIndex === opt.idx}
                        onChange={() => setFormCorrectIndex(opt.idx)}
                        className="w-4 h-4 text-emerald-600"
                        title="সঠিক উত্তর হিসেবে সিলেক্ট করুন"
                      />
                      <span className="text-xs font-bold text-gray-500 w-5">{opt.idx + 1}.</span>
                      <input
                        type="text"
                        value={opt.val}
                        onChange={(e) => opt.setVal(e.target.value)}
                        placeholder={`অপশন ${opt.idx + 1}`}
                        className="flex-1 text-xs p-2 rounded-lg border border-gray-300 font-jp"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Audio text / URL */}
              <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 space-y-2">
                <div className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4" />
                  <span>লিসেনিং অডিও টেক্সট বা ফাইল লিংক</span>
                </div>
                <textarea
                  rows={2}
                  value={formAudioText}
                  onChange={(e) => setFormAudioText(e.target.value)}
                  placeholder="জাপানি অডিও সংলাপ লিখুন যা ব্রাউজারের স্পিচ ইঞ্জিন পড়বে..."
                  className="w-full text-xs p-2 rounded-lg border border-purple-200 bg-white font-jp"
                />
              </div>

              {/* Bengali Explanations */}
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2.5">
                <div className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>বাংলা ব্যাখ্যা ও বিশ্লেষণ</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-0.5">বাংলা অর্থ *</label>
                  <input
                    type="text"
                    value={formMeaningBn}
                    onChange={(e) => setFormMeaningBn(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-amber-200 bg-white font-bn"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-0.5">সঠিক উত্তরের কারণ *</label>
                  <textarea
                    rows={2}
                    value={formReasonBn}
                    onChange={(e) => setFormReasonBn(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-amber-200 bg-white font-bn"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-0.5">অন্যান্য অপশন কেন ভুল (প্রতি লাইনে ১টি):</label>
                  <textarea
                    rows={2}
                    value={formDistractorReasonsBn}
                    onChange={(e) => setFormDistractorReasonsBn(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-amber-200 bg-white font-bn"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingQuestion(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
                >
                  {t.saveQuestion}
                </button>
              </div>
            </form>
          ) : (
            /* Questions List */
            <div className="space-y-3">
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FileQuestion className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>এই বিভাগে কোনো প্রশ্ন পাওয়া যায়নি।</p>
                </div>
              ) : (
                filteredQuestions.map((q) => {
                  const meta = getSectionMeta(q.section);
                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl border border-gray-200 hover:border-gray-300 bg-white transition-all flex flex-wrap items-start justify-between gap-3"
                    >
                      <div className="flex-1 min-w-[280px]">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold text-white"
                            style={{ backgroundColor: meta.color }}
                          >
                            {meta.nameJa}
                          </span>
                          <span className="text-xs font-medium text-gray-500">
                            {q.subCategory}
                          </span>
                          {/* Differentiate sample vs user custom */}
                          {q.isCustom ? (
                            <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                              {t.customQuestionBadge}
                            </span>
                          ) : (
                            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                              {t.sampleQuestionBadge}
                            </span>
                          )}
                        </div>

                        <p className="font-jp text-sm text-gray-900 font-semibold mb-1">
                          {q.question}
                        </p>
                        <p className="text-xs font-bn text-gray-600 line-clamp-1">
                          {q.explanationBn.meaningBn}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-2 text-[11px] text-gray-500">
                          <span>সঠিক উত্তর: <strong>{q.options[q.correctAnswer]}</strong></span>
                          <span>•</span>
                          <span>কাঞ্জি: <strong>{q.kanjiDetails?.[0]?.kanji || '—'}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => startEdit(q)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="সম্পাদনা করুন"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
