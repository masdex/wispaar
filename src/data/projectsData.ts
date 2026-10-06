import { Project } from '../types';

export const projectsData: Project[] = [
  {
    id: 'arya-capital',
    slug: 'arya-capital',
    title: 'آریا کاپیتال',
    titleEn: 'Arya Capital',
    client: 'هلدینگ مدیریت سرمایه و ثروت آریا',
    industry: 'فین‌تک و خدمات مالی بین‌المللی',
    services: ['طراحی اختصاصی UI/UX', 'توسعه وب‌اپلیکیشن واکنشی', 'بهینه‌سازی حداکثری پرفورمنس'],
    technology: ['React', 'TypeScript', 'Tailwind CSS', 'WordPress REST API'],
    year: '۱۴۰۴',
    projectType: 'وب‌سایت اختصاصی و پورتال سازمانی',
    coverImage: '/src/assets/images/project_arch_fintech_1791304932616.jpg',
    isDemo: true,
    editorialQuote: '«ساختن بستری دیجیتال که در اولین ثانیه‌ها حس اطمینان مالی و انضباط ساختاری را به سرمایه‌گذار منتقل کند.»',
    challenge: 'نیاز به سامانه‌ای مدرن، بدون پیچیدگی‌های گیج‌کننده و با سرعت بارگذاری زیر ۱ ثانیه که بتواند گزارش‌های مالی تحلیلی را در قالبی شیک و خوانا به مخاطبان نخبه تجاری عرضه کند.',
    solution: 'طراحی یک نظام بصری دارک و مینی‌مال مبتنی بر گرید هندسی دقیق، حذف المان‌های تزئینی مازاد، بهینه‌سازی کدهای سمت کلاینت و معماری ماژولار مبتنی بر اصول آفرینش با خرد.',
    results: [
      { label: 'شاخص عملکرد لایت‌هاوس', value: '۹۹/۱۰۰', detail: 'امتیاز پرفورمنس و بهینگی ساختار' },
      { label: 'نرخ تکمیل درخواست مشاوره', value: '+۶۴٪', detail: 'افزایش نرخ تبدیل سرنخ‌های واجد شرایط' },
      { label: 'زمان پاسخگویی تعاملی', value: '۰.۴ ثانیه', detail: 'سرعت لود کامل صفحات در شبکه‌های مختلف' }
    ],
    seoMetrics: [
      { kpi: 'Core Web Vitals LCP', before: '۳.۸ ثانیه', after: '۰.۷ ثانیه' },
      { kpi: 'میانگین حضور کاربر در صفحه', before: '۴۲ ثانیه', after: '۳ دقیقه و ۱۸ ثانیه' }
    ],
    websiteUrlPlaceholder: 'https://demo-arya.wispaar.com',
    tags: ['فین‌تک', 'طراحی اختصاصی', 'پرفورمنس', 'پنل سازمانی']
  },
  {
    id: 'genome-labs',
    slug: 'genome-labs',
    title: 'ژنوم لبز',
    titleEn: 'Genome Labs',
    client: 'مرکز تحقیقاتی بیوتکنولوژی و ژنتیک ژنوم',
    industry: 'سلامت، علوم زیستی و آزمایشگاهی',
    services: ['طراحی وب‌سایت پژوهشی', 'توسعه وردپرس هدلس اختصاصی', 'طراحی تجربه کاربری داده‌محور'],
    technology: ['WordPress Headless', 'Next-Gen Architecture', 'Advanced Custom Fields', 'Tailwind'],
    year: '۱۴۰۳',
    projectType: 'وب‌سایت علمی و سامانه پذیرش آزمون',
    coverImage: '/src/assets/images/project_health_biotech_1791304945144.jpg',
    isDemo: true,
    editorialQuote: '«پیچیده‌ترین داده‌های آزمایشگاهی وقتی در نظمی شفاف بنشینند، تبدیل به دانشی قابل تصمیم‌گیری می‌شوند.»',
    challenge: 'ارائه بیش از ۳۰۰ نوع تست ژنتیک و مقالات بالینی سنگین در قالب یک ساختار ساده، بدون آنکه کاربر در شلوغی دسته‌بندی‌ها سردرگم شود.',
    solution: 'ایجاد سیستم جستجو و فیلترینگ چندلایه، پیاده‌سازی قالب وردپرس فوق‌العاده سبک با زمان اجرای بهینه کوئری‌ها و طراحی ریسپانسیو اختصاصی برای پژوهشگران در محیط‌های آزمایشگاهی.',
    results: [
      { label: 'سرعت دسترسی به نتایج', value: '-۷۵٪', detail: 'کاهش کلیک‌های زاید تا رسیدن به خدمت هدف' },
      { label: 'ترافیک ورودی ارگانیک', value: '[Organic Growth]', detail: 'افزایش بازدید هدفمند از مقالات تخصصی' },
      { label: 'پایداری سرور در بار ترافیکی', value: '۱۰۰٪', detail: 'بدون قطعی و افت سرعت' }
    ],
    websiteUrlPlaceholder: 'https://demo-genome.wispaar.com',
    tags: ['بیوتکنولوژی', 'وردپرس اختصاصی', 'ساختار داده', 'پژوهشی']
  },
  {
    id: 'hoor-atelier',
    slug: 'hoor-atelier',
    title: 'آتلیه معماری هور',
    titleEn: 'Hoor Atelier',
    client: 'استودیو معماری منظر و طراحی داخلی هور',
    industry: 'معماری، دکوراسیون لوکس و ساختمانی',
    services: ['طراحی ویترین دیجیتال', 'عکاسی تعاملی و گالری هوشمند', 'سئو ساختاری معماری'],
    technology: ['HTML5/CSS3 Custom Engine', 'Motion System', 'Responsive Canvas', 'Optimized WebP Engine'],
    year: '۱۴۰۴',
    projectType: 'سایت پورتفولیو و آتلیه برند',
    coverImage: '/src/assets/images/project_luxury_commerce_1791304957706.jpg',
    isDemo: true,
    editorialQuote: '«فضا، نور و تناسبات؛ ترجمه بصری روح معماری به زبان وب بدون سنگین‌شدن تجربه بصری.»',
    challenge: 'نمایش تصاویر پروژه‌های ساختمانی با رزولوشن بسیار بالا بدون افت وحشتناک سرعت بارگذاری در اینترنت موبایل.',
    solution: 'سیستم هوشمند بارگذاری تطبیقی، فریم‌های مینیمال ادیتوریال، تایپوگرافی تمیز با فواصل تنفسی استاندارد و تعاملات حرکتی ظریف در اسکرول.',
    results: [
      { label: 'حجم صفحه اول', value: '۸۲۰ کیلوبایت', detail: 'بهینه‌سازی تصاویر ۴K بدون افت کیفیت محسوس' },
      { label: 'درخواست همکاری هفتگی', value: '+۸۸٪', detail: 'رشد درخواست‌های فرم مشاوره معماری' },
      { label: 'امتیاز Core Web Vitals', value: 'سبز', detail: 'رعایت کلیه استانداردهای سرعت گوگل' }
    ],
    websiteUrlPlaceholder: 'https://demo-hoor.wispaar.com',
    tags: ['معماری', 'پورتفولیو', 'ادیتوریال', 'سرعت بالا']
  },
  {
    id: 'synapse-cloud',
    slug: 'synapse-cloud',
    title: 'سیناپس کلود',
    titleEn: 'Synapse Cloud',
    client: 'ارائه‌دهنده راهکارهای یکپارچه‌سازی سرور و دیتا سنتر',
    industry: 'فناوری اطلاعات و زیرساخت شبکه',
    services: ['طراحی لندینگ پیج تخصصی', 'بهینه‌سازی نرخ تبدیل (CRO)', 'سئو تکنیکال'],
    technology: ['TypeScript', 'Tailwind CSS', 'Vite', 'Schema Generator'],
    year: '۱۴۰۳',
    projectType: 'لندینگ پیج سازمانی و فروش خدمات ابری',
    coverImage: '/src/assets/images/hero_wispaar_digital_1791304917952.jpg',
    isDemo: true,
    editorialQuote: '«وقتی ارزش‌های فنی یک محصول ابری پیچیده در ۳ دقیقه شفاف شود، فروش خودبه‌خود اتفاق می‌افتد.»',
    challenge: 'مشتریان سازمانی در نگاه اول ارزش فنی زیرساخت ابری را متوجه نمی‌شدند و نرخ پرش لندینگ پیج بالا بود.',
    solution: 'بازطراحی کامل جریان روایت لندینگ پیج از درد مشتری به راهکار مهندسی، مقایسه شفاف بدون جدول‌های گیج‌کننده و کال‌تواکشن‌های مرحله‌ای حساب‌شده.',
    results: [
      { label: 'نرخ تبدیل لندینگ', value: '۴.۸٪', detail: 'میانگین صنعت در این حوزه ۱.۲٪ است' },
      { label: 'کاهش بانس ریت', value: '-۳۸٪', detail: 'افزایش توجه تصمیم‌گیرندگان فنی شرکت‌ها' },
      { label: 'امتیاز رضایت کاربران', value: '۹.۴/۱۰', detail: 'بر اساس بازخورد پرسشنامه‌های درون‌صفحه' }
    ],
    websiteUrlPlaceholder: 'https://demo-synapse.wispaar.com',
    tags: ['لندینگ پیج', 'زیرساخت ابری', 'تبدیل', 'B2B']
  }
];
