import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';

interface ProblemSubmissionBoxProps {
  directLinkProblemBox: string;
}

export const ProblemSubmissionBox: React.FC<ProblemSubmissionBoxProps> = ({ directLinkProblemBox }) => {
  const [problemText, setProblemText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const targetUrl = directLinkProblemBox || 'https://www.profitableratecpmnetwork.com/upgv4b5fqp?key=d6c43d6c5c650945b870eaae68109c39';

  const handleSaveAndRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemText.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার সমস্যা বা প্রশ্নটি লিখুন!');
      return;
    }
    setErrorMessage('');
    setIsSubmitted(true);

    // Open direct link safely in a new tab without popup blocker restriction
    try {
      const link = document.createElement('a');
      link.href = targetUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-3 sm:px-4 my-3 sm:my-4">
      <div className="bg-gradient-to-r from-white via-pink-50/50 to-white rounded-xl p-3.5 sm:p-4 border border-pink-200/90 shadow-xs">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-pink-600 shrink-0" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              আপনার সমস্যা এখানে লিখুন, সঠিক পরামর্শ পাবেন
            </h2>
          </div>
          <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full shrink-0">
            গোপনীয় ও নিরাপদ
          </span>
        </div>

        {/* Compact Form */}
        <form onSubmit={handleSaveAndRedirect} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            required
            value={problemText}
            onChange={(e) => {
              setProblemText(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="মাসিক, কনসিভ বা সহবাসের সমস্যা লিখুন..."
            className="flex-1 px-3 py-2 text-xs text-slate-800 bg-white border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-inner placeholder:text-slate-400"
          />

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-teal-800 to-pink-600 hover:from-teal-900 hover:to-pink-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 active:scale-95 shrink-0 whitespace-nowrap cursor-pointer"
          >
            {isSubmitted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>সংরক্ষিত হয়েছে!</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-pink-200" />
                <span>সেভ করুন</span>
              </>
            )}
          </button>
        </form>

        {errorMessage && (
          <p className="text-[11px] text-rose-600 mt-1.5 font-medium">{errorMessage}</p>
        )}

        {/* Instant access banner upon submission (guarantees click works even if popup blocker was active) */}
        {isSubmitted && (
          <div className="mt-2.5 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between gap-2 animate-fadeIn">
            <span className="text-xs text-emerald-800 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              আপনার সমস্যাটি সেভ করা হয়েছে!
            </span>
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded flex items-center gap-1 shrink-0"
            >
              <span>পরামর্শ দেখুন</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};
