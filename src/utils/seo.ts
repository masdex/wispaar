import { PageRoute } from '../types';
import { projectsData } from '../data/projectsData';
import { servicesData } from '../data/servicesData';
import { articlesData } from '../data/articlesData';

export function updatePageMeta(route: PageRoute, slug?: string) {
  let title = 'WISPAAR | ویسپار — آفرینش با خرد';
  let description =
    'استودیو فناوری و طراحی دیجیتال ویسپار (WISPAAR). طراحی و توسعه وب‌سایت‌های اختصاصی، بهینه‌سازی وردپرس، صفحات فرود و استراتژی سئو با رویکرد آفرینش با خرد.';

  if (route === 'home') {
    title = 'WISPAAR | ویسپار — آفرینش با خرد';
    description = 'استودیو فناوری و طراحی دیجیتال ویسپار (WISPAAR). طراحی و توسعه وب‌سایت‌های اختصاصی، مهندسی وردپرس، صفحات فرود و استراتژی سئو.';
  } else if (route === 'about') {
    title = 'درباره ویسپار | فلسفه آفرینش با خرد و مانیفست استودیو';
    description = 'آشنایی با فلسفه و ارزش‌های استودیو فناوری و دیزاین ویسپار: ترکیب خرد انسانی (Wisdom) با مهندسی فناوری (Technology).';
  } else if (route === 'services') {
    title = 'خدمات و راهکارها | استودیو دیجیتال ویسپار';
    description = 'معرفی خدمات تخصصی ویسپار: طراحی اختصاصی وب، مهندسی وردپرس، سئو تکنیکال، لندینگ پیج‌های پرتبدیل و بهینه‌سازی پرفورمنس.';
  } else if (route === 'service-detail') {
    const srv = servicesData.find((s) => s.slug === slug);
    if (srv) {
      title = `${srv.title} | خدمات تخصصی ویسپار`;
      description = srv.shortDescription;
    }
  } else if (route === 'portfolio') {
    title = 'پروژه‌ها و نمونه‌کارها (Selected Work) | ویسپار';
    description = 'منتخب پروژه‌های طراحی و توسعه وب‌سایت، وب‌اپلیکیشن و پورتال‌های اختصاصی خلق‌شده در استودیو ویسپار.';
  } else if (route === 'project-detail') {
    const proj = projectsData.find((p) => p.slug === slug);
    if (proj) {
      title = `${proj.title} — مطالعه موردی طراحی و توسعه | ویسپار`;
      description = `${proj.challenge} — راهکار معماری و نتایج حاصل‌شده در پروژه ${proj.title}.`;
    }
  } else if (route === 'seo') {
    title = 'مطالعات موردی سئو و نتایج رشد ارگانیک | ویسپار';
    description = 'پرونده‌های مستند تحول ساختاری، بهینه‌سازی تکنیکال، رفع خطاهای خزش و رشد ترافیک ارگانیک در پروژه‌های ویسپار.';
  } else if (route === 'process') {
    title = 'فرآیند ۸ مرحله‌ای همکاری | متدولوژی مهندسی ویسپار';
    description = 'نقشه راه شفاف اجرای پروژه‌های وب در ویسپار: از کشف و تدوین بریف استراتژیک تا استقرار و پایش رشد مستمر.';
  } else if (route === 'blog') {
    title = 'ژورنال و یادداشت‌های تخصصی وب (Insights) | ویسپار';
    description = 'تأملات و مقالات تخصصی پیرامون معماری نرم‌افزار، پرفورمنس وب، سئو تکنیکال و روانشناسی تصمیم‌گیری در لندینگ پیج.';
  } else if (route === 'article-detail') {
    const art = articlesData.find((a) => a.slug === slug);
    if (art) {
      title = `${art.title} | ژورنال ویسپار`;
      description = art.excerpt;
    }
  } else if (route === 'start-project') {
    title = 'شروع یک پروژه | بریف هوشمند ۵ مرحله‌ای ویسپار';
    description = 'ثبت سند نیازمندی‌ها، بودجه، زمان‌بندی و اهداف پروژه خود در استودیو دیزاین و فناوری ویسپار.';
  } else if (route === 'contact') {
    title = 'تماس با استودیو ویسپار | مشاوره و استعلام';
    description = 'راه‌های ارتباطی رسمی، ایمیل و ثبت پیام برای گفت‌وگوی استراتژیک با کارشناسان استودیو ویسپار.';
  } else if (route === 'faq') {
    title = 'پرسش‌های متداول (FAQ) | استودیو ویسپار';
    description = 'پاسخ به رایج‌ترین پرسش‌های کارفرمایان پیرامون طراحی اختصاصی، وردپرس، سئو، فرآیند همکاری و پشتیبانی.';
  } else if (route === 'search') {
    title = 'جستجو در پایگاه دانشی و پروژه‌ها | ویسپار';
    description = 'جستجوی هوشمند در پروژه‌ها، مقالات، خدمات و پرسش‌های متداول استودیو دیجیتال ویسپار.';
  } else if (route === 'privacy') {
    title = 'حریم خصوصی و حفاظت از داده‌ها | ویسپار';
    description = 'سیاست‌های حفاظت از حریم داده‌ها و پیمان‌نامه رازداری استودیو ویسپار.';
  } else if (route === 'terms') {
    title = 'شرایط و ضوابط همکاری حرفه‌ای | ویسپار';
    description = 'چارچوب حقوقی و ضوابط همکاری تجاری در پروژه‌های استودیو فناوری و طراحی ویسپار.';
  } else if (route === '404') {
    title = 'صفحه یافت نشد (404) | ویسپار';
    description = 'صفحه مورد نظر شما در دسترس نیست یا نشانی آن تغییر کرده است.';
  }

  // Update DOM Title and Meta
  if (typeof document !== 'undefined') {
    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', title);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', description);
  }
}
