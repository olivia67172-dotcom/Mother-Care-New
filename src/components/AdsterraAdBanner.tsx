import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

interface AdsterraAdBannerProps {
  directLink: string;
  customScriptCode?: string;
  format?: 'rectangle' | 'horizontal' | 'in-feed' | 'sticky-bottom';
  className?: string;
}

export const AdsterraAdBanner: React.FC<AdsterraAdBannerProps> = ({
  directLink,
  customScriptCode,
  format = 'rectangle',
  className = '',
}) => {
  if (customScriptCode && customScriptCode.trim().length > 0) {
    return (
      <div className={`my-4 flex flex-col items-center justify-center overflow-hidden ${className}`}>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 select-none">
          স্পন্সরড
        </span>
        <div 
          className="w-full flex items-center justify-center overflow-hidden rounded-xl border border-slate-200/60 bg-white p-2 min-h-[90px]"
          dangerouslySetInnerHTML={{ __html: customScriptCode }}
        />
      </div>
    );
  }

  const targetUrl = directLink || 'https://www.highcpmgate.com';

  return (
    <div className={`my-4 flex flex-col items-center justify-center select-none ${className}`}>
      {format === 'horizontal' ? (
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-3xl bg-gradient-to-r from-teal-900 via-teal-800 to-pink-900 text-white rounded-xl p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-3 border border-pink-500/30 group"
        >
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white group-hover:text-pink-200 transition-colors">
                এই একটি পদ্ধতি মানলে বেবি কনসিভ হবেই
              </p>
              <p className="text-[11px] text-pink-100/80">
                বিশেষজ্ঞের দেওয়া নিশ্চিত গর্ভধারণের সেরা গোপন টিপস দেখতে ক্লিক করুন
              </p>
            </div>
          </div>
          <span className="px-4 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-transform group-hover:scale-105 shrink-0 shadow-sm">
            <span>ক্লিক করুন</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </a>
      ) : format === 'in-feed' ? (
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-gradient-to-r from-pink-50/60 to-white rounded-xl p-4 border border-pink-200 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-3 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-pink-700 transition-colors">
                এই একটি পদ্ধতি মানলে বেবি কনসিভ হবেই
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                চিকিৎসকদের অনুমোদিত সঠিক ডিম্বস্ফোটন ও ফার্টিলিটি গাইড দেখতে ক্লিক করুন
              </p>
            </div>
          </div>
          <span className="px-4 py-2 bg-pink-600 group-hover:bg-pink-700 text-white text-xs font-bold rounded-lg whitespace-nowrap flex items-center gap-1.5 shrink-0 transition-transform group-hover:scale-105">
            <span>ক্লিক করুন</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </a>
      ) : (
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-sm bg-white rounded-xl p-4 border border-pink-200 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group"
        >
          <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mb-2">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-pink-700 transition-colors mb-1">
            এই একটি পদ্ধতি মানলে বেবি কনসিভ হবেই
          </p>
          <p className="text-[11px] text-slate-500 mb-3">
            সহজ ও কার্যকরী বৈজ্ঞানিক নিয়মাবলী এখনই জানুন
          </p>
          <span className="w-full py-2 bg-pink-600 group-hover:bg-pink-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors">
            <span>ক্লিক করুন</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </a>
      )}
    </div>
  );
};
