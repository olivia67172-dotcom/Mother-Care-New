/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { CarePost, SiteSettings } from './types';
import { 
  getStoredPosts, 
  saveStoredPosts, 
  getStoredSettings, 
  saveStoredSettings 
} from './utils/storage';
import { MotherCareLogo } from './components/MotherCareLogo';
import { PasscodeModal } from './components/PasscodeModal';
import { AdminPanel } from './components/AdminPanel';
import { PostDetailModal } from './components/PostDetailModal';
import { ProblemSubmissionBox } from './components/ProblemSubmissionBox';
import { AdsterraAdBanner } from './components/AdsterraAdBanner';
import { AdsterraSocialBar } from './components/AdsterraSocialBar';
import { 
  Heart, 
  Search, 
  ChevronRight, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  Flame, 
  ListOrdered, 
  X, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

const CONTENT_CATEGORIES = ['মাসিক নিয়ে কথা', 'বেবি কনসিভ', 'সহবাস ও পজিশন'] as const;

export default function App() {
  // State
  const [posts, setPosts] = useState<CarePost[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(getStoredSettings());

  // Category selection (null by default so titles only show when clicked!)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isPasscodeOpen, setIsPasscodeOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CarePost | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    setPosts(getStoredPosts());
    setSettings(getStoredSettings());
  }, []);

  const handleSavePosts = (updatedPosts: CarePost[]) => {
    setPosts(updatedPosts);
    saveStoredPosts(updatedPosts);
  };

  const handleSaveSettings = (updatedSettings: SiteSettings) => {
    setSettings(updatedSettings);
    saveStoredSettings(updatedSettings);
  };

  // Secret 6-tap Logo trigger (hidden from visitors)
  const handleLogoAdminTrigger = () => {
    setIsPasscodeOpen(true);
  };

  const handlePasscodeSuccess = () => {
    setIsPasscodeOpen(false);
    setIsAdminOpen(true);
  };

  // Open Direct Link for specific placement
  const handleOpenDirectLink = (targetUrl?: string) => {
    const url = targetUrl || settings.directLinkProblemBox || 'https://www.highcpmgate.com';
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = url;
    }
  };

  // Handle Category Click (Toggles opening the numbered list)
  const handleCategoryClick = (cat: string) => {
    if (selectedCategory === cat) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(cat);
      setSearchQuery('');
      setTimeout(() => {
        document.getElementById('category-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  // Posts filtered for the clicked category
  const categoryPosts = useMemo(() => {
    if (!selectedCategory) return [];
    return posts.filter(p => p.category === selectedCategory);
  }, [posts, selectedCategory]);

  // Random 8 posts for the bottom feed
  const randomFeedPosts = useMemo(() => {
    if (posts.length === 0) return [];
    const shuffled = [...posts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  }, [posts]);

  // Search filtered posts if searching
  const searchedPosts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return posts.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-800 font-sans selection:bg-pink-100 selection:text-pink-900">
      
      {/* 1. TOP ANNOUNCEMENT STRIP */}
      {settings.announcement && (
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-pink-950 text-white px-3 py-1.5 text-xs font-medium text-center border-b border-teal-700/40 flex items-center justify-center gap-1.5">
          <Heart className="w-3 h-3 text-pink-400 fill-pink-400 shrink-0" />
          <span>{settings.announcement}</span>
        </div>
      )}

      {/* 2. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3">
          
          {/* Logo with "একটি নতুন প্রাণের অপেক্ষায়" (Silent 6-tap admin trigger) */}
          <div className="shrink-0">
            <MotherCareLogo
              size={50}
              customLogoUrl={settings.customLogoUrl}
              onAdminTrigger={handleLogoAdminTrigger}
            />
          </div>

          {/* Categories Navigation */}
          <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
            {CONTENT_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`text-xs sm:text-sm font-bold whitespace-nowrap px-3 py-1.5 rounded-lg transition-all shrink-0 flex items-center gap-1 active:scale-95 ${
                    isSelected
                      ? 'text-teal-950 bg-pink-100 border-2 border-pink-600 shadow-xs'
                      : 'text-slate-700 bg-slate-50 hover:text-teal-900 hover:bg-pink-50/60 border border-slate-200/80'
                  }`}
                >
                  <span>{cat}</span>
                  {isSelected ? (
                    <ChevronUp className="w-3.5 h-3.5 text-pink-600" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>
              );
            })}

            {/* Special High-Intent Category: "যে দিন মিলনে গর্ভধারণ হবেই" -> Dedicated Direct Link 2 */}
            <a
              href={settings.directLinkPregnantDay || 'https://www.profitableratecpmnetwork.com/zys9v6bqmy?key=a6bcd9948443bcc9355cee3add942839'}
              target="_blank"
              rel="noopener noreferrer"
              title="বিশেষ গাইড দেখতে ক্লিক করুন"
              className="text-xs sm:text-sm font-extrabold whitespace-nowrap px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-xs hover:shadow transition-all shrink-0 flex items-center gap-1 active:scale-95 animate-pulse"
            >
              <Flame className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
              <span>যে দিন মিলনে গর্ভধারণ হবেই</span>
              <ExternalLink className="w-3 h-3 text-pink-200" />
            </a>
          </nav>

          {/* "পরামর্শ চান?" Button -> Dedicated Direct Link 3 */}
          <div className="flex items-center shrink-0">
            <a
              href={settings.directLinkConsultation || 'https://www.profitableratecpmnetwork.com/awqwz58jh6?key=c0d6c7eb061d2068c6768384d84436c4'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 whitespace-nowrap active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
              <span>পরামর্শ চান?</span>
            </a>
          </div>
        </div>
      </header>

      {/* 3. COMPACT "আপনার সমস্যা এখানে লিখুন" BOX -> Dedicated Direct Link 1 */}
      <ProblemSubmissionBox directLinkProblemBox={settings.directLinkProblemBox} />

      {/* 4. ADSTERRA HORIZONTAL BANNER -> Dedicated Direct Link 4 */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 w-full">
        <AdsterraAdBanner
          directLink={settings.directLinkMainBanner}
          customScriptCode={settings.adBannerCode}
          format="horizontal"
        />
      </div>

      {/* 4.B DEDICATED 300x250 ADSTERRA BANNER UNIT */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 w-full flex justify-center">
        <AdsterraAdBanner
          customScriptCode={settings.adBannerCode}
          directLink={settings.directLinkMainBanner}
          format="rectangle"
        />
      </div>

      {/* 5. MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 w-full space-y-6">
        
        {/* Search Bar for Quick Topic Finder */}
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="যেকোনো বিষয় বা প্রশ্ন খুঁজুন (যেমন: ওভুলেশন, পিরিয়ড, সহবাস)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-700 shadow-xs"
          />
        </div>

        {/* Search Results if user is searching */}
        {searchQuery.trim() && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Search className="w-4 h-4 text-teal-700" />
                <span>অনুসন্ধানের ফলাফল ({searchedPosts.length} টি পাওয়া গেছে)</span>
              </h3>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-rose-600 hover:underline"
              >
                মুছুন
              </button>
            </div>

            {searchedPosts.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">কোনো তথ্য পাওয়া যায়নি। অন্য কিছু লিখে খুঁজুন।</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {searchedPosts.map((post, idx) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-pink-50/50 px-2 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-teal-50 text-teal-800 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                          {post.title}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {post.category} • {post.readTime}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-pink-600 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. NUMBERED TITLE LIST ONLY WHEN A CATEGORY IS CLICKED! */}
        {selectedCategory && (
          <section 
            id="category-section" 
            className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-pink-300 shadow-md animate-fadeIn"
          >
            {/* Category Banner Title with Close Button */}
            <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-pink-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-pink-100 text-pink-700">
                  <ListOrdered className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                    {selectedCategory} — বিষয়ভিত্তিক সূচিপত্র
                  </h2>
                  <p className="text-xs text-slate-500">
                    পছন্দমতো যেকোনো শিরোনামে ক্লিক করে বিস্তারিত পড়ুন
                  </p>
                </div>
              </div>

              {/* Close Button to collapse the numbered list */}
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-1.5 sm:px-3 sm:py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1 transition-colors"
                title="সূচিপত্র বন্ধ করুন"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">বন্ধ করুন</span>
              </button>
            </div>

            {/* Numbered Titles List */}
            <div className="space-y-2">
              {categoryPosts.map((post, idx) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="p-3 sm:p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-pink-50/80 hover:border-pink-300 transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-2xs"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-teal-800 group-hover:bg-pink-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center shrink-0 transition-colors shadow-xs">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-pink-700 transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>{post.readTime}</span>
                        <span aria-hidden="true">•</span>
                        <span className="line-clamp-1 max-w-[260px] sm:max-w-md text-slate-400">
                          {post.excerpt}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-pink-600 shrink-0 group-hover:translate-x-1 transition-transform">
                    <span className="hidden sm:inline">পড়ুন</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. ADSTERRA IN-FEED SPONSORED BANNER */}
        <div className="w-full">
          <AdsterraAdBanner
            directLink={settings.directLinkMainBanner}
            customScriptCode={settings.adBannerCode}
            format="in-feed"
          />
        </div>

        {/* 8. RANDOM POSTS FEED (সর্বোচ্চ ৮টি আকর্ষণীয় পোস্ট র‍্যান্ডমলি শো হবে) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-600" />
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                সকল গুরুত্বপূর্ণ বিষয় থেকে নির্বাচিত ৮টি লেখা
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">র‍্যান্ডম সংগ্রহ</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {randomFeedPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-teal-800 to-pink-900 flex items-center justify-center p-3 text-white font-bold text-xs">
                        Mother Care
                      </div>
                    )}

                    <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-teal-900 shadow-2xs">
                      {post.category}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1.5 font-normal">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-pink-600 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-[11px] text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium truncate max-w-[130px]">
                    {post.author}
                  </span>
                  <span className="font-bold text-pink-600 flex items-center gap-0.5 text-xs group-hover:translate-x-0.5 transition-transform">
                    পড়ুন <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>

      {/* 9. CLEAN QUIET FOOTER (NO VISIBLE ADMIN TEXT, NO PHONE NUMBERS, NO ADDRESS) */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          
          <div className="flex justify-center items-center">
            <MotherCareLogo
              size={50}
              customLogoUrl={settings.customLogoUrl}
              onAdminTrigger={handleLogoAdminTrigger}
            />
          </div>

          <p className="text-xs text-pink-400 font-medium">
            Mother Care • একটি নতুন প্রাণের অপেক্ষায়
          </p>

          <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
            মাসিক চক্র, বেবি কনসিভ ও সহবাস সচেতনতায় নারীদের নির্ভরযোগ্য তথ্য ভাণ্ডার।
          </p>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            © {new Date().getFullYear()} Mother Care. সর্বস্বত্ব সংরক্ষিত।
          </div>
        </div>
      </footer>

      {/* 10. ADSTERRA SOCIAL BAR CONTAINER (Safely loads when script is entered) */}
      <AdsterraSocialBar scriptCode={settings.adSocialBarCode} />

      {/* 11. MODALS */}
      
      {/* Secret Passcode Modal (Secret PIN 6550) */}
      <PasscodeModal
        isOpen={isPasscodeOpen}
        onClose={() => setIsPasscodeOpen(false)}
        onSuccess={handlePasscodeSuccess}
      />

      {/* Admin Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        posts={posts}
        onSavePosts={handleSavePosts}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      {/* Post Detail Modal -> Dedicated Direct Link 5 (In-Article) */}
      <PostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        directLinkInArticle={settings.directLinkInArticle}
        adBannerCode={settings.adBannerCode}
      />

    </div>
  );
}
