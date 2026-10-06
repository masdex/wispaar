import React, { useState } from 'react';
import { PageRoute } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import {
  Compass,
  FileSearch,
  Layout,
  Palette,
  Code2,
  Gauge,
  Rocket,
  LineChart,
  CheckCircle2,
  ArrowUpLeft
} from 'lucide-react';

interface ProcessPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const ProcessPage: React.FC<ProcessPageProps> = ({ onNavigate }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      stepNumber: '۰۱',
      enTitle: 'Discovery & Deep Brief',
      title: 'کشف، شناخت و تدوین بریف استراتژیک',
      icon: FileSearch,
      summary: 'پیش از نوشتن اولین خط کد، مدل کسب‌وکار، رقبا و نیت واقعی مخاطبان شما را عمیقاً تحلیل می‌کنیم.',
      whatWeDo: [
        'برگزاری جلسات مصاحبه و تحلیل نیازهای تصمیم‌گیرندگان',
        'بررسی دقیق هویت بصری موجود و نقاط قوت برند',
        'تحلیل فنی و پرفورمنس وب‌سایت فعلی (در صورت وجود)',
        'تدوین سند اهداف کمی و کیفی پروژه'
      ],
      clientRole: 'توضیح مأموریت، دغدغه‌های بازاریابی و ارائه دسترسی‌های لازم.',
      deliverable: 'سند بریف پروژه (Creative & Technical Brief) و نقشه اولیه مقیاس.'
    },
    {
      stepNumber: '۰۲',
      enTitle: 'Information Architecture & Strategy',
      title: 'معماری اطلاعات و استراتژی ساختار',
      icon: Compass,
      summary: 'نقشه راه سایت، ارتباط بین صفحات، ساختار URLها و قیف تبدیل مخاطب را مهندسی می‌کنیم.',
      whatWeDo: [
        'طراحی ساختار درختی سایت (Sitemap Architecture)',
        'تعریف سلسله‌مراتب دسته‌بندی‌ها و تگ‌های سئو',
        'طراحی مسیرهای تجربه مشتری (User Journey Mapping)',
        'برنامه‌ریزی نرخ تبدیل و نقاط کلیدی دعوت به اقدام (CTA Strategy)'
      ],
      clientRole: 'تأیید ساختار محتوایی و اولویت‌های تجاری.',
      deliverable: 'نقشه معماری اطلاعات، ساختار صفحات و دیاگرام جریان تبدیل.'
    },
    {
      stepNumber: '۰۳',
      enTitle: 'UX Wireframing & Prototyping',
      title: 'طراحی ساختار تجربه کاربری (UX)',
      icon: Layout,
      summary: 'چیدمان هندسی و متنی هر صفحه را در قالب پروتوتایپ‌های کم‌رنگ بدون رنگ‌آمیزی تزئینی تست می‌کنیم.',
      whatWeDo: [
        'طراحی وایرفریم‌های دقیق تمامی صفحات اصلی و فرعی',
        'نگارش ساختاری تیترها و پیام‌های متقاعدکننده (UX Copywriting)',
        'تست روانشناسی فرم‌ها و حذف فیلدهای مزاحم',
        'تأیید رفتار عناصر در نمایشگرهای موبایل و تبلت'
      ],
      clientRole: 'بررسی روانی فرآیند ثبت درخواست و چیدمان داده‌ها.',
      deliverable: 'پروتوتایپ تعاملی فیگما در حالت Wireframe با سناریوهای کلیک.'
    },
    {
      stepNumber: '۰۴',
      enTitle: 'Visual Design & System',
      title: 'طراحی هویت بصری و دیزاین سیستم (UI)',
      icon: Palette,
      summary: 'خلق زبان بصری ممتاز؛ انتخاب تایپوگرافی فاخر، پالت رنگی هماهنگ و المان‌های تعاملی باوقار.',
      whatWeDo: [
        'خلق دیزاین سیستم اختصاصی بر مبنای هویت ویسپار و برند شما',
        'طراحی صفحات با کیفیت پیکسل‌به‌پیکسل در ابعاد دسکتاپ و موبایل',
        'تعیین رفتارهای هاور (Hover)، میکرواینتراکشن‌ها و موشن‌های ظریف',
        'آماده‌سازی دارایی‌های بصری، گریدها و فریم‌های تصاویر'
      ],
      clientRole: 'بازخورد بر انطباق زیبایی‌شناختی با شأن برند.',
      deliverable: 'دیزاین سیستم کامل (Tokens, Typography, Components) و ماکت نهایی UI.'
    },
    {
      stepNumber: '۰۵',
      enTitle: 'Clean Engineering & Development',
      title: 'کدنویسی تمیز و توسعه فرانت‌اند و بک‌اند',
      icon: Code2,
      summary: 'تبدیل طرح‌های بصری به کدهای ماژولار، استاندارد، سریع و کاملاً بهینه‌شده برای موتورهای جستجو.',
      whatWeDo: [
        'کدنویسی استاندارد و مدرن با بالاترین استانداردهای وب',
        'پیاده‌سازی قالب‌های فوق‌العاده سبک برای وردپرس یا وب‌اپلیکیشن اختصاصی',
        'توسعه پنل مدیریت محتوای ساده و کارآمد بر پایه ACF',
        'کدنویسی ریسپانسیو بی‌نقص برای تمام نمایشگرها (از ۳۶۰ تا ۱۴۴۰ پیکسل)'
      ],
      clientRole: 'مشاهده پیشرفت هفتگی در سرور آزمایشی (Staging).',
      deliverable: 'محیط آزمایشی فعال (Staging Environment) با کدهای تمیز و مستند.'
    },
    {
      stepNumber: '۰۶',
      enTitle: 'Performance & Security Optimization',
      title: 'بهینه‌سازی پرفورمنس، تست سلامت و امنیت',
      icon: Gauge,
      summary: 'جراحی کدهای فرانت‌اند، تست لایت‌هاوس، رفع خطاهای جاوااسکریپت و ایمن‌سازی کامل سرور.',
      whatWeDo: [
        'انطباق ۱۰۰٪ با شاخص‌های Core Web Vitals گوگل (LCP, INP, CLS)',
        'بهینه‌سازی فرمت تصاویر به WebP/AVIF و لود هوشمند تنبل',
        'پیکربندی کش پیشرفته سروری و شبکه توزیع محتوا (CDN)',
        'تست نفوذ امنیتی، ایمن‌سازی دایرکتوری‌ها و جلوگیری از حملات Brute Force'
      ],
      clientRole: 'تست سرعت و تجربه کار با سامانه در اینترنت‌های مختلف.',
      deliverable: 'کارنامه سبز Google PageSpeed و گزارش تست‌های کیفی و امنیتی.'
    },
    {
      stepNumber: '۰۷',
      enTitle: 'Deployment & Seamless Launch',
      title: 'استقرار رسمی، مهاجرت داده و پرواز نهایی',
      icon: Rocket,
      summary: 'انتقال بدون حتی ۱ ثانیه قطعی از محیط تست به هاست و دامنه اصلی همراه با تنظیمات اسکیما و سئو.',
      whatWeDo: [
        'مهاجرت نهایی دیتابیس و فایل‌ها با پشتیبان‌گیری چندمرحله‌ای',
        'تنظیم گواهی SSL، نقشه سایت XML و فایل Robots.txt',
        'اتصال رسمی به Google Search Console و Google Analytics 4',
        'ارائه جلسه آموزشی اختصاصی کار با پنل مدیریت برای کارشناسان شما'
      ],
      clientRole: 'تأیید نهایی انتشار رسمی و حضور در جلسه آموزشی.',
      deliverable: 'سایت آنلاین و پایدار، تحویل سورس‌کدها، فایل آموزشی و شروع دوره گارانتی.'
    },
    {
      stepNumber: '۰۸',
      enTitle: 'Continuous Growth & Support',
      title: 'پایش، پشتیبانی فنی و رشد مستمر',
      icon: LineChart,
      summary: 'رابطه ما با انتشار سایت به پایان نمی‌رسد؛ ما در مسیر رشد، سئو و بهینه‌سازی ادامه‌دار همراه شما هستیم.',
      whatWeDo: [
        'پشتیبانی فنی تضمین‌شده و پاسخگویی به ابهامات تیم شما',
        'پایش خطاهای سرچ کنسول و به‌روزرسانی‌های امنیتی وردپرس و سرور',
        'بررسی دوره‌ای داده‌های آنالیتیکس و پیشنهاد بهبودهای افزایشی',
        'امکان افزودن بخش‌ها و امکانات جدید همگام با مقیاس کسب‌وکار'
      ],
      clientRole: 'ارسال درخواست‌های دوره‌ای و توسعه کسب‌وکار.',
      deliverable: 'گزارش‌های سلامت دوره‌ای و تداوم ثبات فنی.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-20">
      <Breadcrumb items={[{ label: 'فرآیند همکاری' }]} onNavigate={onNavigate} />

      {/* Header */}
      <section className="max-w-4xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF]">
          <span className="bg-[#0A1626] border border-[#172638] px-2 py-0.5 rounded">&lt;/&gt;</span>
          <span>THE 8-STEP COLLABORATION FRAMEWORK</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#F5F8FC] leading-tight">
          فرآیندی شفاف، منضبط و قابل پیش‌بینی از ایده تا مقیاس.
        </h1>
        <p className="text-base sm:text-lg text-[#8C9BAD] leading-relaxed max-w-2xl">
          در استودیو ویسپار، هیچ شانس و اتفاقی وجود ندارد. هر پروژه در چارچوب
          یک متدولوژی مهندسی‌شده ۸ مرحله‌ای طراحی و اجرا می‌شود؛ بدون هزینه‌های
          پنهان و بدون تأخیرهای فرساینده.
        </p>
      </section>

      {/* Interactive Storytelling Visual Timeline */}
      <section className="space-y-10">
        {/* Step Selector Horizontal Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            const isCurrent = activeStep === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                  isCurrent
                    ? 'bg-[#0A1626] border-[#00D9FF] text-[#F5F8FC] shadow-lg shadow-[#00D9FF]/10'
                    : 'bg-[#06111F] border-[#172638] text-[#8C9BAD] hover:border-[#23364C]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-[#00D9FF]">{st.stepNumber}</span>
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#00D9FF]' : 'text-[#536174]'}`} />
                </div>
                <div className="text-xs font-semibold truncate">{st.title.split(' ')[0]}...</div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detailed Card */}
        <div className="bg-[#06111F] border border-[#23364C] rounded-2xl p-8 lg:p-12 transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF]">
                <span>گام {steps[activeStep].stepNumber} از ۰۸</span>
                <span>·</span>
                <span className="font-latin">{steps[activeStep].enTitle}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F8FC]">
                {steps[activeStep].title}
              </h2>

              <p className="text-sm text-[#C5D0DD] leading-relaxed">
                {steps[activeStep].summary}
              </p>

              <div className="p-4 bg-[#0A1626] border border-[#172638] rounded-xl text-xs space-y-2">
                <div>
                  <strong className="text-[#00D9FF] block mb-0.5">خروجی رسمی این گام (Deliverable):</strong>
                  <span className="text-[#F5F8FC]">{steps[activeStep].deliverable}</span>
                </div>
                <div className="pt-2 border-t border-[#172638] text-[#8C9BAD]">
                  <strong className="text-[#C5D0DD] block mb-0.5">نقش و مشارکت کارفرما:</strong>
                  <span>{steps[activeStep].clientRole}</span>
                </div>
              </div>
            </div>

            {/* Checklist of actions in this step */}
            <div className="lg:col-span-7 bg-[#03070D] border border-[#172638] rounded-xl p-6 space-y-4">
              <h3 className="text-xs font-semibold text-[#8C9BAD] uppercase tracking-wider">
                اقدامات دقیق ویسپار در این مرحله:
              </h3>
              <div className="space-y-3">
                {steps[activeStep].whatWeDo.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[#C5D0DD]">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#172638] flex items-center justify-between text-xs text-[#8C9BAD]">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="hover:text-white disabled:opacity-30 disabled:hover:text-[#8C9BAD] cursor-pointer"
                >
                  ← مرحله قبلی
                </button>
                <span>مرحله {activeStep + 1} از ۸</span>
                <button
                  disabled={activeStep === steps.length - 1}
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="hover:text-white disabled:opacity-30 disabled:hover:text-[#8C9BAD] cursor-pointer"
                >
                  مرحله بعدی →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Action */}
      <section className="bg-gradient-to-r from-[#06111F] via-[#0A1626] to-[#06111F] border border-[#23364C] rounded-2xl p-8 lg:p-12 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-[#F5F8FC]">
          برای آغاز گام نخست (Discovery) آماده‌اید؟
        </h3>
        <p className="text-sm text-[#8C9BAD] max-w-xl mx-auto">
          ما فرآیند را از جلسه بریف استراتژیک شروع می‌کنیم. کافی است نیازهای اولیه
          خود را از طریق فرم ثبت نمایید.
        </p>
        <button
          onClick={() => onNavigate('start-project')}
          className="px-6 py-3 text-sm font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] transition-colors rounded-xl shadow-md cursor-pointer"
        >
          شروع پروژه با ویسپار ←
        </button>
      </section>
    </div>
  );
};
