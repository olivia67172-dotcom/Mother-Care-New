import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

interface AdsterraAdBannerProps {
  directLink?: string;
  customScriptCode?: string;
  format?: 'rectangle' | 'horizontal' | 'in-feed';
  className?: string;
}

const DEFAULT_BANNER_SCRIPT = `<script type="text/javascript">
  atOptions = {
    'key' : '980f46cb706ebcd740813898cc9bb6eb',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
</script>
<script type="text/javascript" src="https://www.highrevenueformat.com/980f46cb706ebcd740813898cc9bb6eb/invoke.js"></script>`;

export const AdsterraAdBanner: React.FC<AdsterraAdBannerProps> = ({
  directLink,
  customScriptCode,
  format = 'rectangle',
  className = '',
}) => {
  const targetUrl = directLink || 'https://www.profitableratecpmnetwork.com/e3tcw9g36x?key=dfc6bcc7ea509678ea00c4d311c6659f';
  const scriptToUse = (customScriptCode && customScriptCode.trim().length > 0) ? customScriptCode : DEFAULT_BANNER_SCRIPT;

  // 1. Dedicated 300x250 Iframe Banner format
  if (format === 'rectangle') {
    return (
      <div className={`my-4 flex flex-col items-center justify-center select-none ${className}`}>
        <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400 uppercase tracking-widest">
          <Sparkles className="w-3 h-3 text-pink-500" />
          <span>স্পন্সরড বিজ্ঞাপন (Adsterra)</span>
        </div>
        <div className="w-[300px] h-[250px] overflow-hidden rounded-xl border border-pink-200/90 bg-white shadow-sm flex items-center justify-center relative">
          <iframe
            srcDoc={`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: #fff; overflow: hidden; width: 300px; height: 250px; }
  </style>
</head>
<body>
  ${scriptToUse}
</body>
</html>`}
            width="300"
            height="250"
            style={{ border: 'none', overflow: 'hidden', width: '300px', height: '250px' }}
            title="Adsterra 300x250 Banner"
            scrolling="no"
          />
        </div>
      </div>
    );
  }

  // 2. High-Intent Horizontal Banner (using native <a> tag to prevent popup blockers)
  if (format === 'horizontal') {
    return (
      <div className={`my-4 flex flex-col items-center justify-center select-none ${className}`}>
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-3xl bg-gradient-to-r from-teal-900 via-teal-800 to-pink-900 text-white rounded-xl p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-3 border border-pink-500/30 group active:scale-[0.99]"
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
      </div>
    );
  }

  // 3. In-Feed Banner (Native <a> tag)
  return (
    <div className={`my-4 flex flex-col items-center justify-center select-none ${className}`}>
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-gradient-to-r from-pink-50/60 to-white rounded-xl p-4 border border-pink-200 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-3 group active:scale-[0.99]"
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
        <span className="px-4 py-2 bg-pink-600 group-hover:bg-pink-700 text-white text-xs font-bold rounded-lg whitespace-nowrap flex items-center gap-1.5 shrink-0 transition-transform group-hover:scale-105 shadow-xs">
          <span>ক্লিক করুন</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </span>
      </a>
    </div>
  );
};
