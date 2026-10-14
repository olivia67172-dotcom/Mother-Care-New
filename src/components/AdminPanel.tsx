import React, { useState } from 'react';
import { CarePost, SiteSettings } from '../types';
import { 
  PlusCircle, 
  Trash2, 
  Edit3, 
  Save, 
  Upload, 
  Image as ImageIcon, 
  LogOut, 
  Check, 
  Sparkles, 
  Layers, 
  Settings, 
  Link2, 
  Code,
  RefreshCw,
  Eye
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  posts: CarePost[];
  onSavePosts: (posts: CarePost[]) => void;
  settings: SiteSettings;
  onSaveSettings: (settings: SiteSettings) => void;
}

const CATEGORIES = ['মাসিক নিয়ে কথা', 'বেবি কনসিভ', 'সহবাস ও পজিশন'];

const PRESET_IMAGES = [
  { label: 'মাতৃত্ব ও ভ্রূণ বিকাশ', url: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=800&q=80' },
  { label: 'ওভুলেশন ও প্রেগন্যান্সি টেস্ট', url: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=800&q=80' },
  { label: 'ফার্টিলিটি ডায়েট ও পুষ্টি', url: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=800&q=80' },
  { label: 'দাম্পত্য ও সহবাস', url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80' },
  { label: 'চিকিৎসক পরামর্শ', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80' },
  { label: 'হরমোন ও মাসিক', url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=800&q=80' },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  posts,
  onSavePosts,
  settings,
  onSaveSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'add' | 'settings'>('add');
  
  // Super Simple Post Form State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postCategory, setPostCategory] = useState<string>(CATEGORIES[0]);
  const [postTitle, setPostTitle] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [postContent, setPostContent] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Settings & Logo State
  const [tempSettings, setTempSettings] = useState<SiteSettings>(settings);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Upload image for post
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('ছবিটির সাইজ ৫ মেগাবাইটের বেশি। অনুগ্রহ করে ছোট ছবি নির্বাচন করুন।');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setPostImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload custom logo for website
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setTempSettings(prev => ({ ...prev, customLogoUrl: result }));
        // Automatically save logo to site settings immediately!
        onSaveSettings({ ...tempSettings, customLogoUrl: result });
        showToast('লোগো সফলভাবে আপলোড ও আপডেট করা হয়েছে!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = () => {
    const updated = { ...tempSettings, customLogoUrl: undefined };
    setTempSettings(updated);
    onSaveSettings(updated);
    showToast('ডিফল্ট Mother Care লোগো রিস্টোর করা হয়েছে!');
  };

  const resetForm = () => {
    setEditingPostId(null);
    setPostCategory(CATEGORIES[0]);
    setPostTitle('');
    setPostImageUrl('');
    setPostContent('');
  };

  const handleEditClick = (post: CarePost) => {
    setEditingPostId(post.id);
    setPostCategory(post.category);
    setPostTitle(post.title);
    setPostImageUrl(post.imageUrl || '');
    setPostContent(post.content);
    setActiveTab('add');
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই পোস্টটি মুছে ফেলতে চান?')) {
      const updated = posts.filter(p => p.id !== id);
      onSavePosts(updated);
      showToast('পোস্টটি মুছে ফেলা হয়েছে!');
    }
  };

  // Simple auto-publish submit
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) {
      alert('অনুগ্রহ করে পোস্টের একটি শিরোনাম লিখুন!');
      return;
    }
    if (!postContent.trim()) {
      alert('অনুগ্রহ করে বিস্তারিত লেখাটি লিখুন!');
      return;
    }

    const todayDate = new Date().toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Auto calculate read time
    const wordCount = postContent.trim().split(/\s+/).length;
    const minutes = Math.max(2, Math.ceil(wordCount / 120));
    const autoReadTime = `${minutes} মিনিট`;

    // Auto excerpt
    const autoExcerpt = postContent.slice(0, 110).replace(/[\n\r]+/g, ' ').trim() + '...';

    // Image fallback
    const finalImage = postImageUrl || PRESET_IMAGES[0].url;

    if (editingPostId) {
      const updated = posts.map(p => {
        if (p.id === editingPostId) {
          return {
            ...p,
            category: postCategory,
            title: postTitle.trim(),
            imageUrl: finalImage,
            content: postContent.trim(),
            excerpt: autoExcerpt,
            readTime: autoReadTime,
          };
        }
        return p;
      });
      onSavePosts(updated);
      showToast('পোস্টটি সফলভাবে আপডেট ও পাবলিশ হয়েছে!');
    } else {
      const newPost: CarePost = {
        id: 'post-' + Date.now(),
        category: postCategory,
        title: postTitle.trim(),
        imageUrl: finalImage,
        content: postContent.trim(),
        excerpt: autoExcerpt,
        author: 'Mother Care টিম',
        publishedDate: todayDate,
        readTime: autoReadTime,
        isFeatured: true,
      };
      onSavePosts([newPost, ...posts]);
      showToast('নতুন পোস্ট সাইটে অটো পাবলিশ হয়ে গেছে!');
    }

    resetForm();
    setActiveTab('posts');
  };

  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(tempSettings);
    showToast('সেটিংস ও Adsterra লিংক সংরক্ষিত হয়েছে!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 bg-slate-900/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-pink-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-pink-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg">Mother Care এডমিন প্যানেল</h2>
                <span className="text-[10px] bg-pink-500 text-white font-semibold px-2 py-0.5 rounded-full">
                  পাসকোড ৬৫৫০ ভেরিফাইড
                </span>
              </div>
              <p className="text-xs text-pink-100">
                সহজে শিরোনাম, ছবি ও লেখা দিন—সেভ করলেই অটো পাবলিশ!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>বন্ধ করুন</span>
          </button>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              {successToast}
            </span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 shrink-0">
          <button
            onClick={() => {
              resetForm();
              setActiveTab('add');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all ${
              activeTab === 'add'
                ? 'bg-white text-teal-900 border-t-2 border-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-pink-500" />
            <span>{editingPostId ? 'পোস্ট এডিট করুন' : '+ সহজে নতুন পোস্ট লিখুন'}</span>
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all ${
              activeTab === 'posts'
                ? 'bg-white text-teal-900 border-t-2 border-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>সকল পোস্ট ({posts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all ${
              activeTab === 'settings'
                ? 'bg-white text-teal-900 border-t-2 border-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>লোগো আপলোড ও Adsterra লিংক</span>
          </button>
        </div>

        {/* Main Form & Content Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          
          {/* TAB 1: SUPER SIMPLE POST CREATOR */}
          {activeTab === 'add' && (
            <form onSubmit={handleSavePost} className="space-y-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {editingPostId ? 'পোস্ট সম্পাদনা করুন' : 'সহজে নতুন পোস্ট তৈরি করুন'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    শুধু ক্যাটাগরি, শিরোনাম, ছবি ও লেখা দিয়ে সেভ করলেই সঙ্গে সঙ্গে ওয়েবসাইটে অটো পাবলিশ হয়ে যাবে।
                  </p>
                </div>
                {editingPostId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs text-slate-500 hover:text-slate-800 underline"
                  >
                    নতুন তৈরিতে ফিরে যান
                  </button>
                )}
              </div>

              {/* 1. Category Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ১. ক্যাটাগরি বেছে নিন *
                </label>
                <select
                  value={postCategory}
                  onChange={e => setPostCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-bold text-teal-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* 2. Post Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ২. পোস্টের শিরোনাম (Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ওভুলেশনের সময় কোন ৫টি লক্ষণ দেখলে গর্ভধারণ নিশ্চিত বুঝবেন..."
                  value={postTitle}
                  onChange={e => setPostTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 font-medium"
                />
              </div>

              {/* 3. Image Selection / Upload */}
              <div className="p-4 bg-pink-50/40 rounded-xl border border-pink-200">
                <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-pink-600" />
                  ৩. পোস্টের ছবি যুক্ত করুন (মোবাইল/কম্পিউটার থেকে আপলোড বা প্রিসেট)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  {/* File Upload Button */}
                  <div className="border-2 border-dashed border-pink-300 rounded-lg p-3 text-center bg-white hover:bg-pink-50/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      id="post-image-file"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="post-image-file"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <Upload className="w-5 h-5 text-pink-600 mb-1" />
                      <span className="text-xs font-bold text-pink-800">
                        ডিভাইসের গ্যালারি থেকে ছবি আপলোড করুন
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        JPG, PNG, WebP
                      </span>
                    </label>
                  </div>

                  {/* Image URL Input */}
                  <div className="flex flex-col justify-center">
                    <label className="text-[11px] text-slate-600 mb-1 font-medium">
                      অথবা অনলাইন ছবির লিঙ্ক দিন:
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={postImageUrl}
                      onChange={e => setPostImageUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block mb-1">
                    অথবা এক ক্লিকে রেডি ছবি বেছে নিন:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPostImageUrl(preset.url)}
                        className={`text-[10px] px-2.5 py-1 rounded-md border flex items-center gap-1 transition-all ${
                          postImageUrl === preset.url
                            ? 'bg-pink-600 text-white border-pink-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-pink-400'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Image Preview */}
                {postImageUrl && (
                  <div className="mt-3 flex items-center gap-3 p-2 bg-white rounded-lg border border-pink-200">
                    <img
                      src={postImageUrl}
                      alt="Preview"
                      className="w-16 h-16 rounded object-cover border border-slate-100 shrink-0"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> ছবিটি প্রস্তুত
                      </span>
                      <button
                        type="button"
                        onClick={() => setPostImageUrl('')}
                        className="text-rose-600 hover:underline text-[11px] mt-0.5 block"
                      >
                        ছবি সরান
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Content Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ৪. বিস্তারিত লেখা ও পরামর্শ (Content) *
                </label>
                <textarea
                  rows={9}
                  required
                  placeholder="এখানে আপনার সম্পূর্ণ লেখা বা পরামর্শ লিখুন..."
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab('posts');
                  }}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 bg-gradient-to-r from-teal-800 to-pink-600 hover:from-teal-900 hover:to-pink-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg flex items-center gap-2 transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>সেভ করুন (অটো পাবলিশ)</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: POSTS LIST */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-sm font-bold text-slate-800">
                  সকল পোস্ট ({posts.length} টি)
                </span>
                <button
                  onClick={() => {
                    resetForm();
                    setActiveTab('add');
                  }}
                  className="px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  + নতুন পোস্ট লিখুন
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="flex gap-3">
                      {post.imageUrl && (
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-20 h-20 rounded-lg object-cover shrink-0 border border-slate-100"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded">
                          {post.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug mt-1">
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">
                        {post.publishedDate}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditClick(post)}
                          className="p-1.5 text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
                          title="এডিট"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LOGO UPLOAD & ADSTERRA LINK */}
          {activeTab === 'settings' && (
            <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              
              {/* SECTION A: LOGO UPLOAD */}
              <div className="p-5 bg-gradient-to-r from-teal-50/70 to-pink-50/70 rounded-xl border-2 border-teal-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-teal-700" />
                    <span>ওয়েবসাইটের লোগো পরিবর্তন ও আপলোড</span>
                  </h3>
                  <span className="text-[11px] text-teal-800 font-semibold bg-white px-2 py-0.5 rounded-full border border-teal-200">
                    লাইভ আপডেট
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  আপনার মোবাইল বা কম্পিউটার থেকে যেকোনো লোগো ছবি নির্বাচন করে সরাসরি আপলোড করতে পারবেন। আপলোড করলেই সাথে সাথে পুরো ওয়েবসাইটে নতুন লোগোটি বসে যাবে।
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Current Logo Preview */}
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] text-slate-500 font-medium mb-1.5">বর্তমান লোগো:</span>
                    <div className="w-20 h-20 rounded-full border-2 border-teal-600 p-1 bg-white shadow-sm flex items-center justify-center overflow-hidden">
                      {tempSettings.customLogoUrl ? (
                        <img
                          src={tempSettings.customLogoUrl}
                          alt="Custom Logo"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-teal-800 text-white font-extrabold flex flex-col items-center justify-center text-[10px] leading-tight">
                          <span>Mother</span>
                          <span className="text-pink-300">Care</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <input
                      type="file"
                      accept="image/*"
                      id="admin-site-logo-upload"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="admin-site-logo-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
                    >
                      <Upload className="w-4 h-4 text-pink-300" />
                      <span>নতুন লোগো ছবি সিলেক্ট করুন</span>
                    </label>

                    {tempSettings.customLogoUrl && (
                      <button
                        type="button"
                        onClick={handleResetLogo}
                        className="block text-xs text-rose-600 hover:underline font-semibold mt-1"
                      >
                        ডিফল্ট Mother Care লোগোতে ফিরে যান
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION B: INDIVIDUAL ADSTERRA DIRECT LINKS */}
              <form onSubmit={handleSaveSiteSettings} className="space-y-5">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-pink-600" />
                    <span>স্থানভিত্তিক Adsterra ডিরেক্ট লিংকসমূহ (প্রত্যেকটির আলাদা ঘর)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    প্রতিটি বাটনের জন্য আপনার Adsterra ডিরেক্ট লিংক এখানে পেস্ট করুন এবং নিচে সেভ বাটনে চাপ দিন।
                  </p>
                </div>

                {/* 1. Problem Box Link */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    ১. 'আপনার সমস্যা এখানে লিখুন' (সেভ করুন বাটন) ডিরেক্ট লিংক:
                  </label>
                  <p className="text-[11px] text-slate-500">
                    ভিজিটর যখন সমস্যা লিখে 'সেভ করুন' এ ক্লিক করবে তখন এই লিংকে যাবে।
                  </p>
                  <input
                    type="url"
                    required
                    placeholder="https://www.highcpmgate.com/direct-link-1"
                    value={tempSettings.directLinkProblemBox || ''}
                    onChange={e => setTempSettings(prev => ({ ...prev, directLinkProblemBox: e.target.value }))}
                    className="w-full px-3 py-2 text-xs font-mono font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* 2. Menu Item Link */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    ২. মেনুর 'যে দিন মিলনে গর্ভধারণ হবেই' বাটন ডিরেক্ট লিংক:
                  </label>
                  <p className="text-[11px] text-slate-500">
                    মেনুতে উজ্জ্বল পিংক রঙের এই বাটনে ক্লিক করলেই এই লিংকে যাবে।
                  </p>
                  <input
                    type="url"
                    required
                    placeholder="https://www.highcpmgate.com/direct-link-2"
                    value={tempSettings.directLinkPregnantDay || ''}
                    onChange={e => setTempSettings(prev => ({ ...prev, directLinkPregnantDay: e.target.value }))}
                    className="w-full px-3 py-2 text-xs font-mono font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* 3. Header Consultation Link */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    ৩. হেডারের 'পরামর্শ চান?' বাটন ডিরেক্ট লিংক:
                  </label>
                  <p className="text-[11px] text-slate-500">
                    ওয়েবসাইটের ওপরে ডানে থাকা সবুজ 'পরামর্শ চান?' বাটনে ক্লিক করলে যাবে।
                  </p>
                  <input
                    type="url"
                    required
                    placeholder="https://www.highcpmgate.com/direct-link-3"
                    value={tempSettings.directLinkConsultation || ''}
                    onChange={e => setTempSettings(prev => ({ ...prev, directLinkConsultation: e.target.value }))}
                    className="w-full px-3 py-2 text-xs font-mono font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* 4. Main Banner Link */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    ৪. 'এই একটি পদ্ধতি মানলে বেবি কনসিভ হবেই' ব্যানার অ্যাড ডিরেক্ট লিংক:
                  </label>
                  <p className="text-[11px] text-slate-500">
                    ফিডের মাঝে ও ওপরে থাকা বড় বিজ্ঞাপন ব্যানারের ক্লিকে এই লিংকে যাবে।
                  </p>
                  <input
                    type="url"
                    required
                    placeholder="https://www.highcpmgate.com/direct-link-4"
                    value={tempSettings.directLinkMainBanner || ''}
                    onChange={e => setTempSettings(prev => ({ ...prev, directLinkMainBanner: e.target.value }))}
                    className="w-full px-3 py-2 text-xs font-mono font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* 5. In-Article Link */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    ৫. আর্টিকেলের ভেতরের (In-Article) বিজ্ঞাপন ডিরেক্ট লিংক:
                  </label>
                  <p className="text-[11px] text-slate-500">
                    ভিজিটর যখন কোনো লেখা সম্পূর্ণ পড়ার সময় মাঝখানের বিজ্ঞাপনে চাপবে তখন এই লিংকে যাবে।
                  </p>
                  <input
                    type="url"
                    required
                    placeholder="https://www.highcpmgate.com/direct-link-5"
                    value={tempSettings.directLinkInArticle || ''}
                    onChange={e => setTempSettings(prev => ({ ...prev, directLinkInArticle: e.target.value }))}
                    className="w-full px-3 py-2 text-xs font-mono font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* SECTION C: ADSTERRA SOCIAL BAR & BANNER SCRIPTS */}
                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Code className="w-4 h-4 text-teal-700" />
                    <span>Adsterra স্ক্রিপ্ট ও ব্যানার কোড (মোবাইল ও পিসিতে অটো লোড)</span>
                  </h4>

                  {/* Social Bar Code */}
                  <div className="p-3.5 bg-teal-50/50 rounded-xl border border-teal-200 space-y-1.5">
                    <label className="block text-xs font-bold text-teal-950 flex items-center justify-between">
                      <span>Adsterra সোশ্যাল বার (Social Bar) স্ক্রিপ্ট কোড (ঐচ্ছিক):</span>
                      <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-normal">মোবাইলে দারুণ পারফর্ম করে</span>
                    </label>
                    <p className="text-[11px] text-slate-600">
                      Adsterra থেকে পাওয়া Social Bar কোডটি হুবহু এখানে পেস্ট করে দিন। এটি স্বয়ংক্রিয়ভাবে মোবাইলে ও পিসিতে লোড হবে।
                    </p>
                    <textarea
                      rows={3}
                      placeholder="<script type='text/javascript' src='//...adsterra...'></script>"
                      value={tempSettings.adSocialBarCode || ''}
                      onChange={e => setTempSettings(prev => ({ ...prev, adSocialBarCode: e.target.value }))}
                      className="w-full px-3 py-2 text-xs font-mono border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white"
                    />
                  </div>

                  {/* Banner Code */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Adsterra ব্যানার / Native অ্যাড স্ক্রিপ্ট কোড (ঐচ্ছিক):
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Adsterra থেকে পাওয়া 300x250, 728x90 বা Native Banner কোড থাকলে এখানে পেস্ট করুন।
                    </p>
                    <textarea
                      rows={3}
                      placeholder="<script type='text/javascript'> ... </script>"
                      value={tempSettings.adBannerCode || ''}
                      onChange={e => setTempSettings(prev => ({ ...prev, adBannerCode: e.target.value }))}
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-teal-800 to-pink-600 hover:from-teal-900 hover:to-pink-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>সকল বিজ্ঞাপন লিংক সংরক্ষণ করুন (অটো এক্টিভ)</span>
                  </button>
                </div>
              </form>

            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>লগোতে ৬ বার ক্লিক করে আপনি যেকোনো সময় এই এডমিন প্যানেল খুলতে পারবেন (কোড: ৬৫৫০)।</span>
          <button
            onClick={onClose}
            className="text-teal-800 font-semibold hover:underline"
          >
            সাইট দেখুন →
          </button>
        </div>
      </div>
    </div>
  );
};
