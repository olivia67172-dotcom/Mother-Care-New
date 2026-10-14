import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles } from 'lucide-react';

interface ProblemSubmissionBoxProps {
  directLinkProblemBox: string;
}

export const ProblemSubmissionBox: React.FC<ProblemSubmissionBoxProps> = ({ directLinkProblemBox }) => {
  const [problemText, setProblemText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSaveAndRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemText.trim()) {
      alert('অনুগ্রহ করে আপনার সমস্যা বা প্রশ্নটি লিখুন!');
      return;
    }

    setIsSubmitted(true);

    const targetUrl = directLinkProblemBox || 'https://www.highcpmgate.com';

    try {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = targetUrl;
    }

    setTimeout(() => {
      setIsSubmitted(false);
      setProblemText('');
    }, 2500);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-3 sm:px-4 my-3 sm:my-4">
      <div className="bg-gradient-to-r from-white via-pink-50/40 to-white rounded-xl p-3 sm:p-4 border border-pink-200/90 shadow-xs">
        
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
            onChange={(e) => setProblemText(e.target.value)}
            placeholder="মাসিক, কনসিভ বা সহবাসের সমস্যা লিখুন..."
            className="flex-1 px-3 py-2 text-xs text-slate-800 bg-white border border-pink-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-inner placeholder:text-slate-400"
          />

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-teal-800 to-pink-600 hover:from-teal-900 hover:to-pink-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 active:scale-95 shrink-0 whitespace-nowrap"
          >
            {isSubmitted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>লোড হচ্ছে...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-pink-200" />
                <span>সেভ করুন</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};
