import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = {
  fr: { name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  ar: { name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  en: { name: 'English', flag: '🇬🇧', dir: 'ltr' },
};

const translations = {
  fr: {
    // Navbar
    navHome: 'Accueil',
    navAnalyze: 'Analyser',
    navDashboard: 'Tableau de bord',
    startAnalysis: 'Démarrer l\'Analyse',
    
    // Home
    heroBadge: 'Propulsé par Google Gemini AI',
    heroTitlePrefix: 'Votre Assistant de ',
    heroTitleSuffix: 'Carrière IA',
    heroDesc: 'Téléchargez votre CV, collez une offre d\'emploi et laissez l\'IA analyser votre compatibilité, rédiger votre lettre de motivation et vous préparer aux entretiens.',
    startFreeAnalysis: 'Lancer l\'analyse gratuite',
    viewDashboard: 'Voir le tableau de bord',
    noSignUpRequired: 'Sans inscription requis',
    securePrivate: 'Sécurisé et confidentiel',
    lovedBySeekers: 'Adopté par les candidats',
    freeToUse: '100% Gratuit',
    poweredAnalysis: 'Analyse par IA',
    instantResults: '< 1 min Résultats',
    howItWorks: 'Comment ça marche',
    threeStepsTitle: 'Commencez en ',
    threeStepsHighlight: 'trois étapes',
    threeStepsDesc: 'Du CV aux conseils personnalisés en moins d\'une minute.',
    step1Title: 'Téléchargez votre CV',
    step1Desc: 'Déposez votre CV au format PDF et indiquez vos compétences et diplômes.',
    step2Title: 'Fournissez l\'offre',
    step2Desc: 'Collez le texte ou téléchargez le PDF de l\'offre d\'emploi.',
    step3Title: 'Obtenez les résultats IA',
    step3Desc: 'Recevez l\'analyse détaillée, la feuille de route, la lettre et le jeu d\'entretien.',
    featuresSection: 'Fonctionnalités',
    everythingYouNeed: 'Tout ce dont vous avez ',
    needHighlight: 'besoin',
    featuresDesc: 'Des outils IA complets pour réussir votre recherche d\'emploi.',
    readyToLand: 'Prêt à décrocher le poste de vos rêves ?',
    readyDesc: 'Aucune inscription requise. Téléchargez votre CV et obtenez des conseils IA instantanés.',
    analyzeCvNow: 'Analyser mon CV maintenant',

    // Analyze Page
    analyzePageTitle: 'Analysez votre ',
    applicationHighlight: 'Candidature',
    analyzePageDesc: 'Téléchargez votre CV, vos compétences et l\'offre d\'emploi (texte ou PDF) pour une analyse IA complète.',
    targetLanguageLabel: 'Langue de réponse de l\'IA',
    targetLanguageDesc: 'Choisissez la langue dans laquelle l\'IA générera l\'analyse et les documents',
    uploadCvTitle: 'Téléchargez votre CV',
    uploadCvSub: 'Format PDF, max 4.5 Mo',
    dragDropCv: 'Glissez-déposez votre CV ici',
    clickToBrowse: 'ou cliquez pour parcourir les fichiers',
    skillsTitle: 'Compétences',
    skillsSub: 'Compétences techniques et humaines',
    skillsPlaceholder: 'ex: React, Node.js, Python, Gestion de projet, Agile...',
    educationTitle: 'Diplômes & Formations',
    educationSub: 'Vos diplômes et certifications',
    educationPlaceholder: 'ex: Master Informatique, Certification AWS, Google Analytics...',
    jobOfferTitle: 'Offre d\'emploi',
    jobOfferSub: 'Fournissez les détails du poste à analyser',
    uploadPdfMode: 'Télécharger PDF',
    pasteTextMode: 'Coller le Texte',
    dragDropJobPdf: 'Glissez-déposez le PDF de l\'offre ici',
    jobDescriptionPlaceholder: 'Collez l\'offre d\'emploi complète ici... Incluez les exigences, responsabilités et qualifications requises.',
    analyzeWithAi: 'Analyser avec l\'IA',
    analyzingOverlayTitle: 'Analyse de votre profil en cours...',
    analyzingOverlaySub: 'Notre IA compare votre CV avec les exigences du poste',

    // Results Page
    backToNewAnalysis: 'Nouvelle Analyse',
    generateCoverLetterBtn: 'Générer Lettre de Motivation',
    mockInterviewBtn: 'Entretien Simulé IA',
    tabOverview: 'Vue d\'ensemble',
    tabRoadmap: 'Feuille de Route IA',
    tabSkills: 'Compétences Manquantes',
    tabWeaknesses: 'Points Faibles CV',
    tabRecommendations: 'Conseils & Recommandations',
    tabQuestions: 'Questions d\'Entretien',
    roadmapTitle: 'Feuille de Route d\'Apprentissage Sur-Mesure',
    roadmapDesc: 'Plan personnalisé généré par l\'IA pour acquérir les compétences prioritaires.',
    progression: 'Progression :',
    technologiesLabel: 'Technos :',
    actionItemLabel: 'Projet Pratique Recommandé :',
    yourStrengths: 'Vos Points Forts',
    priority: 'Priorité :',
    high: 'Haute',
    medium: 'Moyenne',
    low: 'Basse',

    // Cover Letter Page
    backToResults: 'Retour aux résultats',
    coverLetterTitle: 'Lettre de Motivation',
    craftingCoverLetter: 'Rédaction de votre lettre de motivation...',
    aiWritingLetter: 'L\'IA rédige une lettre personnalisée et percutante...',
    previewBtn: 'Aperçu',
    editBtn: 'Éditer',
    regenerateBtn: 'Régénérer',
    copyBtn: 'Copier',
    copiedBtn: 'Copié !',
    downloadBtn: 'Télécharger',

    // Interview Page
    aiRecruiter: 'Recruteur IA',
    mockSession: 'Session d\'entretien simulé',
    interviewCompleteHeader: 'Entretien Terminé !',
    preparingInterview: 'Préparation de l\'entretien...',
    aiReviewingProfile: 'Le recruteur IA examine votre profil...',
    typeAnswerPlaceholder: 'Saisissez votre réponse...',
    overallPerformance: 'Performance Globale',
    recommendedHire: '✅ Candidat Recommandé',
    worthConsidering: '🤔 À Considérer',
    needsImprovement: '⚠️ Améliorations Nécessaires',
    areasToImprove: 'Axes d\'Amélioration',
    voiceInput: 'Saisie vocale',
    listening: 'Écoute en cours...',
    speechNotSupported: 'La reconnaissance vocale n\'est pas supportée par votre navigateur (essayez Chrome ou Edge).',
    micPermissionDenied: 'Accès au microphone refusé. Cliquez sur l\'icône de cadenas dans la barre d\'adresse pour autoriser le micro.',
    noMicFound: 'Aucun microphone actif détecté sur votre ordinateur.',

    // Dashboard Page
    dashboardTitle: 'Tableau de Bord',
    dashboardSub: 'Historique de vos analyses',
    newAnalysisBtn: 'Nouvelle Analyse',
    noAnalysesYet: 'Aucune analyse pour le moment',
    noAnalysesDesc: 'Téléchargez votre CV et une offre d\'emploi pour obtenir votre première analyse IA.',
    startFirstAnalysis: 'Démarrer ma première analyse',
    untitledAnalysis: 'Analyse sans titre',

    // Misc
    errorTitle: 'Erreur',
    tryAgain: 'Réessayer',
  },

  ar: {
    // Navbar
    navHome: 'الرئيسية',
    navAnalyze: 'تحليل',
    navDashboard: 'لوحة التحكم',
    startAnalysis: 'بدء التحليل',
    
    // Home
    heroBadge: 'مدعوم بالذكاء الاصطناعي Google Gemini',
    heroTitlePrefix: 'مساعدك المهني ',
    heroTitleSuffix: 'بالذكاء الاصطناعي',
    heroDesc: 'قم بتحميل سيرتك الذاتية، وأضف تفاصيل العرض الوظيفي، ودع الذكاء الاصطناعي يحلل التوافق ويكتب خطاب التغطية ويعدك للمقابلات.',
    startFreeAnalysis: 'بدء التحليل المجاني',
    viewDashboard: 'عرض لوحة التحكم',
    noSignUpRequired: 'بدون التسجيل المطلوبة',
    securePrivate: 'آمن ومحمي تماماً',
    lovedBySeekers: 'معتمد من قبل الباحثين عن عمل',
    freeToUse: '100% مجاني',
    poweredAnalysis: 'تحليل بالذكاء الاصطناعي',
    instantResults: '< 1 دقيقة نتائج فورية',
    howItWorks: 'كيف يعمل البرنامج',
    threeStepsTitle: 'ابدأ في ',
    threeStepsHighlight: 'ثلاث خطوات',
    threeStepsDesc: 'من السيرة الذاتية إلى نتائج التحليل المخصصة في أقل من دقيقة.',
    step1Title: 'رفع السيرة الذاتية',
    step1Desc: 'قم بصيغة PDF وإضافة مهاراتك ومؤهلاتك.',
    step2Title: 'إضافة العرض الوظيفي',
    step2Desc: 'الصق النص الوظيفي أو قم برفع ملف العرض بصيغة PDF.',
    step3Title: 'احصل على التحليل',
    step3Desc: 'استلم تقريراً شاملاً وخطة تعلم وخطاب تغطية ومقابلة افتراضية.',
    featuresSection: 'المميزات',
    everythingYouNeed: 'كل ما تحتاجه ',
    needHighlight: 'للنجاح',
    featuresDesc: 'أدوات ذكية وشاملة لمساعدتك في الحصول على الوظيفة المناسبة.',
    readyToLand: 'هل أنت مستعد للحصول على وظيفة أحلامك؟',
    readyDesc: 'لا يتطلب أي تسجيل. ارفع سيرتك الذاتية واحصل على تحليل فوري.',
    analyzeCvNow: 'حلل سيرتي الذاتية الآن',

    // Analyze Page
    analyzePageTitle: 'تحليل ',
    applicationHighlight: 'طلب التوظيف',
    analyzePageDesc: 'ارفع سيرتك الذاتية وأضف معلوماتك والعرض الوظيفي للحصول على تقييم شامل بالذكاء الاصطناعي.',
    targetLanguageLabel: 'لغة استجابة الذكاء الاصطناعي',
    targetLanguageDesc: 'اختر اللغة التي سيتم توليد التحليل والوثائق بها',
    uploadCvTitle: 'رفع السيرة الذاتية',
    uploadCvSub: 'صيغة PDF، الحد الأقصى 4.5 ميجابايت',
    dragDropCv: 'اسحب وأسقط ملف السيرة الذاتية هنا',
    clickToBrowse: 'أو انقر لاختيار الملف من جهازك',
    skillsTitle: 'المهارات',
    skillsSub: 'المهارات التقنية والشخصية',
    skillsPlaceholder: 'مثال: React, Node.js, Python, قيادة الفريق, Agile...',
    educationTitle: 'المؤهلات والشهادات',
    educationSub: 'درجاتك العلمية والشهادات المهنية',
    educationPlaceholder: 'مثال: بكالوريوس علوم الحاسب، شهادة AWS، Google Analytics...',
    jobOfferTitle: 'العرض الوظيفي',
    jobOfferSub: 'أدخل تفاصيل الوظيفة للمقارنة',
    uploadPdfMode: 'رفع PDF',
    pasteTextMode: 'لصق النص',
    dragDropJobPdf: 'اسحب وأسقط ملف العرض الوظيفي PDF هنا',
    jobDescriptionPlaceholder: 'الصق الوصف الوظيفي الكامل هنا... يتضمن المتطلبات والمسؤوليات والمؤهلات المطلوبة.',
    analyzeWithAi: 'بدء التحليل الذكي',
    analyzingOverlayTitle: 'جاري تحليل ملفك الشخصي...',
    analyzingOverlaySub: 'يقوم الذكاء الاصطناعي بمقارنة سيرتك الذاتية مع متطلبات الوظيفة',

    // Results Page
    backToNewAnalysis: 'تحليل جديد',
    generateCoverLetterBtn: 'إنشاء خطاب التغطية',
    mockInterviewBtn: 'مقابلة شخصية افتراضية',
    tabOverview: 'نظرة عامة',
    tabRoadmap: 'خطة التعلم الذكية',
    tabSkills: 'المهارات المفقودة',
    tabWeaknesses: 'نقاط الضعف',
    tabRecommendations: 'التوصيات',
    tabQuestions: 'أسئلة المقابلة',
    roadmapTitle: 'خطة التعلم والتدريب المخصصة',
    roadmapDesc: 'خطة عمل مخصصة من الذكاء الاصطناعي لاكتساب المهارات المطلوبة للوظيفة.',
    progression: 'نسبة التقدم:',
    technologiesLabel: 'التقنيات:',
    actionItemLabel: 'مشروع عملي مقترح:',
    yourStrengths: 'نقاط القوة لديك',
    priority: 'الأولوية:',
    high: 'عالية',
    medium: 'متوسطة',
    low: 'منخفضة',

    // Cover Letter Page
    backToResults: 'العودة للنتائج',
    coverLetterTitle: 'خطاب التغطية',
    craftingCoverLetter: 'جاري صياغة خطاب التغطية...',
    aiWritingLetter: 'الذكاء الاصطناعي يكتب خطاباً احترافياً ومخصصاً لك...',
    previewBtn: 'معاينة',
    editBtn: 'تعديل',
    regenerateBtn: 'إعادة إنشاء',
    copyBtn: 'نسخ',
    copiedBtn: 'تم النسخ!',
    downloadBtn: 'تحميل',

    // Interview Page
    aiRecruiter: 'مسؤول التوظيف الذكي',
    mockSession: 'جلسة مقابلة افتراضية',
    interviewCompleteHeader: 'انتهت المقابلة!',
    preparingInterview: 'جاري تحضير المقابلة...',
    aiReviewingProfile: 'يقوم مسؤول التوظيف بالاطلاع على ملفك...',
    typeAnswerPlaceholder: 'اكتب إجابتك هنا...',
    overallPerformance: 'الأداء العام',
    recommendedHire: '✅ مرشح موصى به',
    worthConsidering: '🤔 يستحق النظر',
    needsImprovement: '⚠️ يحتاج إلى تحسين',
    areasToImprove: 'مجالات التحسين',
    voiceInput: 'إدخال صوتي',
    listening: 'جاري الاستماع...',
    speechNotSupported: 'التعرف على الصوت غير مدعوم في متصفحك (جرب Chrome أو Edge).',
    micPermissionDenied: 'تم رفض إذن المايكروفون. انقر على أيقونة القفل في شريط العنوان للسماح بالمايكروفون.',
    noMicFound: 'لم يتم العثور على مايكروفون متصل بالكمبيوتر.',

    // Dashboard Page
    dashboardTitle: 'لوحة التحكم',
    dashboardSub: 'سجل التحليلات السابقة',
    newAnalysisBtn: 'تحليل جديد',
    noAnalysesYet: 'لا توجد تحليلات سابقة',
    noAnalysesDesc: 'ابدأ برفع سيرتك الذاتية وعرض وظيفي للحصول على تقييمات بالذكاء الاصطناعي.',
    startFirstAnalysis: 'ابدأ تحليلك الأول',
    untitledAnalysis: 'تحليل بدون عنوان',

    // Misc
    errorTitle: 'خطأ',
    tryAgain: 'إعادة المحاولة',
  },

  en: {
    // Navbar
    navHome: 'Home',
    navAnalyze: 'Analyze',
    navDashboard: 'Dashboard',
    startAnalysis: 'Start Analysis',
    
    // Home
    heroBadge: 'Powered by Google Gemini AI',
    heroTitlePrefix: 'Your AI ',
    heroTitleSuffix: 'Career Assistant',
    heroDesc: 'Upload your CV, paste a job offer, and let AI analyze your compatibility, craft your cover letter, and prepare you for the interview.',
    startFreeAnalysis: 'Start Free Analysis',
    viewDashboard: 'View Dashboard',
    noSignUpRequired: 'No sign-up required',
    securePrivate: 'Secure & private',
    lovedBySeekers: 'Loved by job seekers',
    freeToUse: '100% Free',
    poweredAnalysis: 'AI Powered Analysis',
    instantResults: '< 1min Instant Results',
    howItWorks: 'How it works',
    threeStepsTitle: 'Get started in ',
    threeStepsHighlight: 'three steps',
    threeStepsDesc: 'From CV to job offer insights in under a minute.',
    step1Title: 'Upload Your CV',
    step1Desc: 'Drop your PDF resume and add your skills & education.',
    step2Title: 'Paste the Job Offer',
    step2Desc: 'Copy the job description text or upload job PDF.',
    step3Title: 'Get AI Insights',
    step3Desc: 'Receive detailed analysis, cover letter, and interview prep.',
    featuresSection: 'Features',
    everythingYouNeed: 'Everything You ',
    needHighlight: 'Need',
    featuresDesc: 'Comprehensive AI-powered tools for your job search',
    readyToLand: 'Ready to Land Your Dream Job?',
    readyDesc: 'No sign-up required. Upload your CV and get instant AI-powered insights.',
    analyzeCvNow: 'Analyze My CV Now',

    // Analyze Page
    analyzePageTitle: 'Analyze Your ',
    applicationHighlight: 'Application',
    analyzePageDesc: 'Upload your CV, add your details, and provide the job offer (text or PDF) for an AI-powered analysis',
    targetLanguageLabel: 'AI Response Language',
    targetLanguageDesc: 'Choose the language in which AI generates the analysis and documents',
    uploadCvTitle: 'Upload Your CV',
    uploadCvSub: 'PDF format, max 4.5MB',
    dragDropCv: 'Drag & drop your CV here',
    clickToBrowse: 'or click to browse files',
    skillsTitle: 'Skills',
    skillsSub: 'Your technical & soft skills',
    skillsPlaceholder: 'e.g. React, Node.js, Python, Team leadership, Agile...',
    educationTitle: 'Education',
    educationSub: 'Your degrees & certifications',
    educationPlaceholder: 'e.g. BSc Computer Science, AWS Certified, Google Analytics...',
    jobOfferTitle: 'Job Offer',
    jobOfferSub: 'Provide the job details for comparison',
    uploadPdfMode: 'Upload PDF',
    pasteTextMode: 'Paste Text',
    dragDropJobPdf: 'Drag & drop the Job Offer PDF here',
    jobDescriptionPlaceholder: 'Paste the complete job description here... Include requirements, responsibilities, qualifications, etc.',
    analyzeWithAi: 'Analyze with AI',
    analyzingOverlayTitle: 'Analyzing your profile...',
    analyzingOverlaySub: 'Our AI is comparing your CV with the job offer',

    // Results Page
    backToNewAnalysis: 'New Analysis',
    generateCoverLetterBtn: 'Generate Cover Letter',
    mockInterviewBtn: 'Mock Interview',
    tabOverview: 'Overview',
    tabRoadmap: 'AI Learning Roadmap',
    tabSkills: 'Missing Skills',
    tabWeaknesses: 'Weaknesses',
    tabRecommendations: 'Tips',
    tabQuestions: 'Interview Q&A',
    roadmapTitle: 'Custom Learning Roadmap',
    roadmapDesc: 'Personalized AI-generated roadmap to acquire key target job skills.',
    progression: 'Progress:',
    technologiesLabel: 'Tech Stack:',
    actionItemLabel: 'Recommended Practical Project:',
    yourStrengths: 'Your Strengths',
    priority: 'Priority:',
    high: 'High',
    medium: 'Medium',
    low: 'Low',

    // Cover Letter Page
    backToResults: 'Back to Results',
    coverLetterTitle: 'Cover Letter',
    craftingCoverLetter: 'Crafting Your Cover Letter',
    aiWritingLetter: 'AI is writing a personalized letter for you...',
    previewBtn: 'Preview',
    editBtn: 'Edit',
    regenerateBtn: 'Regenerate',
    copyBtn: 'Copy',
    copiedBtn: 'Copied!',
    downloadBtn: 'Download',

    // Interview Page
    aiRecruiter: 'AI Recruiter',
    mockSession: 'Mock Interview Session',
    interviewCompleteHeader: 'Interview Complete!',
    preparingInterview: 'Preparing Your Interview...',
    aiReviewingProfile: 'The AI recruiter is reviewing your profile...',
    typeAnswerPlaceholder: 'Type your answer...',
    overallPerformance: 'Overall Performance',
    recommendedHire: '✅ Recommended to Hire',
    worthConsidering: '🤔 Worth Considering',
    needsImprovement: '⚠️ Needs Improvement',
    areasToImprove: 'Areas to Improve',
    voiceInput: 'Voice input',
    listening: 'Listening...',
    speechNotSupported: 'Speech recognition is not supported in your browser (try Chrome or Edge).',
    micPermissionDenied: 'Microphone access denied. Click the lock icon in your browser address bar to allow microphone access.',
    noMicFound: 'No active microphone detected on your computer.',

    // Dashboard Page
    dashboardTitle: 'Dashboard',
    dashboardSub: 'Your analysis history',
    newAnalysisBtn: 'New Analysis',
    noAnalysesYet: 'No analyses yet',
    noAnalysesDesc: 'Start by uploading your CV and a job description to get AI-powered insights about your application.',
    startFirstAnalysis: 'Start Your First Analysis',
    untitledAnalysis: 'Untitled Analysis',

    // Misc
    errorTitle: 'Error',
    tryAgain: 'Try Again',
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('career_app_language');
    return saved && LANGUAGES[saved] ? saved : 'fr';
  });

  useEffect(() => {
    localStorage.setItem('career_app_language', language);
    const dir = LANGUAGES[language]?.dir || 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['fr']?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
