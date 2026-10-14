import React from 'react';
import { Flag, CheckCircle2, Circle, Eye } from 'lucide-react';
import { Question, SectionId } from '../types/exam';
import { getSectionMeta } from '../data/sections';

interface QuestionPaletteProps {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, number>;
  flagged: Record<string, boolean>;
  onSelectQuestion: (index: number) => void;
  isCompact?: boolean;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  questions,
  currentQuestionIndex,
  answers,
  flagged,
  onSelectQuestion,
  isCompact = false,
}) => {
  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length;
  const flaggedCount = questions.filter((q) => flagged[q.id]).length;
  const unansweredCount = questions.length - answeredCount;

  // Group questions by section
  const sectionGroups: { sectionId: SectionId; questions: { question: Question; globalIndex: number }[] }[] = [];
  questions.forEach((q, idx) => {
    let group = sectionGroups.find((g) => g.sectionId === q.section);
    if (!group) {
      group = { sectionId: q.section, questions: [] };
      sectionGroups.push(group);
    }
    group.questions.push({ question: q, globalIndex: idx });
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
      {/* Header and stats */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-blue-600" />
            <span>প্রশ্ন প্যালেট (Question Grid)</span>
          </h3>
          <span className="text-xs text-gray-700 font-semibold">
            {answeredCount}/{questions.length} সমাপ্ত
          </span>
        </div>

        {/* Status Legend */}
        <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1.5 text-emerald-800">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
            <span>উত্তর দেওয়া ({answeredCount})</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-700">
            <div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-400 shrink-0" />
            <span>বাকি থাকা ({unansweredCount})</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-800">
            <div className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
            <span>পর্যালোচনা / ফ্ল্যাগ ({flaggedCount})</span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-800">
            <div className="w-3 h-3 rounded-full border-2 border-blue-600 bg-blue-50 shrink-0" />
            <span>বর্তমান প্রশ্ন</span>
          </div>
        </div>
      </div>

      {/* Questions list grouped by section */}
      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
        {sectionGroups.map((group) => {
          const meta = getSectionMeta(group.sectionId);
          return (
            <div key={group.sectionId} className="border-t border-gray-100 pt-3 first:border-0 first:pt-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-800 truncate" title={meta.nameJa}>
                  {meta.nameJa} ({meta.nameBn})
                </span>
                <span className="text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                  {group.questions.length}টি
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {group.questions.map(({ question, globalIndex }) => {
                  const isCurrent = globalIndex === currentQuestionIndex;
                  const isAnswered = answers[question.id] !== undefined;
                  const isFlagged = Boolean(flagged[question.id]);

                  // Color logic
                  let bgClass = 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
                  if (isAnswered) {
                    bgClass = 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600 font-semibold';
                  }
                  if (isFlagged) {
                    bgClass = isAnswered
                      ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600 font-semibold'
                      : 'bg-amber-100 text-amber-900 border-amber-400 hover:bg-amber-200 font-semibold';
                  }
                  if (isCurrent) {
                    bgClass += ' ring-2 ring-blue-600 ring-offset-1 font-bold';
                  }

                  return (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => onSelectQuestion(globalIndex)}
                      className={`relative flex items-center justify-center h-8 rounded-lg text-xs border transition-all ${bgClass}`}
                      title={`প্রশ্ন ${globalIndex + 1}: ${meta.nameJa}`}
                    >
                      <span>{globalIndex + 1}</span>
                      {isFlagged && (
                        <Flag className="w-2.5 h-2.5 absolute top-0.5 right-0.5 fill-current" />
                      )}
                    </button>
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
