import React, { useState } from 'react';
import { PageRoute } from '../types';
import { seoCaseStudiesData } from '../data/seoCaseStudiesData';
import { Breadcrumb } from '../components/Breadcrumb';
import { SeoCaseStudyCard } from '../components/SeoCaseStudyCard';
import {
  TrendingUp,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ChevronDown,
  Layers,
  BarChart3
} from 'lucide-react';

interface SeoCaseStudiesPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const SeoCaseStudiesPage: React.FC<SeoCaseStudiesPageProps> = ({ onNavigate }) => {
  const [activeCaseStudyId, setActiveCaseStudyId] = useState(seoCaseStudiesData[0].id);
  const activeStudy = seoCaseStudiesData.find((s) => s.id === activeCaseStudyId) || seoCaseStudiesData[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-20">
      <Breadcrumb items={[{ label: 'مطالعات موردی سئو و نتایج' }]} onNavigate={onNavigate} />

      {/* Header */}
      <section className="max-w-4xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF]">
          <span className="bg-[#0A1626] border border-[#172638] px-2 py-0.5 rounded">&lt;/&gt;</span>
          <span>SEO CASE STUDIES / مهندسی رتبه پایدار و سئو تکنیکال</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#F5F8FC] leading-tight">
          پرونده‌های واقعی تحول ساختاری و رشد ارگانیک
        </h1>
        <p className="text-base sm:text-lg text-[#8C9BAD] leading-relaxed max-w-2xl">
          ما سئو را به شیوه سنتی اجرا نمی‌کنیم. تمرکز ویسپار بر رفع گره‌های عمیق
          تکنیکال، پاک‌سازی خطاهای خزش، بهبود ساختار اسکیما و کلاسترینگ معنایی
          محتواست؛ نتیجه‌ای که حتی با سخت‌گیرانه‌ترین آپدیت‌های هسته گوگل پایدار
          می‌ماند.
        </p>

        <div className="p-3 bg-[#06111F] border border-[#172638] rounded-xl text-xs text-[#8C9BAD] flex items-center gap-2 max-w-xl">
          <AlertCircle className="w-4 h-4 text-[#00D9FF] shrink-0" />
          <span>
            سیاست شفافیت ویسپار: هیچ داده‌ای دستکاری نشده و ارقام در قالب فیلدهای
            استاندارد CMS نمایش داده می‌شوند.
          </span>
        </div>
      </section>

      {/* Case Study Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#172638]">
        {seoCaseStudiesData.map((cs) => (
          <button
            key={cs.id}
            onClick={() => setActiveCaseStudyId(cs.id)}
            className={`px-4 py-2.5 text-xs font-medium rounded-t-lg transition-colors cursor-pointer ${
              activeCaseStudyId === cs.id
                ? 'bg-[#06111F] text-[#00D9FF] border-t-2 border-r border-l border-[#00D9FF] border-t-[#00D9FF]'
                : 'text-[#8C9BAD] hover:text-[#F5F8FC]'
            }`}
          >
            {cs.clientTitle}
          </button>
        ))}
      </div>

      {/* Detailed Active Case Study Breakdown */}
      <section className="bg-[#06111F] border border-[#172638] rounded-2xl p-8 lg:p-12 space-y-12">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#172638]">
          <div>
            <div className="text-xs font-mono text-[#00D9FF] mb-1">
              {activeStudy.industry} · {activeStudy.duration}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F8FC]">
              {activeStudy.clientTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('start-project')}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] rounded-xl transition-all shadow-sm"
            >
              درخواست ممیزی سئو برای سایت شما
            </button>
          </div>
        </div>

        {/* Before / After Transformation Visual Module */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[#8C9BAD] uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#00D9FF]" />
            <span>ماژول ممیزی تحول: وضعیت اولیه در برابر وضعیت مهندسی‌شده (Before / After)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before Box */}
            <div className="bg-[#03070D] border border-[#EF4444]/30 rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#EF4444] font-bold">وضعیت قبل از اقدام ویسپار (BEFORE)</span>
              </div>
              <p className="text-sm text-[#C5D0DD] leading-relaxed">
                {activeStudy.initialSituation}
              </p>
              <div className="p-3 bg-[#0A1626] rounded-lg border border-[#172638] text-xs text-[#8C9BAD]">
                <strong className="text-[#EF4444] block mb-1">معیار اولیه: </strong>
                {activeStudy.beforeMetric}
              </div>
            </div>

            {/* After Box */}
            <div className="bg-[#03070D] border border-[#22C55E]/30 rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#22C55E] font-bold">وضعیت پس از مداخله مهندسی (AFTER)</span>
              </div>
              <p className="text-sm text-[#F5F8FC] leading-relaxed">
                {activeStudy.strategy}
              </p>
              <div className="p-3 bg-[#0A1626] rounded-lg border border-[#172638] text-xs text-[#00D9FF]">
                <strong className="text-[#22C55E] block mb-1">نتیجه ثبت‌شده: </strong>
                {activeStudy.afterMetric}
              </div>
            </div>
          </div>
        </div>

        {/* Growth KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-[#0A1626] border border-[#172638] rounded-xl p-6">
          <div className="space-y-1">
            <div className="text-xs text-[#8C9BAD]">شاخص رشد ترافیک ارگانیک</div>
            <div className="text-xl font-mono font-bold text-[#00D9FF]">
              {activeStudy.organicGrowthIndicator}
            </div>
            <div className="text-[11px] text-[#536174]">داده مستقیم سرچ کنسول</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-[#8C9BAD]">تسخیر کلمات صفحه اول</div>
            <div className="text-xl font-mono font-bold text-[#22C55E]">
              {activeStudy.keywordGrowthIndicator}
            </div>
            <div className="text-[11px] text-[#536174]">در کوئری‌های با قصد خرید بالا</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-[#8C9BAD]">شاخص نرخ تبدیل و سرنخ تجاری</div>
            <div className="text-xl font-mono font-bold text-[#F5F8FC]">
              {activeStudy.conversionIndicator}
            </div>
            <div className="text-[11px] text-[#536174]">ورودی‌های منتهی به درخواست قیمت</div>
          </div>
        </div>

        {/* Engineering Strategies Deep-Dive (4 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-[#172638]">
          {/* 1. Technical */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#F5F8FC] uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-[#00D9FF]">01.</span>
              <span>بهبودهای تکنیکال</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#8C9BAD]">
              {activeStudy.technicalImprovements.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#00D9FF] shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Content */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#F5F8FC] uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-[#00D9FF]">02.</span>
              <span>استراتژی کلاستر محتوا</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#8C9BAD]">
              {activeStudy.contentStrategy.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#00D9FF] shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. On-Page */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#F5F8FC] uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-[#00D9FF]">03.</span>
              <span>بهینه‌سازی درون‌صفحه‌ای</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#8C9BAD]">
              {activeStudy.onPageOptimization.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#00D9FF] shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Performance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#F5F8FC] uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-[#00D9FF]">04.</span>
              <span>سرعت و پرفورمنس سرور</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#8C9BAD]">
              {activeStudy.performanceImprovements.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#00D9FF] shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-[#03070D] rounded-xl border border-[#172638] text-xs text-[#536174]">
          <strong>یادداشت مستندات: </strong> {activeStudy.notes}
        </div>
      </section>

      {/* Conversion Banner */}
      <section className="bg-gradient-to-r from-[#06111F] via-[#0A1626] to-[#06111F] border border-[#23364C] rounded-2xl p-8 lg:p-12 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-[#F5F8FC]">
          سایت شما هم با مشکلات ایندکس، افت ترافیک یا رتبه‌های راکد دست‌وپنجه نرم می‌کند؟
        </h3>
        <p className="text-sm text-[#8C9BAD] max-w-xl mx-auto">
          تیم ویسپار با یک ممیزی اولیه ۳۶۰ درجه، گلوگاه‌های فنی را شناسایی و
          نقشه راه شفاف را برای شما ترسیم می‌کند.
        </p>
        <button
          onClick={() => onNavigate('start-project')}
          className="px-6 py-3 text-sm font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] transition-colors rounded-xl shadow-md cursor-pointer"
        >
          درخواست ممیزی سئو تکنیکال ←
        </button>
      </section>
    </div>
  );
};
