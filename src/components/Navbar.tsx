import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Trophy,
  Sparkles,
  BarChart2,
  Clock,
  LogOut,
  Globe,
  Layers,
} from 'lucide-react';
import { initAuth, googleSignIn, logout } from '../services/googleAuth';
import { AppLanguage } from '../types/exam';
import { getTranslation } from '../data/translations';
import { User } from 'firebase/auth';

interface NavbarProps {
  activeView: 'home' | 'cbt-exam' | 'practice' | 'kanji-deck' | 'results' | 'history';
  lang: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onNavigate: (view: 'home' | 'practice' | 'kanji-deck' | 'history') => void;
  onOpenQuestionBank: () => void;
  onStartExamClick: () => void;
  hasActiveSession: boolean;
  onResumeActiveSession: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  lang,
  onLanguageChange,
  onNavigate,
  onOpenQuestionBank,
  onStartExamClick,
  hasActiveSession,
  onResumeActiveSession,
}) => {
  const t = getTranslation(lang);
  const [user, setUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth((currentUser) => {
      setUser(currentUser);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const res = await googleSignIn();
      if (res) setUser(res.user);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo / Brand */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <span className="font-jp font-black text-lg">日</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-gray-900 tracking-tight">
                  JFT-Basic <span className="text-blue-600">CBT</span>
                </span>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                  A2
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-xl transition-colors ${
                activeView === 'home'
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {t.navDashboard}
            </button>

            <button
              onClick={onStartExamClick}
              className="px-3 py-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              {t.navMockExam}
            </button>

            <button
              onClick={() => onNavigate('practice')}
              className={`px-3 py-2 rounded-xl transition-colors ${
                activeView === 'practice'
                  ? 'bg-emerald-50 text-emerald-700 font-bold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {t.navPractice}
            </button>

            <button
              onClick={() => onNavigate('kanji-deck')}
              className={`px-3 py-2 rounded-xl transition-colors ${
                activeView === 'kanji-deck'
                  ? 'bg-amber-50 text-amber-700 font-bold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {t.navKanjiDeck}
            </button>

            <button
              onClick={onOpenQuestionBank}
              className="px-3 py-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              {t.navQuestionBank}
            </button>

            <button
              onClick={() => onNavigate('history')}
              className={`px-3 py-2 rounded-xl transition-colors ${
                activeView === 'history'
                  ? 'bg-purple-50 text-purple-700 font-bold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {t.navHistory}
            </button>
          </div>

          {/* Right Controls: Language Selector, Resume Exam, Google */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onLanguageChange('bn')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  lang === 'bn'
                    ? 'bg-white text-blue-700 shadow-2xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="বাংলা ইন্টারফেস"
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('ja')}
                className={`px-2.5 py-1 rounded-lg transition-all font-jp ${
                  lang === 'ja'
                    ? 'bg-white text-blue-700 shadow-2xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="日本語インターフェース"
              >
                日本語
              </button>
            </div>

            {/* Resume in-progress exam */}
            {hasActiveSession && activeView !== 'cbt-exam' && (
              <button
                onClick={onResumeActiveSession}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold animate-pulse shadow-xs"
              >
                <Clock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.resumeActiveExam}</span>
              </button>
            )}

            {/* Google Account Profile / Sign-In */}
            {user ? (
              <div className="flex items-center gap-1.5 pl-2 border-l border-gray-200">
                <div
                  className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 overflow-hidden"
                  title={user.email || ''}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user.email?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-gray-100 transition-colors"
                  title="সাইন আউট"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
                title="Google Forms এক্সপোর্ট সংযোগ"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span className="hidden sm:inline">Forms</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
