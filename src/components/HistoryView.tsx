import React from 'react';
import {
  Trophy,
  Calendar,
  Clock,
  ArrowRight,
  Trash2,
  BarChart2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { ExamResult, AppLanguage } from '../types/exam';
import { SECTIONS } from '../data/sections';
import { getTranslation } from '../data/translations';

interface HistoryViewProps {
  history: ExamResult[];
  lang: AppLanguage;
  onSelectResultToReview: (result: ExamResult) => void;
  onClearHistory: () => void;
  onExit: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  lang,
  onSelectResultToReview,
  onClearHistory,
  onExit,
}) => {
  const t = getTranslation(lang);

  if (history.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="p-10 bg-white rounded-3xl border border-gray-200 shadow-xs">
          <BarChart2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">কোনো পরীক্ষার ইতিহাস নেই</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            আপনি এখনও কোনো মক টেস্ট পরীক্ষা সম্পন্ন করেননি। পরীক্ষা শুরু করে নিজের জাপানি দক্ষতার অগ্রগতি পরীক্ষা করুন।
          </p>
          <button
            onClick={onExit}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition-colors"
          >
            {t.startExam}
          </button>
        </div>
      </div>
    );
  }

  const passedTests = history.filter((h) => h.isPassed).length;
  const averagePercentage = Math.round(
    history.reduce((acc, h) => acc + h.percentage, 0) / history.length
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header and Quick Stats */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart2 className="w-7 h-7 text-blue-600" />
              <span>{t.navHistory}</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              আপনার দেওয়া পূর্ববর্তী সকল মক টেস্টের পূর্ণাঙ্গ স্কোর ও উত্তরপত্র সংরক্ষিত রয়েছে।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm('আপনি কি সকল পরীক্ষার ইতিহাস মুছে ফেলতে চান?')) {
                  onClearHistory();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ইতিহাস মুছুন</span>
            </button>
            <button
              onClick={onExit}
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors"
            >
              {t.backToHome}
            </button>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
            <span className="text-xs text-blue-700 font-medium block">মোট পরীক্ষা</span>
            <div className="text-2xl font-extrabold text-blue-900 mt-1 font-mono">{history.length}টি</div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-xs text-emerald-700 font-medium block">পাস করেছেন</span>
            <div className="text-2xl font-extrabold text-emerald-900 mt-1 font-mono">{passedTests}টি</div>
          </div>
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
            <span className="text-xs text-purple-700 font-medium block">গড় স্কোর হার</span>
            <div className="text-2xl font-extrabold text-purple-900 mt-1 font-mono">{averagePercentage}%</div>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <span className="text-xs text-amber-700 font-medium block">সর্বোচ্চ স্কোর</span>
            <div className="text-2xl font-extrabold text-amber-900 mt-1 font-mono">
              {Math.max(...history.map((h) => h.totalScore))} / 250
            </div>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {history.map((item, idx) => {
          const dateStr = new Date(item.completedAt).toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'bn-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
          const mins = Math.floor(item.timeSpentSeconds / 60);
          const secs = item.timeSpentSeconds % 60;

          return (
            <div
              key={item.id || idx}
              className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs hover:border-blue-300 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl ${
                      item.isPassed ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 bg-slate-50'
                    }`}
                  >
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">
                        {item.mode === 'practice' ? t.practiceMode : 'JFT-Basic মক টেস্ট'}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          item.isPassed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.isPassed ? '合格 (Passed)' : '不合格 (Failed)'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{dateStr}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xl font-black text-gray-900 font-mono">
                      {item.totalScore}{' '}
                      <span className="text-xs font-normal text-gray-500">/ {item.maxScore}</span>
                    </div>
                    <span className="text-xs text-gray-500 flex items-center gap-1 justify-end font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{mins} মি {secs} সে</span>
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectResultToReview(item)}
                    className="flex items-center gap-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl text-xs transition-colors"
                  >
                    <span>উত্তরপত্র ও ব্যাখ্যা</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Mini Section Scores */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
                {SECTIONS.map((sec) => {
                  const s = item.sectionScores?.[sec.id] || { correctCount: 0, totalQuestions: 0, percentage: 0 };
                  return (
                    <div key={sec.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <div className="flex justify-between font-medium text-gray-700 mb-1">
                        <span className="font-jp">{sec.nameJa}</span>
                        <span className="font-mono">{s.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${s.percentage}%`, backgroundColor: sec.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
