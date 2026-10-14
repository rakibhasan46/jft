import React from 'react';
import { X, BookOpen, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { KanjiDetail, AppLanguage } from '../types/exam';
import { getTranslation } from '../data/translations';
import { audioPlayer } from '../services/audioPlayer';

interface KanjiInspectorModalProps {
  kanjiDetail: KanjiDetail | null;
  lang: AppLanguage;
  onClose: () => void;
}

export const KanjiInspectorModal: React.FC<KanjiInspectorModalProps> = ({
  kanjiDetail,
  lang,
  onClose,
}) => {
  if (!kanjiDetail) return null;
  const t = getTranslation(lang);

  const handleSpeak = (text: string) => {
    audioPlayer.play(text, { rate: 0.9 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">{t.kanjiInspector}</h3>
              <p className="text-xs text-gray-500">JFT-Basic A2 কাঞ্জি বিশ্লেষণ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Kanji Banner */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-6 mb-6 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-6xl sm:text-7xl font-jp font-black text-white select-all">
              {kanjiDetail.kanji}
            </div>
            <div className="mt-2 text-sm text-blue-200 font-jp flex items-center gap-2">
              <span>উচ্চারণ: <strong>{kanjiDetail.readingHiragana}</strong></span>
              <button
                type="button"
                onClick={() => handleSpeak(kanjiDetail.readingHiragana)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors text-white"
                title="শুনুন"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-400/20">
              {kanjiDetail.strokeCount ? `${kanjiDetail.strokeCount} Strokes` : 'A2 কাঞ্জি'}
            </span>
            <div className="text-lg font-bold text-amber-300 font-bn">
              {kanjiDetail.meaningBn}
            </div>
          </div>
        </div>

        {/* Readings (Onyomi / Kunyomi) */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
              {t.onyomi}
            </span>
            <span className="text-sm font-jp font-bold text-gray-900">
              {kanjiDetail.onyomi || '—'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
              {t.kunyomi}
            </span>
            <span className="text-sm font-jp font-bold text-gray-900">
              {kanjiDetail.kunyomi || '—'}
            </span>
          </div>
        </div>

        {/* Compounds & Example Words */}
        {kanjiDetail.compounds && kanjiDetail.compounds.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.compoundWords}</span>
            </h4>

            <div className="space-y-2">
              {kanjiDetail.compounds.map((comp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/50 border border-blue-100 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSpeak(comp.word)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="উচ্চারণ শুনুন"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold font-jp text-sm text-gray-900">{comp.word}</span>
                    <span className="text-gray-500 font-jp">（{comp.reading}）</span>
                  </div>
                  <span className="font-medium font-bn text-gray-700">{comp.meaningBn}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Example Sentence */}
        {kanjiDetail.sentenceExample && (
          <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 text-xs">
            <span className="font-bold text-amber-900 block mb-1">বাক্যে ব্যবহারের উদাহরণ:</span>
            <p className="font-jp text-gray-900 font-medium mb-0.5">
              {kanjiDetail.sentenceExample.sentence}
            </p>
            <p className="font-jp text-gray-500 text-[11px] mb-1">
              {kanjiDetail.sentenceExample.reading}
            </p>
            <p className="font-bn text-gray-800 font-medium">
              বাংলা: {kanjiDetail.sentenceExample.meaningBn}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
