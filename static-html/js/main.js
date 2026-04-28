// GrowthX Arabia - Main JavaScript
const API_BASE = (window.location.hostname.endsWith('.workers.dev') || window.location.hostname.endsWith('.pages.dev'))
  ? 'https://d646d448-bbb2-4986-ab97-03d7be64ab33-00-11agqrmvoijn7.picard.replit.dev/api'
  : '/api';

// Security: Escape HTML to prevent XSS
function escapeHtml(unsafe) {
  if (unsafe == null) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Language translations
const translations = {
  en: {
    'nav.services': 'Services',
    'nav.caseStudies': 'Case Studies',
    'nav.blog': 'Blog',
    'nav.testimonials': 'Testimonials',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    'nav.getStarted': 'Get Started',
    'hero.title': 'AI-Powered Growth for MENA Businesses',
    'hero.subtitle': 'Transform your operations with intelligent automation. We help businesses in the Middle East save time, reduce costs, and scale faster with cutting-edge AI solutions.',
    'hero.cta': 'Book Free Consultation',
    'hero.secondary': 'Explore Services',
    'hero.stat1': 'Businesses Automated',
    'hero.stat2': 'Average Time Saved',
    'hero.stat3': 'Cost Reduction',
    'services.title': 'Our Services',
    'services.subtitle': 'Comprehensive AI automation solutions tailored for Middle Eastern businesses',
    'services.workflow.title': 'Workflow Automation',
    'services.workflow.desc': 'Streamline operations with n8n and Make integrations',
    'services.chatbots.title': 'AI Chatbots & Agents',
    'services.chatbots.desc': '24/7 intelligent customer support automation',
    'services.crm.title': 'CRM Automation',
    'services.crm.desc': 'GoHighLevel powered sales pipeline automation',
    'services.analytics.title': 'Data Analytics',
    'services.analytics.desc': 'AI-driven business intelligence dashboards',
    'services.seo.title': 'AI Automated SEO',
    'services.seo.desc': 'Intelligent search engine optimization',
    'services.googleAds.title': 'AI Google Ads',
    'services.googleAds.desc': 'Automated PPC campaign management',
    'services.localSeo.title': 'AI Local SEO',
    'services.localSeo.desc': 'Google Business Profile optimization',
    'services.social.title': 'AI Social Scheduling',
    'services.social.desc': 'Automated content planning and posting',
    'process.title': 'How We Work',
    'process.subtitle': 'Our proven 4-step process to transform your business',
    'process.step1.title': 'Discovery',
    'process.step1.desc': 'We analyze your current workflows and identify automation opportunities',
    'process.step2.title': 'Strategy',
    'process.step2.desc': 'Custom automation roadmap designed for your business goals',
    'process.step3.title': 'Implementation',
    'process.step3.desc': 'Expert setup and integration of AI automation tools',
    'process.step4.title': 'Optimization',
    'process.step4.desc': 'Continuous monitoring and improvement of your automations',
    'testimonials.title': 'What Our Clients Say',
    'testimonials.subtitle': 'Trusted by leading businesses across the Middle East',
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Find answers to common questions about our services',
    'contact.title': 'Get In Touch',
    'contact.subtitle': 'Ready to transform your business? Let\'s talk about your automation needs.',
    'contact.name': 'Full Name',
    'contact.email': 'Email Address',
    'contact.company': 'Company Name',
    'contact.message': 'Message',
    'contact.submit': 'Send Message',
    'footer.description': 'Empowering MENA businesses with intelligent AI automation solutions. Transform your operations, scale faster, and stay ahead of the competition.',
    'footer.company': 'Company',
    'footer.services': 'Services',
    'footer.legal': 'Legal',
    'popup.title': 'Wait! Don\'t Miss Out',
    'popup.description': 'Get a free AI automation consultation worth $500. Discover how we can transform your business operations.',
    'popup.cta': 'Claim Free Consultation',
    'caseStudies.title': 'Our Success Stories',
    'caseStudies.subtitle': 'Discover how we\'ve helped businesses across the Middle East transform their operations with AI-powered automation solutions.',
    'caseStudies.cta.title': 'Ready to Be Our Next Success Story?',
    'caseStudies.cta.description': 'Book a free consultation and discover how AI automation can transform your business.',
    'caseStudies.cta.button': 'Start Your Transformation',
    'caseStudy.1.category': 'Technology Startup',
    'caseStudy.1.title': 'TechStart Saudi',
    'caseStudy.1.description': 'Implemented an AI-powered chatbot that handles 80% of customer inquiries automatically, reducing response time from hours to seconds.',
    'caseStudy.1.stat1': 'Auto-resolved',
    'caseStudy.1.stat2': 'Availability',
    'caseStudy.2.category': 'Logistics & Shipping',
    'caseStudy.2.title': 'Gulf Logistics',
    'caseStudy.2.description': 'Automated order processing, tracking updates, and customer notifications across 12 regional warehouses with seamless workflow integration.',
    'caseStudy.2.stat1': 'Time Saved',
    'caseStudy.2.stat2': 'Error Reduction',
    'caseStudy.3.category': 'Retail & E-commerce',
    'caseStudy.3.title': 'Dubai Retail Group',
    'caseStudy.3.description': 'AI-driven SEO optimization increased organic traffic by 200% through automated content optimization and Arabic keyword targeting.',
    'caseStudy.3.stat1': 'Traffic Growth',
    'caseStudy.3.stat2': 'Revenue Increase',
    'caseStudy.4.category': 'Real Estate',
    'caseStudy.4.title': 'Bahrain Properties',
    'caseStudy.4.description': 'Automated CRM pipeline manages 500+ leads monthly with AI-powered lead scoring, automated follow-ups, and appointment scheduling.',
    'caseStudy.4.stat1': 'More Leads',
    'caseStudy.4.stat2': 'Conversion Rate',
    'caseStudy.5.category': 'Financial Services',
    'caseStudy.5.title': 'Kuwait Finance Corp',
    'caseStudy.5.description': 'AI-powered analytics dashboard provides real-time insights across 15 data sources, enabling faster decision-making and risk assessment.',
    'caseStudy.5.stat1': 'Faster Reports',
    'caseStudy.5.stat2': 'Cost Savings',
    'caseStudy.6.category': 'Hospitality',
    'caseStudy.6.title': 'Oman Hospitality',
    'caseStudy.6.description': 'Automated social media management across 5 hotel brands with AI content generation, scheduling, and engagement tracking.',
    'caseStudy.6.stat1': 'Engagement Up',
    'caseStudy.6.stat2': 'Weekly Saved',
    'caseStudy.7.category': 'Healthcare',
    'caseStudy.7.title': 'Qatar Medical',
    'caseStudy.7.description': 'Automated lead generation and patient intake system with appointment booking, reminders, and follow-up sequences.',
    'caseStudy.7.stat1': 'More Bookings',
    'caseStudy.7.stat2': 'Show-up Rate',
    'caseStudy.8.category': 'Real Estate',
    'caseStudy.8.title': 'Riyadh Real Estate',
    'caseStudy.8.description': 'AI-optimized Google Ads campaigns with automated bidding, ad copy generation, and performance tracking across Arabic and English markets.',
    'caseStudy.8.stat1': 'Lower CPA',
    'caseStudy.8.stat2': 'ROAS',
    'caseStudy.9.category': 'Trading & Import',
    'caseStudy.9.title': 'Abu Dhabi Trading',
    'caseStudy.9.description': 'Local SEO automation for 25 store locations with automated Google Business Profile management and review response system.',
    'caseStudy.9.stat1': 'Local Visibility',
    'caseStudy.9.stat2': 'Avg. Rating',
    'caseStudy.10.category': 'E-commerce',
    'caseStudy.10.title': 'Jeddah E-commerce',
    'caseStudy.10.description': 'Full-stack automation connecting inventory, orders, customer service, marketing, and analytics into one unified intelligent system.',
    'caseStudy.10.stat1': 'Automated',
    'caseStudy.10.stat2': 'Growth',
    'funnel.title': 'Start Your AI Transformation',
    'funnel.subtitle': 'Complete the form below and our team will contact you within 24 hours with a custom automation strategy.',
    'funnel.step1Label': 'Services',
    'funnel.step2Label': 'Company',
    'funnel.step3Label': 'Project',
    'funnel.step4Label': 'Contact',
    'funnel.step1.title': 'What services are you interested in?',
    'funnel.step1.desc': 'Select all the services that match your needs',
    'funnel.step2.title': 'Tell us about your company',
    'funnel.step2.desc': 'Help us understand your business better',
    'funnel.step3.title': 'Project Requirements',
    'funnel.step3.desc': 'Tell us about your project scope and timeline',
    'funnel.step4.title': 'Contact Information',
    'funnel.step4.desc': 'How can we reach you?',
    'funnel.companyName': 'Company Name *',
    'funnel.industry': 'Industry *',
    'funnel.selectIndustry': 'Select industry',
    'funnel.industry.technology': 'Technology',
    'funnel.industry.ecommerce': 'E-commerce',
    'funnel.industry.healthcare': 'Healthcare',
    'funnel.industry.realestate': 'Real Estate',
    'funnel.industry.finance': 'Finance & Banking',
    'funnel.industry.hospitality': 'Hospitality',
    'funnel.industry.retail': 'Retail',
    'funnel.industry.logistics': 'Logistics & Shipping',
    'funnel.industry.education': 'Education',
    'funnel.industry.other': 'Other',
    'funnel.companySize': 'Company Size *',
    'funnel.selectSize': 'Select company size',
    'funnel.size.1-10': '1-10 employees',
    'funnel.size.11-50': '11-50 employees',
    'funnel.size.51-200': '51-200 employees',
    'funnel.size.201-500': '201-500 employees',
    'funnel.size.500+': '500+ employees',
    'funnel.website': 'Website URL (optional)',
    'funnel.budget': 'Budget Range *',
    'funnel.selectBudget': 'Select budget range',
    'funnel.budget.5k-10k': '$5,000 - $10,000',
    'funnel.budget.10k-25k': '$10,000 - $25,000',
    'funnel.budget.25k-50k': '$25,000 - $50,000',
    'funnel.budget.50k-100k': '$50,000 - $100,000',
    'funnel.budget.100k+': '$100,000+',
    'funnel.timeline': 'Timeline *',
    'funnel.selectTimeline': 'Select timeline',
    'funnel.timeline.immediate': 'Immediate (ASAP)',
    'funnel.timeline.1-month': 'Within 1 month',
    'funnel.timeline.1-3-months': '1-3 months',
    'funnel.timeline.3-6-months': '3-6 months',
    'funnel.timeline.6-months+': '6+ months',
    'funnel.projectDescription': 'Project Description',
    'funnel.fullName': 'Full Name *',
    'funnel.email': 'Email Address *',
    'funnel.phone': 'Phone Number *',
    'funnel.contactMethod': 'Preferred Contact Method *',
    'funnel.contactMethod.email': 'Email',
    'funnel.contactMethod.phone': 'Phone Call',
    'funnel.contactMethod.whatsapp': 'WhatsApp',
    'funnel.next': 'Next Step',
    'funnel.back': 'Back',
    'funnel.submit': 'Submit Request',
    'funnel.success.title': 'Thank You!',
    'funnel.success.message': 'Your request has been submitted successfully. Our team will review your information and contact you within 24 hours to discuss your AI automation journey.',
    'funnel.success.nextSteps': 'What happens next?',
    'funnel.success.step1': 'Our team reviews your requirements',
    'funnel.success.step2': 'We prepare a custom automation proposal',
    'funnel.success.step3': 'Schedule your free consultation call',
    'funnel.success.backHome': 'Back to Home',
    'funnel.trust.secure': '100% Secure',
    'funnel.trust.response': '24h Response',
    'funnel.trust.clients': '150+ Clients',
    'funnel.socialProof': 'Trusted by leading businesses across Saudi Arabia, UAE, Qatar, and the entire MENA region'
  },
  ar: {
    'nav.services': 'الخدمات',
    'nav.caseStudies': 'دراسات الحالة',
    'nav.blog': 'المدونة',
    'nav.testimonials': 'آراء العملاء',
    'nav.faq': 'الأسئلة الشائعة',
    'nav.contact': 'تواصل معنا',
    'nav.getStarted': 'ابدأ الآن',
    'hero.title': 'نمو مدعوم بالذكاء الاصطناعي للشركات في الشرق الأوسط',
    'hero.subtitle': 'حوّل عملياتك باستخدام الأتمتة الذكية. نساعد الشركات في الشرق الأوسط على توفير الوقت وتقليل التكاليف والتوسع بشكل أسرع.',
    'hero.cta': 'احجز استشارة مجانية',
    'hero.secondary': 'استكشف الخدمات',
    'hero.stat1': 'شركة تمت أتمتتها',
    'hero.stat2': 'متوسط توفير الوقت',
    'hero.stat3': 'تخفيض التكلفة',
    'services.title': 'خدماتنا',
    'services.subtitle': 'حلول أتمتة ذكية شاملة مصممة للشركات في الشرق الأوسط',
    'services.workflow.title': 'أتمتة سير العمل',
    'services.workflow.desc': 'تبسيط العمليات باستخدام n8n و Make',
    'services.chatbots.title': 'روبوتات الدردشة الذكية',
    'services.chatbots.desc': 'دعم عملاء ذكي على مدار الساعة',
    'services.crm.title': 'أتمتة إدارة العملاء',
    'services.crm.desc': 'أتمتة خط المبيعات بقوة GoHighLevel',
    'services.analytics.title': 'تحليلات البيانات',
    'services.analytics.desc': 'لوحات معلومات ذكية للأعمال',
    'services.seo.title': 'تحسين محركات البحث',
    'services.seo.desc': 'تحسين ذكي لمحركات البحث',
    'services.googleAds.title': 'إعلانات جوجل الآلية',
    'services.googleAds.desc': 'إدارة حملات PPC الآلية',
    'services.localSeo.title': 'تحسين البحث المحلي',
    'services.localSeo.desc': 'تحسين ملف جوجل للأعمال',
    'services.social.title': 'جدولة وسائل التواصل',
    'services.social.desc': 'تخطيط ونشر المحتوى الآلي',
    'process.title': 'كيف نعمل',
    'process.subtitle': 'عمليتنا المثبتة من 4 خطوات لتحويل عملك',
    'process.step1.title': 'الاكتشاف',
    'process.step1.desc': 'نحلل سير العمل الحالي ونحدد فرص الأتمتة',
    'process.step2.title': 'الاستراتيجية',
    'process.step2.desc': 'خارطة طريق أتمتة مخصصة لأهداف عملك',
    'process.step3.title': 'التنفيذ',
    'process.step3.desc': 'إعداد ودمج أدوات الأتمتة الذكية',
    'process.step4.title': 'التحسين',
    'process.step4.desc': 'مراقبة وتحسين مستمر للأتمتة',
    'testimonials.title': 'ماذا يقول عملاؤنا',
    'testimonials.subtitle': 'موثوق من قبل الشركات الرائدة في الشرق الأوسط',
    'faq.title': 'الأسئلة الشائعة',
    'faq.subtitle': 'اعثر على إجابات للأسئلة الشائعة حول خدماتنا',
    'contact.title': 'تواصل معنا',
    'contact.subtitle': 'هل أنت مستعد لتحويل عملك؟ لنتحدث عن احتياجات الأتمتة الخاصة بك.',
    'contact.name': 'الاسم الكامل',
    'contact.email': 'البريد الإلكتروني',
    'contact.company': 'اسم الشركة',
    'contact.message': 'الرسالة',
    'contact.submit': 'إرسال الرسالة',
    'footer.description': 'تمكين شركات الشرق الأوسط بحلول أتمتة ذكية. حوّل عملياتك وتوسّع أسرع.',
    'footer.company': 'الشركة',
    'footer.services': 'الخدمات',
    'footer.legal': 'قانوني',
    'popup.title': 'انتظر! لا تفوت الفرصة',
    'popup.description': 'احصل على استشارة مجانية للأتمتة الذكية بقيمة 500 دولار. اكتشف كيف يمكننا تحويل عمليات عملك.',
    'popup.cta': 'احصل على الاستشارة المجانية',
    'caseStudies.title': 'قصص نجاحنا',
    'caseStudies.subtitle': 'اكتشف كيف ساعدنا الشركات في جميع أنحاء الشرق الأوسط على تحويل عملياتها بحلول الأتمتة المدعومة بالذكاء الاصطناعي.',
    'caseStudies.cta.title': 'هل أنت مستعد لتكون قصة نجاحنا التالية؟',
    'caseStudies.cta.description': 'احجز استشارة مجانية واكتشف كيف يمكن للأتمتة الذكية تحويل عملك.',
    'caseStudies.cta.button': 'ابدأ تحولك',
    'caseStudy.1.category': 'شركة تقنية ناشئة',
    'caseStudy.1.title': 'تيك ستارت السعودية',
    'caseStudy.1.description': 'تنفيذ روبوت دردشة ذكي يتعامل مع 80% من استفسارات العملاء تلقائياً، مما يقلل وقت الاستجابة من ساعات إلى ثوانٍ.',
    'caseStudy.1.stat1': 'حل تلقائي',
    'caseStudy.1.stat2': 'متاح',
    'caseStudy.2.category': 'الخدمات اللوجستية',
    'caseStudy.2.title': 'الخليج للخدمات اللوجستية',
    'caseStudy.2.description': 'أتمتة معالجة الطلبات وتحديثات التتبع وإشعارات العملاء عبر 12 مستودعاً إقليمياً مع تكامل سلس لسير العمل.',
    'caseStudy.2.stat1': 'توفير الوقت',
    'caseStudy.2.stat2': 'تقليل الأخطاء',
    'caseStudy.3.category': 'التجزئة والتجارة الإلكترونية',
    'caseStudy.3.title': 'مجموعة دبي للتجزئة',
    'caseStudy.3.description': 'تحسين SEO بالذكاء الاصطناعي زاد حركة المرور العضوية بنسبة 200% من خلال تحسين المحتوى واستهداف الكلمات المفتاحية العربية.',
    'caseStudy.3.stat1': 'نمو الزيارات',
    'caseStudy.3.stat2': 'زيادة الإيرادات',
    'caseStudy.4.category': 'العقارات',
    'caseStudy.4.title': 'عقارات البحرين',
    'caseStudy.4.description': 'نظام CRM آلي يدير أكثر من 500 عميل محتمل شهرياً مع تسجيل ذكي للعملاء ومتابعات آلية وجدولة المواعيد.',
    'caseStudy.4.stat1': 'عملاء أكثر',
    'caseStudy.4.stat2': 'معدل التحويل',
    'caseStudy.5.category': 'الخدمات المالية',
    'caseStudy.5.title': 'شركة الكويت للتمويل',
    'caseStudy.5.description': 'لوحة تحليلات ذكية توفر رؤى فورية عبر 15 مصدر بيانات، مما يتيح اتخاذ قرارات أسرع وتقييم المخاطر.',
    'caseStudy.5.stat1': 'تقارير أسرع',
    'caseStudy.5.stat2': 'توفير التكاليف',
    'caseStudy.6.category': 'الضيافة',
    'caseStudy.6.title': 'عُمان للضيافة',
    'caseStudy.6.description': 'إدارة وسائل التواصل الاجتماعي الآلية لـ 5 علامات فندقية مع إنشاء المحتوى بالذكاء الاصطناعي والجدولة وتتبع التفاعل.',
    'caseStudy.6.stat1': 'زيادة التفاعل',
    'caseStudy.6.stat2': 'توفير أسبوعي',
    'caseStudy.7.category': 'الرعاية الصحية',
    'caseStudy.7.title': 'قطر الطبية',
    'caseStudy.7.description': 'نظام آلي لتوليد العملاء واستقبال المرضى مع حجز المواعيد والتذكيرات وتسلسلات المتابعة.',
    'caseStudy.7.stat1': 'حجوزات أكثر',
    'caseStudy.7.stat2': 'نسبة الحضور',
    'caseStudy.8.category': 'العقارات',
    'caseStudy.8.title': 'عقارات الرياض',
    'caseStudy.8.description': 'حملات إعلانات جوجل محسنة بالذكاء الاصطناعي مع عروض أسعار آلية وإنشاء نصوص إعلانية وتتبع الأداء عبر الأسواق العربية والإنجليزية.',
    'caseStudy.8.stat1': 'تكلفة أقل',
    'caseStudy.8.stat2': 'عائد الإنفاق',
    'caseStudy.9.category': 'التجارة والاستيراد',
    'caseStudy.9.title': 'أبوظبي للتجارة',
    'caseStudy.9.description': 'أتمتة SEO المحلي لـ 25 موقع متجر مع إدارة آلية لملف جوجل للأعمال ونظام الرد على المراجعات.',
    'caseStudy.9.stat1': 'الظهور المحلي',
    'caseStudy.9.stat2': 'متوسط التقييم',
    'caseStudy.10.category': 'التجارة الإلكترونية',
    'caseStudy.10.title': 'جدة للتجارة الإلكترونية',
    'caseStudy.10.description': 'أتمتة شاملة تربط المخزون والطلبات وخدمة العملاء والتسويق والتحليلات في نظام ذكي موحد.',
    'caseStudy.10.stat1': 'مؤتمت',
    'caseStudy.10.stat2': 'النمو',
    'funnel.title': 'ابدأ تحولك الرقمي بالذكاء الاصطناعي',
    'funnel.subtitle': 'أكمل النموذج أدناه وسيتواصل معك فريقنا خلال 24 ساعة بخطة أتمتة مخصصة.',
    'funnel.step1Label': 'الخدمات',
    'funnel.step2Label': 'الشركة',
    'funnel.step3Label': 'المشروع',
    'funnel.step4Label': 'التواصل',
    'funnel.step1.title': 'ما الخدمات التي تهمك؟',
    'funnel.step1.desc': 'اختر جميع الخدمات التي تناسب احتياجاتك',
    'funnel.step2.title': 'أخبرنا عن شركتك',
    'funnel.step2.desc': 'ساعدنا على فهم عملك بشكل أفضل',
    'funnel.step3.title': 'متطلبات المشروع',
    'funnel.step3.desc': 'أخبرنا عن نطاق مشروعك والجدول الزمني',
    'funnel.step4.title': 'معلومات التواصل',
    'funnel.step4.desc': 'كيف يمكننا الوصول إليك؟',
    'funnel.companyName': 'اسم الشركة *',
    'funnel.industry': 'القطاع *',
    'funnel.selectIndustry': 'اختر القطاع',
    'funnel.industry.technology': 'التكنولوجيا',
    'funnel.industry.ecommerce': 'التجارة الإلكترونية',
    'funnel.industry.healthcare': 'الرعاية الصحية',
    'funnel.industry.realestate': 'العقارات',
    'funnel.industry.finance': 'المالية والبنوك',
    'funnel.industry.hospitality': 'الضيافة',
    'funnel.industry.retail': 'التجزئة',
    'funnel.industry.logistics': 'الخدمات اللوجستية والشحن',
    'funnel.industry.education': 'التعليم',
    'funnel.industry.other': 'أخرى',
    'funnel.companySize': 'حجم الشركة *',
    'funnel.selectSize': 'اختر حجم الشركة',
    'funnel.size.1-10': '1-10 موظفين',
    'funnel.size.11-50': '11-50 موظف',
    'funnel.size.51-200': '51-200 موظف',
    'funnel.size.201-500': '201-500 موظف',
    'funnel.size.500+': '500+ موظف',
    'funnel.website': 'رابط الموقع (اختياري)',
    'funnel.budget': 'نطاق الميزانية *',
    'funnel.selectBudget': 'اختر نطاق الميزانية',
    'funnel.budget.5k-10k': '$5,000 - $10,000',
    'funnel.budget.10k-25k': '$10,000 - $25,000',
    'funnel.budget.25k-50k': '$25,000 - $50,000',
    'funnel.budget.50k-100k': '$50,000 - $100,000',
    'funnel.budget.100k+': '$100,000+',
    'funnel.timeline': 'الجدول الزمني *',
    'funnel.selectTimeline': 'اختر الجدول الزمني',
    'funnel.timeline.immediate': 'فوري (في أسرع وقت)',
    'funnel.timeline.1-month': 'خلال شهر واحد',
    'funnel.timeline.1-3-months': '1-3 أشهر',
    'funnel.timeline.3-6-months': '3-6 أشهر',
    'funnel.timeline.6-months+': '6+ أشهر',
    'funnel.projectDescription': 'وصف المشروع',
    'funnel.fullName': 'الاسم الكامل *',
    'funnel.email': 'البريد الإلكتروني *',
    'funnel.phone': 'رقم الهاتف *',
    'funnel.contactMethod': 'طريقة التواصل المفضلة *',
    'funnel.contactMethod.email': 'البريد الإلكتروني',
    'funnel.contactMethod.phone': 'مكالمة هاتفية',
    'funnel.contactMethod.whatsapp': 'واتساب',
    'funnel.next': 'الخطوة التالية',
    'funnel.back': 'رجوع',
    'funnel.submit': 'إرسال الطلب',
    'funnel.success.title': 'شكراً لك!',
    'funnel.success.message': 'تم إرسال طلبك بنجاح. سيراجع فريقنا معلوماتك ويتواصل معك خلال 24 ساعة لمناقشة رحلة الأتمتة الذكية.',
    'funnel.success.nextSteps': 'ماذا يحدث بعد ذلك؟',
    'funnel.success.step1': 'فريقنا يراجع متطلباتك',
    'funnel.success.step2': 'نعد مقترح أتمتة مخصص',
    'funnel.success.step3': 'جدولة مكالمة استشارة مجانية',
    'funnel.success.backHome': 'العودة للرئيسية',
    'funnel.trust.secure': 'آمن 100%',
    'funnel.trust.response': 'رد خلال 24 ساعة',
    'funnel.trust.clients': '150+ عميل',
    'funnel.socialProof': 'موثوق من قبل الشركات الرائدة في السعودية والإمارات وقطر وجميع أنحاء الشرق الأوسط'
  }
};

// Current language
let currentLang = localStorage.getItem('language') || 'en';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initFAQ();
  initContactForm();
  initExitIntent();
  initSmoothScroll();
});

