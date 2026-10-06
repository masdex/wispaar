export type PageRoute =
  | 'home'
  | 'about'
  | 'services'
  | 'service-detail'
  | 'portfolio'
  | 'project-detail'
  | 'seo'
  | 'process'
  | 'blog'
  | 'article-detail'
  | 'faq'
  | 'contact'
  | 'start-project'
  | 'search'
  | 'privacy'
  | 'terms'
  | '404';

export interface Project {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  client: string;
  industry: string;
  services: string[];
  technology: string[];
  year: string;
  projectType: string;
  challenge: string;
  solution: string;
  results: {
    label: string;
    value: string;
    detail: string;
  }[];
  seoMetrics?: {
    kpi: string;
    before: string;
    after: string;
  }[];
  websiteUrlPlaceholder: string;
  tags: string[];
  coverImage: string;
  isDemo: boolean;
  editorialQuote?: string;
  responsivePreview?: {
    desktopUrl?: string;
    mobileUrl?: string;
  };
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  shortDescription: string;
  philosophy: string;
  coreBenefit: string;
  problemSolved: string;
  targetAudience: string;
  expectedOutcomes: string[];
  deliverables: string[];
  processSteps: {
    step: string;
    title: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface SeoCaseStudy {
  id: string;
  slug: string;
  clientTitle: string;
  industry: string;
  duration: string;
  services: string[];
  initialSituation: string;
  strategy: string;
  technicalImprovements: string[];
  contentStrategy: string[];
  onPageOptimization: string[];
  performanceImprovements: string[];
  beforeMetric: string;
  afterMetric: string;
  organicGrowthIndicator: string;
  keywordGrowthIndicator: string;
  conversionIndicator: string;
  notes: string;
  isCaseStudyDemo: boolean;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: 'طراحی وب' | 'وردپرس' | 'سئو' | 'تجربه کاربری' | 'استراتژی دیجیتال';
  readTime: string;
  publishedDate: string;
  author: {
    name: string;
    role: string;
  };
  excerpt: string;
  contentParagraphs: {
    subheading?: string;
    text: string;
    quote?: string;
  }[];
  tags: string[];
}

export interface FaqItem {
  id: string;
  category: 'طراحی سایت' | 'وردپرس' | 'سئو' | 'فرآیند همکاری' | 'پشتیبانی';
  question: string;
  answer: string;
}

export interface ProjectBriefState {
  services: string[];
  goals: string[];
  currentPlatform: string;
  budgetRange: string;
  timeline: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  description: string;
}
