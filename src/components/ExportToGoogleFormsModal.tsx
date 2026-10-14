import React, { useState, useEffect } from 'react';
import {
  Share2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  FileSpreadsheet,
  LogIn,
} from 'lucide-react';
import { Question } from '../types/exam';
import { initAuth, googleSignIn, getAccessToken, logout } from '../services/googleAuth';
import { createGoogleFormFromExam, FormCreationResult } from '../services/googleForms';
import { User } from 'firebase/auth';

interface ExportToGoogleFormsModalProps {
  questions: Question[];
  onClose: () => void;
}

export const ExportToGoogleFormsModal: React.FC<ExportToGoogleFormsModalProps> = ({
  questions,
  onClose,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [formTitle, setFormTitle] = useState<string>(
    `JFT-Basic A2 Mock Test (${new Date().toLocaleDateString('en-GB')})`
  );
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createdForm, setCreatedForm] = useState<FormCreationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setHasToken(Boolean(token));
      },
      () => {
        setCurrentUser(null);
        setHasToken(false);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMessage('');
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setHasToken(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google সাইন-ইন ব্যর্থ হয়েছে।');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleExport = async () => {
    if (!formTitle.trim()) {
      setErrorMessage('দয়া করে ফর্মের একটি নাম দিন।');
      return;
    }

    setIsCreating(true);
    setErrorMessage('');

    try {
      const result = await createGoogleFormFromExam(formTitle.trim(), questions);
      setCreatedForm(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google Form তৈরি করতে সমস্যা হয়েছে।');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-700">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Google Forms-এ এক্সপোর্ট</h3>
              <p className="text-xs text-gray-500">আপনার প্রশ্নগুলো নিয়ে স্বয়ংক্রিয় Google Form কুইজ তৈরি করুন</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* State 1: Success Screen */}
        {createdForm ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-900">Google Form সফলভাবে তৈরি হয়েছে!</h4>
              <p className="text-xs text-gray-600 mt-1">
                আপনার Google একাউন্টে {questions.length}টি প্রশ্ন ও বহুনির্বাচনী অপশন দিয়ে ফর্মটি প্রস্তুত করা হয়েছে।
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-left text-gray-700 space-y-1">
              <div><strong>ফর্মের নাম:</strong> {createdForm.title}</div>
              <div><strong>প্রশ্ন সংখ্যা:</strong> {questions.length}টি</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <a
                href={createdForm.editUri}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <span>Google Forms-এ খুলুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={createdForm.responderUri}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <span>পরীক্ষার্থী লিংক দেখুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <button
              onClick={onClose}
              className="mt-3 text-xs text-gray-500 hover:text-gray-800 underline block mx-auto"
            >
              বন্ধ করুন
            </button>
          </div>
        ) : !hasToken ? (
          /* State 2: Needs Authentication */
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-bold text-gray-900">Google একাউন্ট সংযোগ প্রয়োজন</h4>
              <p className="text-xs text-gray-600 max-w-sm mx-auto mt-1">
                আপনার অনুমতি সাপেক্ষে সরাসরি আপনার Google Drive-এ Google Form তৈরি করার জন্য সাইন ইন করুন।
              </p>
            </div>

            {/* Official Google Sign-In button per guidelines */}
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-gray-300 rounded-xl shadow-xs hover:bg-gray-50 active:scale-95 transition-all text-xs font-semibold text-gray-700 disabled:opacity-50"
              >
                {isSigningIn ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                )}
                <span>Sign in with Google</span>
              </button>
            </div>
          </div>
        ) : (
          /* State 3: Authenticated -> Confirmation & Form Customization */
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-gray-600">সংযুক্ত একাউন্ট:</span>
              <span className="font-semibold text-gray-900 truncate max-w-[200px]">
                {currentUser?.email || 'Google User'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Google Form এর শিরোনাম (Title)
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>

            {/* Mandatory User Confirmation Dialog per skill rules */}
            <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl text-xs space-y-1.5">
              <div className="font-bold text-purple-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-700" />
                <span>অনুমোদন ও নিশ্চিতকরণ:</span>
              </div>
              <p className="text-purple-950 leading-relaxed">
                আপনার অনুমতি সাপেক্ষে আপনার Google Drive-এ এই টেস্টের মোট{' '}
                <strong>{questions.length}টি প্রশ্ন</strong>, উত্তর এবং ব্যাখ্যা দিয়ে একটি নতুন Google Form
                ফাইল তৈরি করা হবে।
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleExport}
                disabled={isCreating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>ফর্ম তৈরি হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Google Form তৈরি করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
