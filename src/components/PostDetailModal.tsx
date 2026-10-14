import React from 'react';
import { CarePost } from '../types';
import { X, Calendar, User, Clock, Share2, Check, ExternalLink, Sparkles } from 'lucide-react';
import { AdsterraAdBanner } from './AdsterraAdBanner';

interface PostDetailModalProps {
  post: CarePost | null;
  onClose: () => void;
  directLinkInArticle: string;
  adBannerCode?: string;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  onClose,
  directLinkInArticle,
  adBannerCode,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!post) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Split content intelligently to place Adsterra Ad naturally in the middle
  const paragraphs = post.content.split('\n\n');
  const midPoint = Math.max(1, Math.floor(paragraphs.length / 2));
  const firstHalf = paragraphs.slice(0, midPoint);
  const secondHalf = paragraphs.slice(midPoint);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[94vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header / Media */}
        <div className="relative">
          {post.imageUrl ? (
            <div className="h-52 sm:h-64 w-full overflow-hidden bg-teal-900">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-black/20 to-black/20" />
            </div>
          ) : (
            <div className="h-28 bg-gradient-to-r from-teal-800 to-pink-800 flex items-center justify-center px-6">
              <span className="text-white text-lg font-bold">Mother Care স্বাস্থ্য গাইড</span>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-sm transition-all"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge & Title over banner */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-pink-500 text-white text-[11px] font-bold tracking-wide uppercase mb-1.5">
              {post.category}
            </span>
            <h2 className="text-base sm:text-xl font-bold leading-snug drop-shadow-md">
              {post.title}
            </h2>
          </div>
        </div>

        {/* Metadata info */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium text-teal-800">
            <User className="w-3.5 h-3.5" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{post.publishedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime}</span>
          </div>

          <div className="ml-auto">
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-slate-600 hover:text-teal-800 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'কপি হয়েছে' : 'শেয়ার করুন'}</span>
            </button>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
          <p className="font-semibold text-teal-950 bg-teal-50/70 p-3.5 rounded-xl border border-teal-100">
            {post.excerpt}
          </p>

          {/* First Half of Article */}
          <div className="space-y-3 font-normal">
            {firstHalf.map((para, idx) => (
              <p key={idx} className="whitespace-pre-line leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Clean In-Article Adsterra Placement Slot */}
          <div className="my-6 py-2 border-y border-dashed border-slate-200">
            <AdsterraAdBanner
              directLink={directLinkInArticle}
              customScriptCode={adBannerCode}
              format="in-feed"
            />
          </div>

          {/* Second Half of Article */}
          <div className="space-y-3 font-normal">
            {secondHalf.map((para, idx) => (
              <p key={idx} className="whitespace-pre-line leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Bottom Native Recommendation Adsterra Link */}
          <div className="pt-4">
            <AdsterraAdBanner
              directLink={directLinkInArticle}
              customScriptCode={adBannerCode}
              format="horizontal"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="font-medium text-pink-600">Mother Care • একটি নতুন প্রাণের অপেক্ষায়</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
