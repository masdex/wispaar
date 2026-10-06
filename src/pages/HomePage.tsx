import React from 'react';
import { PageRoute } from '../types';
import { projectsData } from '../data/projectsData';
import { servicesData } from '../data/servicesData';
import { articlesData } from '../data/articlesData';
import { seoCaseStudiesData } from '../data/seoCaseStudiesData';
import { ProjectCard } from '../components/ProjectCard';
import { SeoCaseStudyCard } from '../components/SeoCaseStudyCard';
import {
  ArrowUpLeft,
  Layers,
  Code,
  Gauge,
  Sparkles,
  TrendingUp,
  Compass,
  CheckCircle2,
  Workflow
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-24 md:space-y-36 pb-20">
      {/* 01. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute top-1/4 right-1/2 w-96 h-96 bg-[#1769FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-[#00D9FF]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Visual Signature & Motto */}
            <div className="flex items-center gap-3 text-xs md:text-sm text-[#00D9FF] font-mono mb-6">
              <span className="bg-[#0A1626] border border-[#172638] px-2 py-0.5 rounded text-xs text-[#00D9FF]">
                &lt;/&gt;
              </span>
              <span>WISDOM + TECHNOLOGY</span>
              <span className="text-[#536174]">/</span>
              <span className="text-[#C5D0DD] font-sans font-medium">آفرینش با خرد</span>
            </div>

            {/* Oversized Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F8FC] leading-[1.25] sm:leading-[1.2] mb-8 text-balance">
              ایده‌ها را فقط اجرا نمی‌کنیم؛
              <br />
              آن‌ها را به{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#00D9FF] via-[#1769FF] to-[#6366F1]">
                تجربه‌های دیجیتال ماندگار
              </span>{' '}
              تبدیل می‌کنیم.
            </h1>

            {/* Sub-kicker / Value Proposition */}
            <p className="text-base sm:text-xl text-[#8C9BAD] leading-relaxed max-w-2xl mb-10 text-balance">
              ویسپار یک استودیو فناوری و طراحی دیجیتال است. ما وب‌سایت‌های
              اختصاصی، زیرساخت مهندسی وردپرس، لندینگ‌پیج‌های پرتبدیل و سئو
              تکنیکال را با استانداردهای بین‌المللی خلق می‌کنیم.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('start-project')}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] active:scale-[0.98] transition-all rounded-xl shadow-lg shadow-[#1769FF]/25 flex items-center gap-2 cursor-pointer"
              >
                <span>شروع یک پروژه</span>
                <span className="font-mono text-xs opacity-75">←</span>
              </button>

              <button
                onClick={() => onNavigate('portfolio')}
                className="px-6 py-3.5 text-sm font-medium text-[#F5F8FC] bg-[#0A1626] hover:bg-[#0F2035] border border-[#23364C] rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>مشاهده نمونه‌کارها</span>
                <ArrowUpLeft className="w-4 h-4 text-[#8C9BAD]" />
              </button>
            </div>
          </div>

          {/* Marquee Visual Frame Showcase */}
          <div className="mt-14 lg:mt-20 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#172638] bg-[#06111F] shadow-2xl">
              {/* Header bar of visual container */}
              <div className="px-4 py-3 bg-[#03070D] border-b border-[#172638] flex items-center justify-between text-xs text-[#8C9BAD]">
                <div className="flex items-center gap-2 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/60" />
                  <span className="mr-3 text-[#536174]">wispaar.digital/experience</span>
                </div>
                <div className="text-[11px] font-mono text-[#00D9FF]">
                  &lt;DESIGN + CODE&gt;
                </div>
              </div>

              {/* Marquee generated studio visual */}
              <div className="relative aspect-[16/9] max-h-[560px] overflow-hidden">
                <img
                  src="/src/assets/images/hero_wispaar_digital_1791304917952.jpg"
                  alt="محیط استودیو خلاق و فناوری ویسپار"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03070D] via-transparent to-transparent opacity-80" />

                {/* Overlay Quote / Micro Badge */}
                <div className="absolute bottom-6 right-6 left-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                  <div className="bg-[#03070D]/85 border border-[#23364C] backdrop-blur-md p-4 rounded-xl max-w-md">
                    <div className="text-xs text-[#00D9FF] font-mono mb-1">
                      MANIFESTO SUMMARY
                    </div>
                    <div className="text-sm text-[#F5F8FC] font-medium leading-snug">
                      «ترکیب تفکر استراتژیک، هندسه بدون نقص و کدهای سبک؛ برای ساختن وب‌سایتی که خود دارایی ماندگار برند شما باشد.»
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#8C9BAD] bg-[#03070D]/80 border border-[#172638] px-3.5 py-2 rounded-lg backdrop-blur-sm font-mono">
                    <span>PERFORMANCE: 99+</span>
                    <span>·</span>
                    <span>WCAG AA COMPLIANT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02. BRAND MANIFESTO SECTION */}
      <section className="relative border-y border-[#172638]/60 bg-[#06111F]/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-4">
              <span className="text-xs font-mono text-[#00D9FF] uppercase tracking-wider block mb-3">
                02. THE WISPAAR MANIFESTO
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F8FC] leading-snug">
                فناوری بدون فکر، فقط کد است.
                <br />
                طراحی بدون هدف، فقط ظاهر است.
              </h2>
            </div>

            <div className="lg:col-span-8 space-y-4 text-base text-[#C5D0DD] leading-relaxed border-r-0 lg:border-r lg:border-[#172638] lg:pr-10">
              <p>
                در بازار امروز، اینترنت پر از قالب‌های آماده کپی‌شده، وب‌سایت‌های
                سنگین و شعارهای توخالی است که هیچ هویت مستقلی خلق نمی‌کنند. ویسپار
                بر پایه ترکیب دو مفهوم متولد شد: <strong className="text-[#F5F8FC]">Wisdom (خرد و استراتژی)</strong> و{' '}
                <strong className="text-[#F5F8FC]">Technology (فناوری و مهندسی)</strong>.
              </p>
              <p className="text-[#8C9BAD]">
                ما باور داریم که طراحی یک وب‌سایت پیش از هر خط کد، نیازمند فهم عمیق
                از مدل کسب‌وکار، تحلیل روانشناسی مخاطب و چینش یک نقشه مسیر
                بی‌نقص است. ما کدها را نه برای سنگین‌کردن صفحه، بلکه برای حل
                مسئله و خلق شگفتی پایدار می‌نویسیم.
              </p>
              <div className="pt-2 flex items-center gap-6 text-sm text-[#00D9FF]">
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:underline flex items-center gap-1 font-medium"
                >
                  <span>بیشتر درباره فلسفه و نگاه ویسپار بخوانید</span>
                  <span className="font-mono text-xs">←</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03. SELECTED WORK (PORTFOLIO SHOWCASE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono text-[#00D9FF] uppercase tracking-wider mb-2">
              03. SELECTED WORK / پروژه‌های برگزیده
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#F5F8FC]">
              آثاری که استانداردهای وب را ارتقا می‌دهند
            </h2>
          </div>
          <button
            onClick={() => onNavigate('portfolio')}
            className="text-sm font-medium text-[#4AA3FF] hover:text-[#00D9FF] transition-colors flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>مشاهده همه پروژه‌ها در گالری اختصاصی</span>
            <ArrowUpLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Editorial Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projectsData.slice(0, 4).map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              onNavigate={onNavigate}
              featured={idx === 0}
            />
          ))}
        </div>
      </section>

      {/* 04. CORE SERVICES ARCHITECTURE */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-mono text-[#00D9FF] uppercase tracking-wider mb-2">
            04. WHAT WE DO / قلمرو خدمات ویسپار
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#F5F8FC] mb-4">
            راهکارهایی با عمق مهندسی و بازدهی ملموس
          </h2>
          <p className="text-base text-[#8C9BAD] leading-relaxed">
            ما خدمات را به‌صورت بسته‌های سطحی ارائه نمی‌دهیم؛ هر خدمت در ویسپار
            یک متدولوژی اختصاصی برای غلبه بر چالش‌های فنی و دستیابی به رشد تجاری
            است.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service, idx) => (
            <div
              key={service.id}
              className="bg-[#06111F] border border-[#172638] rounded-xl p-7 hover:border-[#23364C] transition-all flex flex-col justify-between group hover:bg-[#08172b]"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#8C9BAD] mb-4">
                  <span className="font-mono text-[#00D9FF]">0{idx + 1}.</span>
                  <span className="font-latin">{service.titleEn}</span>
                </div>

                <h3 className="text-lg font-bold text-[#F5F8FC] group-hover:text-[#00D9FF] transition-colors mb-3">
                  {service.title}
                </h3>

                <p className="text-sm text-[#8C9BAD] leading-relaxed mb-6">
                  {service.shortDescription}
                </p>

                {/* Key Deliverables Bullet Points */}
                <div className="space-y-2 mb-6 border-t border-[#172638]/70 pt-4">
                  <div className="text-[11px] font-semibold text-[#C5D0DD]">دستاوردهای کلیدی:</div>
                  {service.deliverables.slice(0, 3).map((d, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#8C9BAD]">
                      <span className="text-[#00D9FF] mt-1 shrink-0">•</span>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#172638] flex items-center justify-between">
                <button
                  onClick={() => onNavigate('service-detail', service.slug)}
                  className="text-xs font-semibold text-[#4AA3FF] group-hover:text-[#00D9FF] transition-colors flex items-center gap-1"
                >
                  <span>بررسی ساختار و جزئیات خدمت</span>
                  <ArrowUpLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Special IT / Future-Ready Block */}
          <div className="bg-gradient-to-br from-[#0A1626] to-[#06111F] border border-[#23364C] rounded-xl p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#8C9BAD] mb-4">
                <span className="font-mono text-[#00D9FF]">06.</span>
                <span className="font-latin">Custom Digital & IT Solutions</span>
              </div>
              <h3 className="text-lg font-bold text-[#F5F8FC] mb-3">
                راهکارهای یکپارچه دیجیتال و IT
              </h3>
              <p className="text-sm text-[#8C9BAD] leading-relaxed mb-6">
                اتصال وب‌سایت به پایگاه‌های داده اختصاصی، اتوماسیون داده‌ها،
                سیستم‌های مدیریت ارتباط با مشتری (CRM)، و راهکارهای مقیاس‌پذیر
                برای آینده برند.
              </p>
            </div>
            <button
              onClick={() => onNavigate('start-project')}
              className="text-xs font-semibold text-[#00D9FF] hover:underline flex items-center gap-1"
            >
              <span>درخواست جلسه مشاوره فنی</span>
              <span className="font-mono text-xs">←</span>
            </button>
          </div>
        </div>
      </section>

      {/* 05. SEO & PERFORMANCE SHOWCASE */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#06111F] border border-[#172638] rounded-2xl p-8 lg:p-12 relative overflow-hidden">
          <div className="max-w-2xl mb-10">
            <div className="text-xs font-mono text-[#00D9FF] uppercase tracking-wider mb-2">
              05. PROOF OF IMPACT / مهندسی نتایج و سئو
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F8FC] mb-4">
              سئو بدون اغراق؛ معماری داده و رشد ارگانیک
            </h2>
            <p className="text-sm text-[#8C9BAD] leading-relaxed">
              ما ادعای رتبه‌های ساختگی تولید نمی‌کنیم. ما سیستم‌های خزش، متاتگ‌ها،
              اسکیما و کلاسترهای محتوایی را طوری مهندسی می‌کنیم که ترافیک هدفمند
              شما رشد تصاعدی و پایدار پیدا کند.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {seoCaseStudiesData.map((cs) => (
              <SeoCaseStudyCard
                key={cs.id}
                caseStudy={cs}
                onNavigate={onNavigate}
              />
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-[#172638] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C9BAD]">
            <div>
              تمامی پروژه‌های سئو دارای ماژول شفاف Before / After و گزارش‌های
              مستقیم سرچ‌کنسول هستند.
            </div>
            <button
              onClick={() => onNavigate('seo')}
              className="text-[#4AA3FF] hover:text-[#00D9FF] font-medium"
            >
              مشاهده تمامی مطالعات موردی سئو ←
            </button>
          </div>
        </div>
      </section>

      {/* 06. THE 8-STEP PROCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono text-[#00D9FF] uppercase tracking-wider mb-2">
            06. PROCESS / فرآیند ۸ مرحله‌ای همکاری
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#F5F8FC] mb-4">
            نظم، شفافیت و همراهی گام‌به‌گام
          </h2>
          <p className="text-base text-[#8C9BAD] leading-relaxed">
            هیچ ابهامی در مسیر تولید اثر وجود ندارد. مراحل از تحقیق تا پرواز نهایی
            سایت با گزارش‌دهی دقیق پیش می‌روند.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: '۰۱', title: 'کشف و بریف', desc: 'تحلیل دقیق مدل تجاری و هویت برند' },
            { num: '۰۲', title: 'استراتژی', desc: 'نقشه معماری اطلاعات و سناریوهای کاربر' },
            { num: '۰۳', title: 'طراحی UX', desc: 'وایرفریم‌های ساختاری و روانشناسی کلیک' },
            { num: '۰۴', title: 'طراحی UI', desc: 'خلق زبان بصری ممتاز و سیستم دیزاین' },
            { num: '۰۵', title: 'توسعه فنی', desc: 'کدنویسی تمیز با پرفورمنس حداکثری' },
            { num: '۰۶', title: 'بهینه‌سازی', desc: 'تست‌های امنیت، لایت‌هاوس و ریسپانسیو' },
            { num: '۰۷', title: 'استقرار و پرواز', desc: 'انتقال به سرور و راه‌اندازی بدون قطعی' },
            { num: '۰۸', title: 'رشد و پایش', desc: 'پایش سئو، آنالیز رفتار و پشتیبانی' },
          ].map((step, idx) => (
            <div
              key={idx}
              className="bg-[#06111F] border border-[#172638] rounded-xl p-5 hover:border-[#23364C] transition-colors"
            >
              <div className="text-xs font-mono text-[#00D9FF] mb-2">{step.num}</div>
              <div className="text-sm font-bold text-[#F5F8FC] mb-1">{step.title}</div>
              <div className="text-xs text-[#8C9BAD] leading-relaxed">{step.desc}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('process')}
            className="text-xs text-[#4AA3FF] hover:underline"
          >
            مشاهده تشریح کامل متدولوژی فرآیند همکاری در ویسپار ←
          </button>
        </div>
      </section>

      {/* 07. EDITORIAL JOURNAL / INSIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono text-[#00D9FF] uppercase tracking-wider mb-2">
              07. INSIGHTS / یادداشت‌ها و تأملات ویسپار
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#F5F8FC]">
              دانش تخصصی، بدون ادبیات بازاریابی کلیشه‌ای
            </h2>
          </div>
          <button
            onClick={() => onNavigate('blog')}
            className="text-sm font-medium text-[#4AA3FF] hover:text-[#00D9FF] transition-colors flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>مشاهده همه یادداشت‌ها</span>
            <ArrowUpLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articlesData.slice(0, 3).map((article) => (
            <article
              key={article.id}
              onClick={() => onNavigate('article-detail', article.slug)}
              className="bg-[#06111F] border border-[#172638] hover:border-[#23364C] transition-all rounded-xl p-6 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-[#8C9BAD] mb-3">
                  <span>{article.category}</span>
                  <span aria-hidden="true" className="text-[#536174]">·</span>
                  <span>{article.readTime} مطالعه</span>
                </div>
                <h3 className="text-base font-bold text-[#F5F8FC] group-hover:text-[#00D9FF] transition-colors leading-snug mb-3">
                  {article.title}
                </h3>
                <p className="text-xs text-[#8C9BAD] line-clamp-3 leading-relaxed mb-6">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[#172638] flex items-center justify-between text-xs text-[#536174]">
                <span>{article.publishedDate}</span>
                <span className="text-[#4AA3FF] group-hover:text-[#00D9FF] font-medium flex items-center gap-1">
                  مطالعه
                  <ArrowUpLeft className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 08. START A PROJECT CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#06111F] via-[#0A1626] to-[#06111F] border border-[#23364C] rounded-2xl p-8 sm:p-14 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6">
            <span className="font-mono text-xs text-[#00D9FF] bg-[#03070D] border border-[#172638] px-3 py-1 rounded">
              &lt;INITIATE COLLABORATION&gt;
            </span>

            <h2 className="text-2xl sm:text-4xl font-bold text-[#F5F8FC] leading-tight">
              آماده‌اید وب‌سایت برند خود را به یک اثر متمایز تبدیل کنید؟
            </h2>

            <p className="text-sm sm:text-base text-[#8C9BAD] leading-relaxed">
              با تکمیل بریف مرحله‌ای ویسپار، اهداف و نیازمندی‌های پروژه خود را
              در ۵ گام مشخص فرمایید تا در کمترین زمان برای یک گفت‌وگوی استراتژیک
              با شما تماس بگیریم.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('start-project')}
                className="px-7 py-3.5 text-sm font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] active:scale-[0.98] transition-all rounded-xl shadow-lg shadow-[#1769FF]/25 cursor-pointer"
              >
                شروع یک پروژه با ویسپار ←
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3.5 text-sm font-medium text-[#C5D0DD] hover:text-white bg-[#03070D] border border-[#172638] rounded-xl transition-all cursor-pointer"
              >
                ارتباط مستقیم و اطلاعات تماس
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