// Language functions
function initLanguage() {
  applyLanguage(currentLang);
  
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'ar' : 'en';
      localStorage.setItem('language', currentLang);
      applyLanguage(currentLang);
    });
  }
}

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

// FAQ Accordion
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const isActive = item.classList.contains('active');
      
      // Close all other items
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// Contact Form
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      name: form.name.value,
      email: form.email.value,
      company: form.company.value,
      message: form.message.value
    };
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...';
    
    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert(currentLang === 'ar' ? 'شكراً لتواصلك معنا! سنرد عليك قريباً.' : 'Thank you for contacting us! We\'ll get back to you soon.');
        form.reset();
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      alert(currentLang === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// Newsletter Form
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = form.querySelector('input[type="email"]').value;
    
    try {
      const response = await fetch(`${API_BASE}/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (response.ok) {
        alert(currentLang === 'ar' ? 'شكراً لاشتراكك!' : 'Thank you for subscribing!');
        form.reset();
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      alert(currentLang === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.');
    }
  });
}

// Exit Intent Popup
function initExitIntent() {
  const popup = document.getElementById('exit-popup');
  const closeBtn = document.getElementById('popup-close');
  
  if (!popup) return;
  
  // Check if already shown
  if (localStorage.getItem('exitPopupShown')) return;
  
  // Show on mouse leave (top of page)
  document.addEventListener('mouseout', (e) => {
    if (e.clientY < 10 && !localStorage.getItem('exitPopupShown')) {
      showPopup();
    }
  });
  
  // Fallback: Show after 30 seconds
  setTimeout(() => {
    if (!localStorage.getItem('exitPopupShown')) {
      showPopup();
    }
  }, 30000);
  
  function showPopup() {
    popup.classList.add('active');
    localStorage.setItem('exitPopupShown', 'true');
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      popup.classList.remove('active');
    });
  }
  
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.classList.remove('active');
    }
  });
}

// Smooth Scroll
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Lead Funnel Functions (for get-started.html)
let currentStep = 1;
let selectedService = '';
let leadData = {};

function selectService(service) {
  selectedService = service;
  document.querySelectorAll('.service-option').forEach(opt => {
    opt.classList.remove('selected');
    if (opt.getAttribute('data-service') === service) {
      opt.classList.add('selected');
    }
  });
}

function nextStep() {
  if (currentStep === 1 && !selectedService) {
    alert(currentLang === 'ar' ? 'يرجى اختيار خدمة' : 'Please select a service');
    return;
  }
  
  // Save current step data
  saveStepData();
  
  currentStep++;
  updateStepUI();
}

function prevStep() {
  currentStep--;
  updateStepUI();
}

function saveStepData() {
  const form = document.getElementById('lead-form');
  if (!form) return;
  
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    if (input.name) {
      leadData[input.name] = input.value;
    }
  });
  
  if (selectedService) {
    leadData.service = selectedService;
  }
}

function updateStepUI() {
  // Update step indicators
  document.querySelectorAll('.funnel-step').forEach((step, index) => {
    step.classList.remove('active', 'completed');
    if (index + 1 === currentStep) {
      step.classList.add('active');
    } else if (index + 1 < currentStep) {
      step.classList.add('completed');
    }
  });
  
  // Show/hide step content
  document.querySelectorAll('.step-content').forEach((content, index) => {
    content.style.display = index + 1 === currentStep ? 'block' : 'none';
  });
}

async function submitLead() {
  saveStepData();
  
  const submitBtn = document.querySelector('button[onclick="submitLead()"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = currentLang === 'ar' ? 'جاري الإرسال...' : 'Submitting...';
  }
  
  try {
    const response = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });
    
    if (response.ok) {
      // Show success
      document.getElementById('lead-form').style.display = 'none';
      document.getElementById('success-message').style.display = 'block';
    } else {
      throw new Error('Failed to submit');
    }
  } catch (error) {
    alert(currentLang === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = currentLang === 'ar' ? 'إرسال' : 'Submit';
    }
  }
}

// Admin Functions (for admin.html)
let adminData = { leads: [], contacts: [], newsletters: [] };
let currentTab = 'leads';

async function initAdmin() {
  // Check if logged in
  const isLoggedIn = await checkAuth();
  if (!isLoggedIn) {
    showLoginForm();
    return;
  }
  
  await loadAdminData();
  renderAdminTabs();
}

async function checkAuth() {
  try {
    const response = await fetch(`${API_BASE}/user`, { credentials: 'include' });
    return response.ok;
  } catch {
    return false;
  }
}

function showLoginForm() {
  document.getElementById('admin-content').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
}

async function adminLogin(e) {
  e.preventDefault();
  const form = e.target;
  
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        username: form.username.value,
        password: form.password.value
      })
    });
    
    if (response.ok) {
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('admin-content').style.display = 'block';
      await loadAdminData();
      renderAdminTabs();
    } else {
      alert('Invalid credentials');
    }
  } catch (error) {
    alert('Login failed');
  }
}

async function adminLogout() {
  await fetch(`${API_BASE}/logout`, { method: 'POST', credentials: 'include' });
  location.reload();
}

async function loadAdminData() {
  try {
    const [leads, contacts, newsletters] = await Promise.all([
      fetch(`${API_BASE}/leads`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${API_BASE}/contact`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${API_BASE}/newsletter`, { credentials: 'include' }).then(r => r.json())
    ]);
    
    adminData = { leads, contacts, newsletters };
    updateStats();
  } catch (error) {
    console.error('Failed to load admin data:', error);
  }
}

function updateStats() {
  document.getElementById('stat-leads').textContent = adminData.leads.length;
  document.getElementById('stat-contacts').textContent = adminData.contacts.length;
  document.getElementById('stat-newsletters').textContent = adminData.newsletters.length;
}

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.admin-tab').forEach(t => {
    t.classList.toggle('active', t.getAttribute('data-tab') === tab);
  });
  renderTable();
}

function renderAdminTabs() {
  renderTable();
}

function renderTable() {
  const container = document.getElementById('table-container');
  let html = '';
  
  switch (currentTab) {
    case 'leads':
      html = `
        <table class="admin-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${adminData.leads.map(lead => `
              <tr>
                <td>${escapeHtml(lead.serviceInterest) || '-'}</td>
                <td>${escapeHtml(lead.fullName) || '-'}</td>
                <td>${escapeHtml(lead.email) || '-'}</td>
                <td>${escapeHtml(lead.companyName) || '-'}</td>
                <td>${new Date(lead.createdAt).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      break;
    case 'contacts':
      html = `
        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${adminData.contacts.map(contact => `
              <tr>
                <td>${escapeHtml(contact.name)}</td>
                <td>${escapeHtml(contact.email)}</td>
                <td>${escapeHtml(contact.company) || '-'}</td>
                <td>${escapeHtml(contact.message.substring(0, 50))}...</td>
                <td>${new Date(contact.createdAt).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      break;
    case 'newsletters':
      html = `
        <table class="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Subscribed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${adminData.newsletters.map(sub => `
              <tr>
                <td>${escapeHtml(sub.email)}</td>
                <td>${new Date(sub.subscribedAt).toLocaleDateString()}</td>
                <td><button class="btn btn-outline" onclick="deleteNewsletter(${parseInt(sub.id, 10)})">Delete</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      break;
  }
  
  container.innerHTML = html;
}

async function deleteNewsletter(id) {
  if (!confirm('Are you sure you want to delete this subscriber?')) return;
  
  try {
    await fetch(`${API_BASE}/newsletter/${id}`, { 
      method: 'DELETE',
      credentials: 'include'
    });
    await loadAdminData();
    renderTable();
  } catch (error) {
    alert('Failed to delete');
  }
}
