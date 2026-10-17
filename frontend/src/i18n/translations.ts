export type Language = 'bn' | 'en';

export const translations = {
  // Navigation
  nav: {
    dashboard: { bn: 'ড্যাশবোর্ড', en: 'Dashboard' },
    home: { bn: 'মূল পাতা', en: 'Home Page' },
    searchLand: { bn: 'জমি অনুসন্ধান', en: 'Search Land' },
    verifyLand: { bn: 'জমি যাচাইকরণ', en: 'Verify Land' },
    fraudGraph: { bn: 'ফ্রড নেটওয়ার্ক গ্রাফ', en: 'Fraud Graph' },
    fraudDna: { bn: 'ফ্রড ডিএনএ প্যাটার্ন', en: 'Fraud DNA' },
    simulator: { bn: 'হোয়াট-ইফ সিমুলেটর', en: 'What-If Simulator' },
    timeline: { bn: 'মালিকানা টাইমলাইন', en: 'Ownership Timeline' },
    alerts: { bn: 'ঝুঁকি সতর্কতা', en: 'Case Alerts' },
    mutations: { bn: 'নামজারি রেকর্ড', en: 'Mutation History' },
    reports: { bn: 'যাচাই প্রতিবেদন', en: 'Reports' },
    about: { bn: 'পরিচিতি ও নীতি', en: 'About & Ethics' },
    uploadDoc: { bn: 'দলিল আপলোড', en: 'Upload Document' },
    platformNav: { bn: 'প্ল্যাটফর্ম নেভিগেশন', en: 'Platform Navigation' },
    syntheticEngine: { bn: 'সিন্থেটিক ইঞ্জিন', en: 'Synthetic Engine' },
    demoTag: { bn: 'ডেমো', en: 'Demo' },
    activeScenarios: { bn: '২২টি টেস্ট সিনারিও সক্রিয়', en: '22 deterministic test scenarios active' },
  },

  // Navbar
  header: {
    title: { bn: 'ডিজিটাল ভূমি যাচাই ও জালিয়াতি শনাক্তকরণ প্ল্যাটফর্ম', en: 'Digital Land Verification & Fraud Detection' },
    searchPlaceholder: { bn: 'দাগ নং, দলিল নম্বর বা মালিকের নামে খুঁজুন...', en: 'Search by Parcel ID, Deed No., or Owner...' },
    verifyDocument: { bn: 'দলিল যাচাই', en: 'Verify Document' },
    notifications: { bn: 'সতর্কতা ও বিজ্ঞপ্তি', en: 'Fraud Alerts & Notifications' },
    investigatorRole: { bn: 'তদন্তকারী (ডেমো সেশন)', en: 'Investigator (Demo)' },
    apiOnline: { bn: 'API সক্রিয়', en: 'API Active' },
    apiOffline: { bn: 'API অফলাইন', en: 'API Offline' },
    logout: { bn: 'লগআউট (ডেমো)', en: 'Demo Logout' },
    login: { bn: 'লগইন', en: 'Login' },
    register: { bn: 'নিবন্ধন', en: 'Register' },
    exploreDemo: { bn: 'ডেমো দেখুন', en: 'Explore Demo' },
    switchLanguage: { bn: 'ভাষা পরিবর্তন', en: 'Switch Language' },
    guestUser: { bn: 'অতিথি ব্যবহারকারী', en: 'Guest Investigator' },
    activeSession: { bn: 'সক্রিয় ডেমো অ্যাকাউন্ট', en: 'Active Demo Session' },
  },

  // Landing Page
  landing: {
    heroTag: { bn: 'ল্যান্ডটেক ২০২৬ • সিন্থেটিক ডেমো', en: 'LANDTECH 2026 • Synthetic Demo' },
    heroTitle: { bn: 'নিরাপদ বাংলাদেশ গড়ার লক্ষ্যে', en: 'Safer Land for a' },
    heroTitleHighlight: { bn: 'নিরাপদ ও স্বচ্ছ ভূমিসেবা', en: 'Safer Bangladesh' },
    heroSubtitle: { 
      bn: 'ভূমি রেকর্ড যাচাই, সম্ভাব্য জালিয়াতি শনাক্তকরণ এবং একই জমির দ্বৈত বিক্রয় সংক্রান্ত জটিলতা প্রতিরোধে একটি স্বচ্ছ ও আধুনিক ডিজিটাল যাচাইকরণ প্ল্যাটফর্ম।',
      en: 'Verify land records, detect potential fraud, and identify conflicting sale transactions with a simple and transparent digital land verification platform.'
    },
    ctaVerify: { bn: 'ভূমি যাচাই শুরু করুন', en: 'Verify Land' },
    ctaHow: { bn: 'কীভাবে কাজ করে', en: 'How It Works' },
    trustSimple: { bn: 'ব্যবহার করা সহজ', en: 'Simple to use' },
    trustEvidence: { bn: 'তথ্য-প্রমাণভিত্তিক যাচাই', en: 'Evidence-based checks' },
    trustDemo: { bn: 'কৃত্রিম (সিন্থেটিক) ডেমো তথ্য', en: 'Demo data' },
    bangladeshMap: { bn: 'বাংলাদেশ ডিজিটাল ভূমি মানচিত্র', en: 'Bangladesh Land Map' },
    landVerification: { bn: 'ভূমি রেকর্ড যাচাইকরণ', en: 'Land Verification' },
    landVerificationSub: { bn: 'রেকর্ড ও অসঙ্গতি বিশ্লেষণ করুন', en: 'Review records and potential inconsistencies' },
    capabilitiesTag: { bn: 'আমাদের সক্ষমতা', en: 'Our Capabilities' },
    capabilitiesTitle: { bn: 'স্মার্ট যাচাইয়ের মাধ্যমে ভূমি সুরক্ষায় ল্যান্ডগার্ড', en: 'Protecting Land Through Smart Verification' },
    capabilitiesSub: { 
      bn: 'ল্যান্ডগার্ডের চারটি স্বয়ংক্রিয় রুল-ভিত্তিক পরীক্ষণ নাগরিকদের ভূমি রেকর্ডের সতর্কতা ও অসঙ্গতি চিহ্নিত করতে সহায়তা করে।',
      en: 'Four focused checks help users inspect available land records and understand potential warning signs.'
    },
    features: [
      {
        title: { bn: 'দলিল যাচাইকরণ', en: 'Document Verification' },
        description: { bn: 'ডিজিটাল দলিলের ক্রিপ্টোগ্রাফিক হ্যাশ যাচাই করে কোনো অননুমোদিত রদবদল চিহ্নিত করুন।', en: 'Check document integrity and identify suspicious modifications.' },
      },
      {
        title: { bn: 'দ্বৈত-বিক্রয় শনাক্তকরণ', en: 'Double-Selling Detection' },
        description: { bn: 'একই দাগ বা খতিয়ানের জমিতে পরস্পরবিরোধী একাধিক বিক্রয় বা বিচারাধীন চুক্তি চিহ্নিত করুন।', en: 'Identify conflicting sale records associated with the same land parcel.' },
      },
      {
        title: { bn: 'সন্দেহজনক হস্তান্তর নজরদারি', en: 'Suspicious Transfers' },
        description: { bn: 'অস্বাভাবিক দ্রুত হস্তান্তর ও মালিকানার অস্বাভাবিক পরিবর্তন সংক্রান্ত তথ্য বিশ্লেষণ করুন।', en: 'Highlight unusual ownership changes and rapid transfer patterns.' },
      },
      {
        title: { bn: 'নামজারি-রেজিস্ট্রেশন অমিল', en: 'Registration-Mutation Mismatch' },
        description: { bn: 'সাব-রেজিস্ট্রি দলিলের সাথে সহকারী কমিশনার (ভূমি) অফিসের নামজারির অমিল শনাক্ত করুন।', en: 'Find inconsistencies between registration and mutation records.' },
      },
    ],
    processTag: { bn: 'সহজ পদ্ধতি', en: 'Simple Process' },
    processTitle: { bn: 'ল্যান্ডগার্ড যেভাবে কাজ করে', en: 'How LandGuard Works' },
    processSub: { 
      bn: 'সহজ তিনটি ধাপে যে কোনো ভূমি রেকর্ডের ইতিহাস পর্যালোচনা করুন এবং অসঙ্গতি যাচাই করুন।',
      en: 'Follow a simple process to review available land information and investigate possible inconsistencies.'
    },
    steps: [
      {
        step: '০১',
        title: { bn: 'জমি অনুসন্ধান করুন', en: 'Search Land' },
        description: { bn: 'দাগ নং, খতিয়ান, মৌজা বা দলিল নম্বর দিয়ে নির্দিষ্ট ভূমি পার্সেলটি খুঁজে বের করুন।', en: 'Search for a land parcel using the available record details.' },
      },
      {
        step: '০২',
        title: { bn: 'রেকর্ড যাচাই করুন', en: 'Verify Records' },
        description: { bn: 'মালিকানা ক্রম, নামজারি অনুমোদন এবং নথিপত্রের ডিজিটাল অখণ্ডতা মিলিয়ে দেখুন।', en: 'Compare available documents and identify potential inconsistencies.' },
      },
      {
        step: '০৩',
        title: { bn: 'বিশ্লেষণ প্রতিবেদন পর্যালোচনা করুন', en: 'Review Findings' },
        description: { bn: 'ঝুঁকি স্কোর, বিস্তারিত সতর্কতা ও প্রয়োজনীয় প্রমাণসহ সিদ্ধান্ত গ্রহণ করুন।', en: 'Inspect risk alerts and review the supporting evidence.' },
      },
    ],
    responsibleTitle: { bn: 'স্বচ্ছ ও দায়িত্বশীল যাচাইকরণ প্রতিশ্রুতি', en: 'Transparent and Responsible Verification' },
    responsibleDesc: { 
      bn: 'ল্যান্ডগার্ড সম্ভাব্য অসঙ্গতিগুলো পর্যালোচনার জন্য তুলে ধরে। এই ঝুঁকি সতর্কতা কোনোভাবেই ফৌজদারি অপরাধের প্রমাণ বা চূড়ান্ত মালিকানার আইনি ঘোষণা নয়। এটি সম্পূর্ণ সিন্থেটিক ডেটা সহযোগে নির্মিত ডেমো প্ল্যাটফর্ম।',
      en: 'LandGuard highlights potential inconsistencies for further review. A risk alert is not proof of fraud or a legal determination of land ownership. This demonstration uses synthetic data.'
    },
    footerNote: { bn: 'ল্যান্ডটেক ২০২৬ • ডিজিটাল ভূমি ব্যবস্থাপনা ডেমো প্ল্যাটফর্ম', en: 'LandTech 2026 · Synthetic demonstration platform' },
  },

  // Auth / Login / Register
  auth: {
    loginTitle: { bn: 'ল্যান্ডগার্ডে লগইন করুন', en: 'Sign in to LandGuard' },
    loginSubtitle: { bn: 'তদন্তকারী বা পরীক্ষক হিসেবে ডেমো ওয়ার্কস্পেসে প্রবেশ করুন', en: 'Sign in to open the LandGuard demonstration.' },
    registerTitle: { bn: 'ডেমো অ্যাকাউন্ট তৈরি করুন', en: 'Create Demo Account' },
    registerSubtitle: { bn: 'ল্যান্ডগার্ড প্ল্যাটফর্মটি সহজে পরীক্ষা করতে কয়েক সেকেন্ডে নিবন্ধন সম্পন্ন করুন', en: 'Register in seconds to test the LandGuard platform.' },
    fullName: { bn: 'পূর্ণ নাম', en: 'Full Name' },
    fullNamePlaceholder: { bn: 'যেমন: মোহাম্মদ রফিক বা তানজিলা আহমেদ', en: 'e.g. Rafiq Ahmed or Tanzila Rahman' },
    email: { bn: 'ইমেইল ঠিকানা বা ব্যবহারকারী নাম', en: 'Email or Username' },
    emailPlaceholder: { bn: 'investigator@landguard.demo', en: 'investigator@landguard.demo' },
    password: { bn: 'পাসওয়ার্ড', en: 'Password' },
    passwordPlaceholder: { bn: 'ডেমো পাসওয়ার্ড লিখুন', en: 'Enter demo password' },
    confirmPassword: { bn: 'পাসওয়ার্ড নিশ্চিত করুন', en: 'Confirm Password' },
    confirmPasswordPlaceholder: { bn: 'পাসওয়ার্ডটি পুনরায় লিখুন', en: 'Re-enter your password' },
    registerButton: { bn: 'নিবন্ধন সম্পন্ন করুন ও ড্যাশবোর্ডে যান', en: 'Complete Registration & Open Dashboard' },
    loginButton: { bn: 'লগইন করুন ও ড্যাশবোর্ডে প্রবেশ করুন', en: 'Continue to Dashboard' },
    exploreDemoButton: { bn: 'নিবন্ধন ছাড়াই ডেমো দেখুন (Explore Demo)', en: 'Explore Demo (No registration needed)' },
    alreadyHaveAccount: { bn: 'ইতিমধ্যে ডেমো অ্যাকাউন্ট রয়েছে?', en: 'Already have a demo account?' },
    dontHaveAccount: { bn: 'নতুন ডেমো অ্যাকাউন্ট তৈরি করতে চান?', en: "Don't have an account yet?" },
    linkToLogin: { bn: 'লগইন পেইজে যান', en: 'Sign In here' },
    linkToRegister: { bn: 'নতুন নিবন্ধন করুন', en: 'Register here' },
    rememberMe: { bn: 'মনে রাখুন', en: 'Remember me' },
    forgotPassword: { bn: 'পাসওয়ার্ড ভুলে গেছেন?', en: 'Forgot password?' },
    returnHome: { bn: 'মূল পাতায় ফিরে যান', en: 'Return to LandGuard home' },
    disclaimerBanner: {
      bn: 'ডেমো সেশন সতর্কতা: এই স্ক্রিনটি শুধুমাত্র হ্যাকাথন ডেমোর উদ্দেশ্যে ডিজাইন করা হয়েছে। এখানে কোনো রিয়েল সংবেদনশীল পাসওয়ার্ড প্রদান করবেন না। পাসওয়ার্ড কখনোই ব্রাউজারে সংরক্ষিত হয় না।',
      en: 'Demo access notice: This screen is for hackathon demonstration only. Do not enter real credentials. Passwords are never stored in localStorage or sessionStorage.'
    },
    validation: {
      nameRequired: { bn: 'অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।', en: 'Please enter your full name.' },
      emailRequired: { bn: 'সঠিক ইমেইল ঠিকানা প্রদান করুন।', en: 'Please enter a valid email address.' },
      passwordRequired: { bn: 'অনুগ্রহ করে পাসওয়ার্ড লিখুন (কমপক্ষে ৪ অক্ষর)।', en: 'Please enter a password (minimum 4 characters).' },
      passwordMismatch: { bn: 'পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড দুটি মেলেনি।', en: 'Passwords do not match.' },
      successReg: { bn: 'ডেমো নিবন্ধন সফল হয়েছে! ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...', en: 'Demo registration successful! Redirecting to dashboard...' },
      successLogin: { bn: 'ডেমো সেশন চালু হচ্ছে! ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...', en: 'Opening demonstration workspace...' }
    }
  },

  // Dashboard
  dashboard: {
    title: { bn: 'ভূমি যাচাই ড্যাশবোর্ড', en: 'Land Verification Dashboard' },
    subtitle: { bn: 'সিন্থেটিক ভূমি রেকর্ড, ঝুঁকি স্কোর ও রুল-ভিত্তিক জালিয়াতি পর্যবেক্ষণ', en: 'Synthetic land records, risk screening, and rule-based fraud telemetry' },
    loadingStats: { bn: 'সিন্থেটিক রেকর্ড ও বিশ্লেষণ লোড হচ্ছে...', en: 'Loading synthetic registry analytics...' },
    errorTitle: { bn: 'ল্যান্ডগার্ড API-র সাথে সংযোগ স্থাপন সম্ভব হয়নি', en: 'Connection to LandGuard API Failed' },
    retry: { bn: 'পুনরায় চেষ্টা করুন', en: 'Retry Connection' },
    totalRecords: { bn: 'মোট পরীক্ষিত রেকর্ড', en: 'Total Land Records' },
    totalReports: { bn: 'যাচাই প্রতিবেদন', en: 'Generated Reports' },
    highRiskCases: { bn: 'উচ্চ ঝুঁকির ঘটনা', en: 'High Risk Alerts' },
    activeAlerts: { bn: 'সক্রিয় নোটিশ ও ফ্ল্যাগ', en: 'Open Fraud Flags' },
    riskDistribution: { bn: 'ঝুঁকি স্কোর বিন্যাস (Risk Distribution)', en: 'Risk Band Distribution' },
    recentReports: { bn: 'সাম্প্রতিক যাচাই প্রতিবেদন', en: 'Recent Verification Reports' },
    recentAlerts: { bn: 'সক্রিয় ফ্রড অ্যালার্ট ও কারণ', en: 'Active Fraud Alerts' },
    viewAllRecords: { bn: 'সব রেকর্ড দেখুন', en: 'View All Records' },
    viewAllAlerts: { bn: 'সব অ্যালার্ট দেখুন', en: 'View All Alerts' },
    viewAllReports: { bn: 'সব রিপোর্ট দেখুন', en: 'View All Reports' },
    openDossier: { bn: 'প্রতিবেদন দেখুন', en: 'View Dossier' },
    investigate: { bn: 'তদন্ত করুন', en: 'Investigate' },
    quickVerifyTitle: { bn: 'দ্রুত ভূমি যাচাইকরণ', en: 'Quick Land Screening' },
    quickVerifyPlaceholder: { bn: 'পার্সেল আইডি লিখুন (যেমন: LR-DHK-2024-002)', en: 'Enter Parcel ID (e.g. LR-DHK-2024-002)' },
    runCheck: { bn: 'যাচাই করুন', en: 'Run Check' },
    syntheticDisclaimer: { bn: 'সিন্থেটিক হ্যাকাথন প্রোটোটাইপ • সকল ডেটা কৃত্রিম ও পরীক্ষামূলক', en: 'Synthetic Hackathon Prototype • Fictional test data' },
  },

  // Common UI Elements & Tables
  common: {
    loading: { bn: 'লোড হচ্ছে...', en: 'Loading...' },
    save: { bn: 'সংরক্ষণ', en: 'Save' },
    cancel: { bn: 'বাতিল', en: 'Cancel' },
    close: { bn: 'বন্ধ করুন', en: 'Close' },
    submit: { bn: 'জমা দিন', en: 'Submit' },
    filter: { bn: 'ফিল্টার', en: 'Filter' },
    clear: { bn: 'মুছুন', en: 'Clear' },
    refresh: { bn: 'রিফ্রেশ', en: 'Refresh' },
    back: { bn: 'পেছনে যান', en: 'Back' },
    details: { bn: 'বিস্তারিত', en: 'Details' },
    actions: { bn: 'পদক্ষেপ', en: 'Actions' },
    status: { bn: 'অবস্থা', en: 'Status' },
    riskScore: { bn: 'ঝুঁকি স্কোর', en: 'Risk Score' },
    riskBand: { bn: 'ঝুঁকি মাত্রা', en: 'Risk Band' },
    district: { bn: 'জেলা', en: 'District' },
    upazila: { bn: 'উপজেলা', en: 'Upazila' },
    mouza: { bn: 'মৌজা', en: 'Mouza' },
    dagNo: { bn: 'দাগ নং (Plot/Dag)', en: 'Dag / Plot No' },
    khatianNo: { bn: 'খতিয়ান নং (Khatian)', en: 'Khatian No' },
    area: { bn: 'জমির পরিমাণ (শতক)', en: 'Area (Decimal)' },
    deedNo: { bn: 'দলিল নম্বর', en: 'Deed Number' },
    date: { bn: 'তারিখ', en: 'Date' },
    owner: { bn: 'মালিকের নাম', en: 'Owner Name' },
    nid: { bn: 'এনআইডি হ্যাশ', en: 'NID Hash' },
    evidence: { bn: 'প্রমাণক ও সূত্র', en: 'Evidence' },
    notes: { bn: 'মন্তব্য', en: 'Notes' },
    search: { bn: 'অনুসন্ধান', en: 'Search' },
    all: { bn: 'সকল', en: 'All' },
    none: { bn: 'কিছু নেই', en: 'None' },
    lowRisk: { bn: 'কম ঝুঁকি', en: 'Low Risk' },
    mediumRisk: { bn: 'মাঝারি ঝুঁকি', en: 'Medium Risk' },
    highRisk: { bn: 'উচ্চ ঝুঁকি', en: 'High Risk Alert' },
    open: { bn: 'উন্মুক্ত (Open)', en: 'Open' },
    reviewed: { bn: 'পর্যালোচিত (Reviewed)', en: 'Reviewed' },
    unresolved: { bn: 'অমীমাংসিত (Unresolved)', en: 'Unresolved' },
    approved: { bn: 'অনুমোদিত (Approved)', en: 'Approved' },
    pending: { bn: 'বিচারাধীন (Pending)', en: 'Pending' },
    rejected: { bn: 'প্রত্যাখ্যাত (Rejected)', en: 'Rejected' },
    irregular: { bn: 'অনিয়মিত (Irregular)', en: 'Irregular' },
  },

  // Document Hash Modal
  docModal: {
    title: { bn: 'দলিল ডিজিটাল হ্যাশ যাচাইকরণ (SHA-256)', en: 'Document Digital Hash Verification (SHA-256)' },
    subtitle: { bn: 'দলিলের ক্রিপ্টোগ্রাফিক হ্যাশ যাচাই করে কোনো অননুমোদিত পরিবর্তন বা জালিয়াতি হয়েছে কিনা যাচাই করুন।', en: 'Verify cryptographic checksums to detect forged, modified, or substituted deeds.' },
    selectSample: { bn: 'নমুনা সিন্থেটিক দলিল নির্বাচন করুন', en: 'Select Reference Test Document' },
    uploadFile: { bn: 'দলিল ফাইল আপলোড করুন', en: 'Upload Document File' },
    dropzone: { bn: 'এখানে ফাইল ড্রপ করুন বা কম্পিউটার থেকে নির্বাচন করুন', en: 'Drop PDF, scanned deed or text file here, or browse' },
    referenceHash: { bn: 'অফিসিয়াল রেজিস্ট্রি হ্যাশ (Reference Hash)', en: 'Official Registry Reference Hash' },
    computedHash: { bn: 'ফাইল থেকে প্রাপ্ত হ্যাশ (Computed Hash)', en: 'Computed File Hash' },
    verifyButton: { bn: 'হ্যাশ সততা যাচাই করুন', en: 'Verify Hash Integrity' },
    matchSuccess: { bn: 'হ্যাশ অবিকল মিলেছে! দলিলের কোনো পরিবর্তন হয়নি।', en: 'Hash Matched! Document integrity confirmed.' },
    tamperAlert: { bn: 'সতর্কতা: হ্যাশ মেলেনি! দলিলে সম্ভাব্য অননুমোদিত রদবদল চিহ্নিত হয়েছে।', en: 'Tampering Alert: Hash mismatch detected! Document has been altered.' },
    quickTestClean: { bn: 'অক্ষত নমুনা ফাইল দিয়ে পরীক্ষা', en: 'Test with Clean Sample' },
    quickTestTampered: { bn: 'বিকৃত/পরিবর্তিত নমুনা ফাইল দিয়ে পরীক্ষা', en: 'Test with Tampered Sample' },
  },

  // Verify Land Page
  verifyPage: {
    title: { bn: 'স্বয়ংক্রিয় ভূমি স্ক্রিনিং ও রুল ইঞ্জিন', en: 'Automated Land Screening & Rules Engine' },
    subtitle: { bn: 'পার্সেল আইডির বিপরীতে রুল-ভিত্তিক পরীক্ষণ চালিয়ে দ্বৈত বিক্রয় ও ধারাবাহিকতার ফাঁক শনাক্ত করুন', en: 'Deterministic multi-rule analysis for conflict detection and mutation gaps' },
    enterRecordId: { bn: 'ভূমি পার্সেল বা রেকর্ড আইডি', en: 'Land Record Identifier' },
    quickPresets: { bn: 'পরীক্ষামূলক সিনারিও প্রিসেট', en: 'Quick Demonstration Test Scenarios' },
    runButton: { bn: 'যাচাইকরণ পরিচালনা করুন', en: 'Run Verification' },
    resultsTitle: { bn: 'স্ক্রিনিং ফলাফল ও ঝুঁকি স্কোর', en: 'Screening Result & Assessment' },
    overallScore: { bn: 'সামগ্রিক ঝুঁকি স্কোর', en: 'Overall Risk Score' },
    ruleFindings: { bn: 'চিহ্নিত সতর্কতাসমূহ ও ব্যাখ্যা', en: 'Rule Findings & Explanations' },
    checksExecuted: { bn: 'যে সকল নিয়মে পরীক্ষা চালানো হয়েছে', en: 'Checks Performed by Engine' },
    suggestedAction: { bn: 'প্রস্তাবিত পদক্ষেপ:', en: 'Suggested Action:' },
    viewFullReport: { bn: 'পূর্ণাঙ্গ অফিসিয়াল রিপোর্ট দেখুন', en: 'View Full Archived Dossier' },
    noFindings: { bn: 'কোনো অসঙ্গতি বা ঝুঁকি পাওয়া যায়নি। রেকর্ডটি সুরক্ষিত।', en: 'No anomalies or risk flags detected for this record.' },
  },

  // Records & Details
  records: {
    title: { bn: 'ভূমি রেকর্ড রেজিস্ট্রি ও অনুসন্ধান', en: 'Land Records Registry & Cadastral Search' },
    subtitle: { bn: 'জেলা, উপজেলা, মৌজা, খতিয়ান বা দাগ নম্বর দ্বারা ফিল্টার করুন', en: 'Filter by administrative jurisdiction or specific deed indices' },
    locationTab: { bn: 'মৌজা ও দাগ নং দিয়ে অনুসন্ধান', en: 'Search by Cadastral Schedule' },
    deedTab: { bn: 'দলিল নম্বর দিয়ে অনুসন্ধান', en: 'Search by Deed Number' },
    filterButton: { bn: 'ফিল্টার করুন', en: 'Apply Filter' },
    resetButton: { bn: 'রিসেট', en: 'Reset' },
    recordList: { bn: 'ভূমি পার্সেল তালিকা', en: 'Land Parcel Results' },
    overviewTab: { bn: 'সারসংক্ষেপ', en: 'Overview' },
    transactionsTab: { bn: 'বিক্রয় ও হস্তান্তর ইতিহাস', en: 'Deed Conveyances' },
    mutationsTab: { bn: 'নামজারি মামলা', en: 'Mutation (Namzari)' },
    documentsTab: { bn: 'সংযুক্ত দলিল ও হ্যাশ', en: 'Attached Deeds & Hash' },
    reportsTab: { bn: 'যাচাই রিপোর্ট', en: 'Screening Reports' },
    mapPreviewTitle: { bn: 'ক্যাডাস্ট্রাল ম্যাপ প্রিভিউ (নকশা)', en: 'Cadastral Map Preview' },
    switchSatellite: { bn: 'স্যাটেলাইট দৃশ্য', en: 'Satellite View' },
    switchCadastral: { bn: 'মৌজা নকশা দৃশ্য', en: 'Cadastral Overlay' },
  },

  // Fraud Alerts Page
  alertsPage: {
    title: { bn: 'জালিয়াতি ঝুঁকি সতর্কতা ও পর্যালোচনা', en: 'Fraud Alerts & Case Review' },
    subtitle: { bn: 'ল্যান্ডগার্ড রুল ইঞ্জিন কর্তৃক চিহ্নিত সম্ভাব্য দ্বৈত বিক্রয় ও মালিকানা অসঙ্গতি', en: 'Rule-engine flags for conflicting conveyances, suspicious chains, and hash anomalies' },
    filterByRisk: { bn: 'ঝুঁকি মাত্রা অনুযায়ী ফিল্টার', en: 'Filter by Risk Level' },
    filterByType: { bn: 'অ্যালার্টের ধরণ', en: 'Alert Type' },
    filterByStatus: { bn: 'সমাধান অবস্থা', en: 'Status' },
    markReviewed: { bn: 'পর্যালোচিত হিসেবে চিহ্নিত করুন', en: 'Mark Reviewed' },
    markUnresolved: { bn: 'অমীমাংসিত হিসেবে চিহ্নিত করুন', en: 'Mark Unresolved' },
    reopen: { bn: 'পুনরায় খুলুন', en: 'Reopen Alert' },
    reviewNotesLabel: { bn: 'তদন্তকারী কর্মকর্তার নোট', en: 'Investigator Notes' },
    updateSuccess: { bn: 'অ্যালার্ট সফলভাবে আপডেট করা হয়েছে।', en: 'Alert status updated successfully.' },
  },

  // What-If Simulator
  simulator: {
    title: { bn: 'হোয়াট-ইফ সিনারিও সিমুলেটর', en: 'What-If Scenario Simulator' },
    subtitle: { bn: 'কাল্পনিক সংশোধন বা দলিল বাতিলের ফলে ঝুঁকি স্কোরে কী পরিবর্তন ঘটে তা বিশ্লেষণ করুন', en: 'Explore how a hypothetical correction changes the rules-engine assessment.' },
    configTitle: { bn: 'সিনারিও কনফিগার করুন', en: 'Configure Scenario' },
    selectRecord: { bn: 'ভূমি রেকর্ড নির্বাচন করুন', en: 'Land Record' },
    selectScenario: { bn: 'সিনারিও ধরণ', en: 'Scenario Type' },
    targetDeed: { bn: 'লক্ষ্য দলিল / রেফারেন্স (ঐচ্ছিক)', en: 'Target Deed / Reference (Optional)' },
    runButton: { bn: 'সিমুলেশন চালান', en: 'Run Simulation' },
    currentAssessment: { bn: 'বর্তমান মূল্যায়ন', en: 'Current Assessment' },
    afterSimulation: { bn: 'সিমুলেশন পরবর্তী মূল্যায়ন', en: 'After Simulation' },
    scoreDelta: { bn: 'ঝুঁকি স্কোর পরিবর্তন:', en: 'Risk Score Delta:' },
    ruleComparison: { bn: 'রুল পরিবর্তনের তুলনামূলক তালিকা', en: 'Rule Comparison' },
    resolvedInScenario: { bn: 'সিনারিওতে সমাধান হয়েছে', en: 'Resolved in scenario' },
    safetyNote: { bn: 'নিরাপত্তা বার্তা:', en: 'Safety Note:' },
    disclaimer: { bn: 'এটি মেমরিতে পরিচালিত কাল্পনিক সিমুলেশন। এটি মূল ডাটাবেজ পরিবর্তন করে না এবং কোনো আইনি পরামর্শ নয়।', en: 'This is an isolated synthetic simulation. It does not modify actual records and is not legal advice.' }
  },

  // Fraud Graph
  graph: {
    title: { bn: 'জালিয়াতি সম্পর্ক নেটওয়ার্ক গ্রাফ', en: 'Fraud Relationship Graph' },
    subtitle: { bn: 'পার্সেল, দলিল, মালিক ও নামজারির মধ্যকার আন্তঃসম্পর্ক ও সম্ভাব্য সংঘাত ভিজ্যুয়ালাইজ করুন', en: 'Explore how a parcel connects to deeds, synthetic owners, and mutation records.' },
    nodes: { bn: 'নোড সংখ্যা', en: 'Nodes' },
    relationships: { bn: 'সম্পর্ক সংখ্যা', en: 'Relationships' },
    conflicts: { bn: 'চিহ্নিত ঝুঁকিপূর্ণ সম্পর্ক', en: 'Flagged Relationships' },
    connectedRecords: { bn: 'সংযুক্ত রেকর্ডসমূহ', en: 'Connected Records' },
    relationshipsList: { bn: 'সম্পর্কের তালিকা', en: 'Relationships List' },
    recordDetails: { bn: 'রেকর্ড বিবরণ', en: 'Record Details' },
    selectPrompt: { bn: 'বিস্তারিত তথ্য দেখতে যে কোনো নোডে ক্লিক করুন।', en: 'Select a node to inspect its recorded details.' },
  },

  // Fraud DNA
  dna: {
    title: { bn: 'ফ্রড ডিএনএ প্যাটার্ন ক্লাস্টার', en: 'Fraud DNA Pattern Clusters' },
    subtitle: { bn: 'বিভিন্ন রেকর্ডে পুনরাবৃত্ত অসঙ্গতির পদচিহ্ন ও পদ্ধতিগত জালিয়াতি ঝুঁকি', en: 'Recurring anomaly footprints across synthetic demo records.' },
    patterns: { bn: 'মোট প্যাটার্ন', en: 'Patterns' },
    highSeverity: { bn: 'উচ্চ মাত্রার প্যাটার্ন', en: 'High-severity patterns' },
    flaggedParcels: { bn: 'ঝুঁকিপূর্ণ পার্সেল', en: 'Flagged parcels' },
    recurringIndicators: { bn: 'পুনরাবৃত্ত সূচকসমূহ', en: 'Recurring Indicators' },
    recordedFacts: { bn: 'রেকর্ডকৃত তথ্যাদি', en: 'Recorded Facts' },
    suggestedReview: { bn: 'প্রস্তাবিত পর্যালোচনা:', en: 'Suggested Review:' },
  },

  // Ownership Timeline
  timeline: {
    title: { bn: 'মালিকানা ও হস্তান্তর টাইমলাইন', en: 'Ownership & Transfer Timeline' },
    subtitle: { bn: 'দলিল ও নামজারি তথ্যের ভিত্তিতে প্রস্তুতকৃত ক্রমানুসারিক ঘটনাবলি', en: 'Chronological events assembled from synthetic deed and mutation records.' },
    eventsCount: { bn: 'টি রেকর্ডকৃত ঘটনা', en: 'recorded events' },
    party: { bn: 'পক্ষ / ব্যক্তি:', en: 'Party:' },
    noEvents: { bn: 'এই রেকর্ডের জন্য কোনো টাইমলাইন তথ্য পাওয়া যায়নি।', en: 'No timeline events available for this record.' },
    note: { bn: 'টাইমলাইন প্রাপ্ত সিন্থেটিক রেকর্ডের উপর ভিত্তি করে নির্মিত। অনুপস্থিত ঘটনা অসদাচরণের নিশ্চয়তা নয়।', en: 'Timeline events are derived from available records. Missing events may indicate incomplete data.' }
  },

  // Mutations
  mutations: {
    title: { bn: 'নামজারি (মিউটেশন) রেজিস্ট্রি', en: 'Mutation (Namzari) Records Registry' },
    subtitle: { bn: 'সহকারী কমিশনার (ভূমি) অফিসের মামলার সাথে সাব-রেজিস্ট্রি দলিলের সামঞ্জস্য যাচাই', en: 'AC Land Office mutation cases cross-referenced against deed conveyances' },
    criteriaTitle: { bn: 'নামজারি অসঙ্গতি স্ক্রিনিংয়ের নীতিমালা', en: 'Prototype Mutation Consistency Screening Criteria' },
    caseNo: { bn: 'নামজারি কেস নং', en: 'Mutation Case No' },
    applicant: { bn: 'আবেদনকারী', en: 'Applicant' },
    prevOwner: { bn: 'পূর্বের মালিক', en: 'Previous Owner' },
    office: { bn: 'ভূমি অফিস', en: 'AC Land Office' },
    appDate: { bn: 'আবেদনের তারিখ', en: 'Application Date' },
    apprDate: { bn: 'অনুমোদনের তারিখ', en: 'Approval Date' },
    irregularitiesNotice: { bn: 'অনিয়মিত বা অমিলযুক্ত নামজারি শনাক্তকরণ', en: 'Detected Irregularities' },
  },

  // Verification Reports
  reports: {
    title: { bn: 'সংরক্ষিত যাচাইকরণ প্রতিবেদন', en: 'Saved Verification Reports' },
    subtitle: { bn: 'স্বয়ংক্রিয় স্ক্রিনিং ডসিয়ার ও ব্যাখ্যাযোগ্য ঝুঁকি মূল্যায়ন সংগ্রহ', en: 'Archived screening dossiers and explainable fraud risk assessments' },
    archivedCount: { bn: 'সংরক্ষিত প্রতিবেদন:', en: 'Archived Reports:' },
    filterRisk: { bn: 'ঝুঁকি অনুযায়ী ফিল্টার:', en: 'Filter by Risk:' },
    printReport: { bn: 'রিপোর্ট প্রিন্ট করুন', en: 'Print Dossier' },
    reportId: { bn: 'রিপোর্ট আইডি', en: 'Report ID' },
    screenedAt: { bn: 'যাচাইয়ের সময়', en: 'Screened At' },
  },

  // About & Ethics
  about: {
    title: { bn: 'ল্যান্ডগার্ড পরিচিতি ও নীতি', en: 'About LandGuard' },
    subtitle: { bn: 'সমন্বিত ডিজিটাল ভূমি যাচাই ও জালিয়াতি শনাক্তকরণ প্ল্যাটফর্ম', en: 'Integrated Digital Land Verification & Fraud Detection Platform' },
    hackathonTag: { bn: 'হ্যাকাতন প্রোটোটাইপ • ট্র্যাক: ডিজিটাল ভূমি রেকর্ড, ভেরিফিকেশন ও ডিজিটাইজেশন', en: 'Hackathon Prototype • Track: Digital Land Records, Verification & Digitization' },
    problemTitle: { bn: 'সমস্যার বিবরণ: সমস্যা ৩ — জালিয়াতি ও দ্বৈত-বিক্রয় শনাক্তকরণ', en: 'Problem Statement: P3 — Fraud & Double-Selling Detection' },
    techTitle: { bn: 'প্রযুক্তিগত স্থাপত্য ও স্ট্যাক', en: 'Technical Architecture & Stack' },
  }
};
