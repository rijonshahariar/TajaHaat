import { useState, useEffect } from 'react';

export const translations = {
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
};
