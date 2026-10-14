export interface CarePost {
  id: string;
  title: string;
  category: 'মাসিক নিয়ে কথা' | 'বেবি কনসিভ' | 'সহবাস ও পজিশন' | string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  author: string;
  publishedDate: string;
  readTime: string;
  isFeatured?: boolean;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  subTitle: string;
  // Individual Dedicated Adsterra Direct Links
  directLinkProblemBox: string;    // ১. 'আপনার সমস্যা এখানে লিখুন' (সেভ করুন বাটন)
  directLinkPregnantDay: string;   // ২. মেনুর 'যে দিন মিলনে গর্ভধারণ হবেই' বাটন
  directLinkConsultation: string;  // ৩. হেডারের 'পরামর্শ চান?' বাটন
  directLinkMainBanner: string;    // ৪. 'এই একটি পদ্ধতি মানলে বেবি কনসিভ হবেই' ব্যানার
  directLinkInArticle: string;     // ৫. আর্টিকেলের ভিতরের স্পন্সর স্লট
  // Dedicated Adsterra Scripts
  adSocialBarCode?: string;        // Adsterra Social Bar স্ক্রিপ্ট কোড
  adBannerCode?: string;           // Adsterra ব্যানার / নেটিভ অ্যাড কোড
  announcement?: string;
  customLogoUrl?: string;
}
