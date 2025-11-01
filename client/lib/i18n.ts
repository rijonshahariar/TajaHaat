import { useState, useEffect } from 'react';

export const translations = {
<<<<<<< HEAD
  en: {
    // Header Navigation
    'nav.home': 'Home',
    'nav.marketplace': 'Marketplace',
    'nav.dashboard': 'Dashboard',
    'nav.forecast': 'Forecast',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.bids': 'Bids',

    // Common Actions
    'btn.explore_marketplace': 'Explore Marketplace',
    'btn.post_demand': 'Post Demand',
    'btn.get_started_farmer': 'Get Started as Farmer',
    'btn.get_started_buyer': 'Get Started as Buyer',
    'btn.sign_in': 'Sign In',
    'btn.create_account': 'Create Account',
    'btn.place_order': 'Place Order',
    'btn.go_back': 'Go Back',
    'btn.logout': 'Logout',

    // Home Page
    'home.hero.badge': 'Smart Agriculture Platform',
    'home.hero.title': 'Connecting Farms and Markets through Data & Trust',
    'home.hero.subtitle': 'Eliminate intermediaries. Direct connection between farmers and buyers with smart demand forecasting.',
    'home.stats.active_farmers': 'Active Farmers',
    'home.stats.products_listed': 'Products Listed',
    'home.stats.orders_delivered': 'Orders Delivered',
    'home.stats.verified_farmers': 'Verified Farmers',
    'home.stats.happy_buyers': 'Happy Buyers',
    'home.stats.delivered_on_time': 'Delivered On Time',

    // Features
    'feature.post_demand.title': 'Post Demand',
    'feature.post_demand.description': 'Tell farmers exactly what you need and get instant quotes from the best suppliers',
    'feature.list_products.title': 'List Products',
    'feature.list_products.description': 'Showcase your crops directly to buyers without middlemen. Set your own prices.',
    'feature.predict_demand.title': 'Predict Demand',
    'feature.predict_demand.description': 'Use AI-powered forecasting to optimize your production and maximize profits',
    'feature.track_deliveries.title': 'Track Deliveries',
    'feature.track_deliveries.description': 'Real-time tracking ensures your products reach on time, every time',

    // Marketplace
    'marketplace.title': 'Marketplace',
    'marketplace.subtitle': 'Browse fresh products directly from farmers',
    'marketplace.search_placeholder': 'Search products, farmers, or locations...',
    'marketplace.filter_by': 'Filter by:',
    'marketplace.category.all': 'All',
    'marketplace.farmer_level': 'Level',
    'marketplace.sold': 'Sold',
    'marketplace.in_stock': 'In Stock',
    'marketplace.per_kg': 'per kg',

    // Authentication
    'auth.welcome_back': 'Welcome Back',
    'auth.sign_in_subtitle': 'Enter your phone number to access your account',
    'auth.create_account': 'Create Account',
    'auth.join_তাজা হাট': 'Join তাজা হাট and start trading',
    'auth.full_name': 'Full Name',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.phone_number': 'Phone Number',
    'auth.enter_phone': 'Enter your phone number',
    'auth.phone_placeholder': '+880 1XXX XXXXXX',
    'auth.otp_code': 'OTP Code',
    'auth.enter_otp': 'Enter the 6-digit code',
    'auth.otp_placeholder': '123456',
    'auth.send_otp': 'Send OTP',
    'auth.verify_otp': 'Verify OTP',
    'auth.resend_otp': 'Resend OTP',
    'auth.otp_sent': 'OTP sent to your phone',
    'auth.forgot_password': 'Forgot password?',
    'auth.dont_have_account': "Don't have an account?",
    'auth.already_have_account': 'Already have an account?',
    'auth.sign_up': 'Sign up',
    'auth.sign_in': 'Sign in',
    'auth.i_am_a': 'I am a...',
    'auth.farmer': 'Farmer',
    'auth.buyer': 'Buyer',
    'auth.agree_terms': 'I agree to the',
    'auth.terms_of_service': 'Terms of Service',
    'auth.privacy_policy': 'Privacy Policy',
    'auth.demo_note': 'This is a demo page. Full authentication functionality can be added by connecting a backend service.',

    // Product Details
    'product.quantity_kg': 'Quantity (kg)',
    'product.contact_farmer': 'Contact Farmer',
    'product.certifications': 'Certifications',
    'product.farmer_info': 'Farmer Information',
    'product.harvest_date': 'Harvest Date',
    'product.location': 'Location',
    'product.phone': 'Phone',
    'product.order_placed': 'Order Placed!',
    'product.order_success': 'Your order has been created successfully',

    // Dashboards
    'dashboard.farmer.title': 'Farmer Dashboard',
    'dashboard.farmer.subtitle': 'Manage your farm and products',
    'dashboard.buyer.title': 'Buyer Dashboard',
    'dashboard.buyer.subtitle': 'Manage your orders and demands',
    'dashboard.expand_note': 'Continue prompting to expand this dashboard with full functionality.',

    // Forecast
    'forecast.title': 'Demand Forecast',
    'forecast.subtitle': 'AI-powered market predictions',
    'forecast.expand_note': 'Continue prompting to expand this dashboard with full chart functionality.',

    // About Page
    'about.title': 'About তাজা হাট',
    'about.subtitle': 'Learn about our mission to revolutionize agriculture',
    'about.content': "This page can be further developed with more content about the platform's mission, team, and values. Continue prompting to expand this section with detailed information.",

    // Contact Page
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in touch with our team',
    'contact.content': 'This page can be further developed with contact forms and information. Continue prompting to expand this section.',

    // Footer
    'footer.brand_tagline': 'Connecting Farms and Markets through Data & Trust.',
    'footer.quick_links': 'Quick Links',
    'footer.support': 'Support',
    'footer.contact_info': 'Contact Info',
    'footer.help_center': 'Help Center',
    'footer.all_rights_reserved': 'All rights reserved.',

    // Error Pages
    'error.page_not_found': 'Page Not Found',
    'error.go_home': 'Go Home',

    // Common
    'common.loading': 'Loading...',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.more': 'More',

    // User Levels
    'level.new': 'New Member',
    'level.level_1': 'Level 1',
    'level.level_2': 'Level 2',
    'level.level_3': 'Level 3',

    // Call to Action
    'cta.title': 'Ready to Join the Agricultural Revolution?',
    'cta.subtitle': 'Whether you\'re a farmer or buyer, তাজা হাট provides the tools you need to succeed',
  },
  bn: {
    // Header Navigation
    'nav.home': 'হোম',
    'nav.marketplace': 'বাজার',
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.forecast': 'পূর্বাভাস',
    'nav.about': 'সম্পর্কে',
    'nav.contact': 'যোগাযোগ',
    'nav.login': 'লগইন',
    'nav.register': 'নিবন্ধন',
    'nav.bids': 'বিড',

    // Common Actions
    'btn.explore_marketplace': 'বাজার অন্বেষণ করুন',
    'btn.post_demand': 'চাহিদা পোস্ট করুন',
    'btn.get_started_farmer': 'কৃষক হিসেবে শুরু করুন',
    'btn.get_started_buyer': 'ক্রেতা হিসেবে শুরু করুন',
    'btn.sign_in': 'সাইন ইন',
    'btn.create_account': 'অ্যাকাউন্ট তৈরি করুন',
    'btn.place_order': 'অর্ডার দিন',
    'btn.go_back': 'ফিরে যান',
    'btn.logout': 'লগআউট',

    // Home Page
    'home.hero.badge': 'স্মার্ট কৃষি প্ল্যাটফর্ম',
    'home.hero.title': 'ডেটা ও বিশ্বাসের মাধ্যমে খামার ও বাজার সংযোগ',
    'home.hero.subtitle': 'মধ্যস্বত্বভোগীদের দূর করুন। স্মার্ট চাহিদা পূর্বাভাস সহ কৃষক ও ক্রেতাদের সরাসরি সংযোগ।',
    'home.stats.active_farmers': 'সক্রিয় কৃষক',
    'home.stats.products_listed': 'তালিকাভুক্ত পণ্য',
    'home.stats.orders_delivered': 'ডেলিভারি সম্পন্ন',
    'home.stats.verified_farmers': 'যাচাইকৃত কৃষক',
    'home.stats.happy_buyers': 'সন্তুষ্ট ক্রেতা',
    'home.stats.delivered_on_time': 'সময়মতো ডেলিভারি',

    // Features
    'feature.post_demand.title': 'চাহিদা পোস্ট করুন',
    'feature.post_demand.description': 'কৃষকদের ঠিক কী প্রয়োজন তা বলুন এবং সেরা সরবরাহকারীদের কাছ থেকে তাৎক্ষণিক দাম পান',
    'feature.list_products.title': 'পণ্য তালিকাভুক্ত করুন',
    'feature.list_products.description': 'মধ্যস্বত্বভোগী ছাড়াই ক্রেতাদের কাছে সরাসরি আপনার ফসল প্রদর্শন করুন। নিজের দাম নির্ধারণ করুন।',
    'feature.predict_demand.title': 'চাহিদার পূর্বাভাস',
    'feature.predict_demand.description': 'আপনার উৎপাদন অনুকূল করতে এবং লাভ সর্বোচ্চ করতে এআই-চালিত পূর্বাভাস ব্যবহার করুন',
    'feature.track_deliveries.title': 'ডেলিভারি ট্র্যাক করুন',
    'feature.track_deliveries.description': 'রিয়েল-টাইম ট্র্যাকিং নিশ্চিত করে যে আপনার পণ্য প্রতিবার সময়মতো পৌঁছায়',

    // Marketplace
    'marketplace.title': 'বাজার',
    'marketplace.subtitle': 'কৃষকদের কাছ থেকে সরাসরি তাজা পণ্য ব্রাউজ করুন',
    'marketplace.search_placeholder': 'পণ্য, কৃষক বা অবস্থান অনুসন্ধান করুন...',
    'marketplace.filter_by': 'ফিল্টার করুন:',
    'marketplace.category.all': 'সকল',
    'marketplace.farmer_level': 'স্তর',
    'marketplace.sold': 'বিক্রিত',
    'marketplace.in_stock': 'স্টকে আছে',
    'marketplace.per_kg': 'প্রতি কেজি',

    // Authentication
    'auth.welcome_back': 'ফিরে আসুন',
    'auth.sign_in_subtitle': 'আপনার ফোন নম্বর এবং পিন দিয়ে লগইন করুন',
    'auth.create_account': 'অ্যাকাউন্ট তৈরি করুন',
    'auth.join_তাজা হাট': 'তাজা হাট-এ যোগদান করুন এবং ব্যবসা শুরু করুন',
    'auth.full_name': 'পূর্ণ নাম',
    'auth.email': 'ইমেইল',
    'auth.password': 'পাসওয়ার্ড',
    'auth.phone_number': 'ফোন নম্বর',
    'auth.pin': 'পিন (৪-৬ ডিজিট)',
    'auth.confirm_pin': 'পিন নিশ্চিত করুন',
    'auth.enter_phone': 'আপনার ফোন নম্বর দিন',
    'auth.phone_placeholder': '+৮৮০ ১XXX XXXXXX',
    'auth.pin_placeholder': '৪-৬ ডিজিট পিন দিন',
    'auth.otp_code': 'OTP কোড',
    'auth.enter_otp': 'আপনার ফোনে পাঠানো ৬ ডিজিট কোড দিন',
    'auth.otp_placeholder': '123456',
    'auth.send_otp': 'OTP পাঠান',
    'auth.verify_otp': 'OTP যাচাই করুন',
    'auth.verify_and_register': 'যাচাই করুন ও নিবন্ধন করুন',
    'auth.resend_otp': 'পুনরায় OTP পাঠান',
    'auth.otp_sent': 'আপনার ফোনে OTP পাঠানো হয়েছে',
    'auth.forgot_password': 'পিন ভুলে গেছেন?',
    'auth.dont_have_account': 'কোনো অ্যাকাউন্ট নেই?',
    'auth.already_have_account': 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
    'auth.sign_up': 'সাইন আপ',
    'auth.sign_in': 'সাইন ইন',
    'auth.i_am_a': 'আমি একজন...',
    'auth.farmer': 'কৃষক',
    'auth.buyer': 'ক্রেতা',
    'auth.agree_terms': 'আমি সম্মত',
    'auth.terms_of_service': 'সেবার শর্তাবলী',
    'auth.privacy_policy': 'গোপনীয়তা নীতি',
    'auth.demo_note': 'এটি একটি ডেমো পেজ। একটি ব্যাকএন্ড সেবা সংযোগ করে সম্পূর্ণ প্রমাণীকরণ কার্যকারিতা যোগ করা যেতে পারে।',

    // Product Details
    'product.quantity_kg': 'পরিমাণ (কেজি)',
    'product.contact_farmer': 'কৃষকের সাথে যোগাযোগ',
    'product.certifications': 'সার্টিফিকেশন',
    'product.farmer_info': 'কৃষকের তথ্য',
    'product.harvest_date': 'ফসল তোলার তারিখ',
    'product.location': 'অবস্থান',
    'product.phone': 'ফোন',
    'product.order_placed': 'অর্ডার সম্পন্ন!',
    'product.order_success': 'আপনার অর্ডার সফলভাবে তৈরি হয়েছে',

    // Dashboards
    'dashboard.farmer.title': 'কৃষক ড্যাশবোর্ড',
    'dashboard.farmer.subtitle': 'আপনার খামার ও পণ্য পরিচালনা করুন',
    'dashboard.buyer.title': 'ক্রেতা ড্যাশবোর্ড',
    'dashboard.buyer.subtitle': 'আপনার অর্ডার ও চাহিদা পরিচালনা করুন',
    'dashboard.expand_note': 'সম্পূর্ণ কার্যকারিতা সহ এই ড্যাশবোর্ড সম্প্রসারণের জন্য অনুরোধ করুন।',

    // Forecast
    'forecast.title': 'চাহিদার পূর্বাভাস',
    'forecast.subtitle': 'এআই-চালিত বাজার পূর্বাভাস',
    'forecast.expand_note': 'সম্পূর্ণ চার্ট কার্যকারিতা সহ এই ড্যাশবোর্ড সম্প্রসারণের জন্য অনুরোধ করুন।',

    // About Page
    'about.title': 'তাজা হাট সম্পর্কে',
    'about.subtitle': 'কৃষিতে বিপ্লব আনার আমাদের মিশন সম্পর্কে জানুন',
    'about.content': 'এই পেজটি প্ল্যাটফর্মের মিশন, দল এবং মূল্যবোধ সম্পর্কে আরও বিষয়বস্তু দিয়ে আরও উন্নত করা যেতে পারে। বিস্তারিত তথ্য সহ এই বিভাগ সম্প্রসারণের জন্য অনুরোধ করুন।',

    // Contact Page
    'contact.title': 'আমাদের সাথে যোগাযোগ করুন',
    'contact.subtitle': 'আমাদের দলের সাথে যোগাযোগ করুন',
    'contact.content': 'এই পেজটি যোগাযোগ ফর্ম এবং তথ্য দিয়ে আরও উন্নত করা যেতে পারে। এই বিভাগ সম্প্রসারণের জন্য অনুরোধ করুন।',

    // Footer
    'footer.brand_tagline': 'ডেটা ও বিশ্বাসের মাধ্যমে খামার ও বাজার সংযোগ।',
    'footer.quick_links': 'দ্রুত লিংক',
    'footer.support': 'সহায়তা',
    'footer.contact_info': 'যোগাযোগের তথ্য',
    'footer.help_center': 'সহায়তা কেন্দ্র',
    'footer.all_rights_reserved': 'সর্বস্বত্ব সংরক্ষিত।',

    // Error Pages
    'error.page_not_found': 'পেজ পাওয়া যায়নি',
    'error.go_home': 'হোমে যান',

    // Common
    'common.loading': 'লোড হচ্ছে...',
    'common.close': 'বন্ধ',
    'common.save': 'সংরক্ষণ',
    'common.cancel': 'বাতিল',
    'common.next': 'পরবর্তী',
    'common.previous': 'পূর্ববর্তী',
    'common.more': 'আরও',

    // User Levels
    'level.new': 'নতুন সদস্য',
    'level.level_1': 'স্তর ১',
    'level.level_2': 'স্তর ২',
    'level.level_3': 'স্তর ৩',

    // Call to Action
    'cta.title': 'কৃষি বিপ্লবে যোগ দিতে প্রস্তুত?',
    'cta.subtitle': 'আপনি কৃষক হোন বা ক্রেতা, তাজা হাট আপনার সফলতার জন্য প্রয়োজনীয় সরঞ্জাম প্রদান করে',
  }
};

export type Language = 'en' | 'bn';
export type TranslationKey = keyof typeof translations.en;

// Global language state
let currentLanguage: Language = 'bn'; // Default to Bengali

export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
  // Trigger a re-render by dispatching a custom event
  window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }));
};

export const getCurrentLanguage = (): Language => currentLanguage;

export const t = (key: TranslationKey): string => {
  return translations[currentLanguage][key] || translations.en[key] || key;
};

// Hook for components to subscribe to language changes
export const useTranslation = () => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate({});
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  return { t, currentLanguage, setLanguage };
=======
  // Header Navigation
  'nav.home': 'Home',
  'nav.marketplace': 'Marketplace',
  'nav.dashboard': 'Dashboard',
  'nav.forecast': 'Forecast',
  'nav.about': 'About',
  'nav.contact': 'Contact',
  'nav.login': 'Login',
  'nav.register': 'Register',
  'nav.bids': 'Bids',

  // Common Actions
  'btn.explore_marketplace': 'Explore Marketplace',
  'btn.post_demand': 'Post Demand',
  'btn.get_started_farmer': 'Get Started as Farmer',
  'btn.get_started_buyer': 'Get Started as Buyer',
  'btn.sign_in': 'Sign In',
  'btn.create_account': 'Create Account',
  'btn.place_order': 'Place Order',
  'btn.go_back': 'Go Back',
  'btn.logout': 'Logout',

  // Home Page
  'home.hero.badge': 'Smart Agriculture Platform',
  'home.hero.title': 'Connecting Farms and Markets through Data & Trust',
  'home.hero.subtitle': 'Eliminate intermediaries. Direct connection between farmers and buyers with smart demand forecasting.',
  'home.stats.active_farmers': 'Active Farmers',
  'home.stats.products_listed': 'Products Listed',
  'home.stats.orders_delivered': 'Orders Delivered',
  'home.stats.verified_farmers': 'Verified Farmers',
  'home.stats.happy_buyers': 'Happy Buyers',
  'home.stats.delivered_on_time': 'Delivered On Time',

  // Features
  'feature.post_demand.title': 'Post Demand',
  'feature.post_demand.description': 'Tell farmers exactly what you need and get instant quotes from the best suppliers',
  'feature.list_products.title': 'List Products',
  'feature.list_products.description': 'Showcase your crops directly to buyers without middlemen. Set your own prices.',
  'feature.predict_demand.title': 'Predict Demand',
  'feature.predict_demand.description': 'Use AI-powered forecasting to optimize your production and maximize profits',
  'feature.track_deliveries.title': 'Track Deliveries',
  'feature.track_deliveries.description': 'Real-time tracking ensures your products reach on time, every time',

  // Marketplace
  'marketplace.title': 'Marketplace',
  'marketplace.subtitle': 'Browse fresh products directly from farmers',
  'marketplace.search_placeholder': 'Search products, farmers, or locations...',
  'marketplace.filter_by': 'Filter by:',
  'marketplace.category.all': 'All',
  'marketplace.farmer_level': 'Level',
  'marketplace.sold': 'Sold',
  'marketplace.in_stock': 'In Stock',
  'marketplace.per_kg': 'per kg',

  // Authentication
  'auth.welcome_back': 'Welcome Back',
  'auth.sign_in_subtitle': 'Enter your phone number to access your account',
  'auth.create_account': 'Create Account',
  'auth.join_তাজা হাট': 'Join Taja Haat and start trading',
  'auth.full_name': 'Full Name',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.phone_number': 'Phone Number',
  'auth.enter_phone': 'Enter your phone number',
  'auth.phone_placeholder': '+880 1XXX XXXXXX',
  'auth.otp_code': 'OTP Code',
  'auth.enter_otp': 'Enter the 6-digit code',
  'auth.otp_placeholder': '123456',
  'auth.send_otp': 'Send OTP',
  'auth.verify_otp': 'Verify OTP',
  'auth.resend_otp': 'Resend OTP',
  'auth.otp_sent': 'OTP sent to your phone',
  'auth.forgot_password': 'Forgot password?',
  'auth.dont_have_account': "Don't have an account?",
  'auth.already_have_account': 'Already have an account?',
  'auth.sign_up': 'Sign up',
  'auth.sign_in': 'Sign in',
  'auth.i_am_a': 'I am a...',
  'auth.farmer': 'Farmer',
  'auth.buyer': 'Buyer',
  'auth.agree_terms': 'I agree to the',
  'auth.terms_of_service': 'Terms of Service',
  'auth.privacy_policy': 'Privacy Policy',
  'auth.demo_note': 'This is a demo page. Full authentication functionality can be added by connecting a backend service.',

  // Product Details
  'product.quantity_kg': 'Quantity (kg)',
  'product.contact_farmer': 'Contact Farmer',
  'product.certifications': 'Certifications',
  'product.farmer_info': 'Farmer Information',
  'product.harvest_date': 'Harvest Date',
  'product.location': 'Location',
  'product.phone': 'Phone',
  'product.order_placed': 'Order Placed!',
  'product.order_success': 'Your order has been created successfully',

  // Dashboards
  'dashboard.farmer.title': 'Farmer Dashboard',
  'dashboard.farmer.subtitle': 'Manage your farm and products',
  'dashboard.buyer.title': 'Buyer Dashboard',
  'dashboard.buyer.subtitle': 'Manage your orders and demands',
  'dashboard.expand_note': 'Continue prompting to expand this dashboard with full functionality.',

  // Forecast
  'forecast.title': 'Demand Forecast',
  'forecast.subtitle': 'AI-powered market predictions',
  'forecast.expand_note': 'Continue prompting to expand this dashboard with full chart functionality.',

  // About Page
  'about.title': 'About Taja Haat',
  'about.subtitle': 'Learn about our mission to revolutionize agriculture',
  'about.content': "This page can be further developed with more content about the platform's mission, team, and values. Continue prompting to expand this section with detailed information.",

  // Contact Page
  'contact.title': 'Contact Us',
  'contact.subtitle': 'Get in touch with our team',
  'contact.content': 'This page can be further developed with contact forms and information. Continue prompting to expand this section.',

  // Footer
  'footer.brand_tagline': 'Connecting Farms and Markets through Data & Trust.',
  'footer.quick_links': 'Quick Links',
  'footer.support': 'Support',
  'footer.contact_info': 'Contact Info',
  'footer.help_center': 'Help Center',
  'footer.all_rights_reserved': 'All rights reserved.',

  // Error Pages
  'error.page_not_found': 'Page Not Found',
  'error.go_home': 'Go Home',

  // Common
  'common.loading': 'Loading...',
  'common.close': 'Close',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.next': 'Next',
  'common.previous': 'Previous',
  'common.more': 'More',

  // User Levels
  'level.new': 'New Member',
  'level.level_1': 'Level 1',
  'level.level_2': 'Level 2',
  'level.level_3': 'Level 3',

  // Call to Action
  'cta.title': 'Ready to Join the Agricultural Revolution?',
  'cta.subtitle': 'Whether you\'re a farmer or buyer, Taja Haat provides the tools you need to succeed',
};

export type TranslationKey = keyof typeof translations;

// Simple translation function
export const t = (key: TranslationKey): string => {
  return translations[key] || key;
};

// Hook for components to use translations
export const useTranslation = () => {
  return { t };
>>>>>>> main
};
