import React, { useState } from 'react';
import { PageRoute } from '../types';
import { servicesData } from '../data/servicesData';
import { Breadcrumb } from '../components/Breadcrumb';
import { CheckCircle2, ChevronDown, ChevronUp, ArrowUpLeft, Shield, Clock } from 'lucide-react';

interface ServiceDetailPageProps {
  slug: string;
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  slug,
  onNavigate,
}) => {
  const service = servicesData.find((s) => s.slug === slug) || servicesData[0];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-20">
      <Breadcrumb
        items={[
          { label: 'خدمات ویسپار', route: 'services' },
          { label: service.title }
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Header */}
      <section className="max-w-4xl space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF]">
          <span className="bg-[#0A1626] border border-[#172638] px-2 py-0.5 rounded">&lt;/&gt;</span>
          <span>SPECIALIZED DISCIPLINE / {service.titleEn}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-[#F5F8FC] leading-tight">
          {service.title}
        </h1>

        <p className="text-lg text-[#C5D0DD] leading-relaxed">
          {service.shortDescription}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4">
          <button
            onClick={() => onNavigate('start-project')}
            className="px-6 py-3 text-sm font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] rounded-xl transition-all shadow-md shadow-[#1769FF]/25 cursor-pointer"
          >
            درخواست این خدمت برای پروژه شما ←
          </button>
          <button
            onClick={() => onNavigate('portfolio')}
            className="px-5 py-3 text-sm font-medium text-[#C5D0DD] hover:text-white bg-[#0A1626] border border-[#172638] rounded-xl transition-all cursor-pointer"
          >
            مشاهده پروژه‌های مرتبط
          </button>
        </div>
      </section>

      {/* Two Column Grid: Philosophy & Problem Solved */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-b border-[#172638] py-14">
        <div className="bg-[#06111F] border border-[#172638] rounded-2xl p-8 space-y-4">
          <div className="text-xs font-mono text-[#00D9FF] uppercase">
            فلسفه و رویکرد ویسپار
          </div>
          <h2 className="text-xl font-bold text-[#F5F8FC]">
            چرا این کار را این‌گونه انجام می‌دهیم؟
          </h2>
          <p className="text-sm text-[#8C9BAD] leading-relaxed">
            {service.philosophy}
          </p>
          <div className="pt-2 text-xs text-[#4AA3FF]">
            <strong>مزیت بنیادین: </strong> {service.coreBenefit}
          </div>
        </div>

        <div className="bg-[#06111F] border border-[#172638] rounded-2xl p-8 space-y-4">
          <div className="text-xs font-mono text-[#F59E0B] uppercase">
            حل مسئله کسب‌وکار
          </div>
          <h2 className="text-xl font-bold text-[#F5F8FC]">
            این خدمت چه مشکلی را ریشه‌کن می‌کند؟
          </h2>
          <p className="text-sm text-[#8C9BAD] leading-relaxed">
            {service.problemSolved}
          </p>
          <div className="pt-2 text-xs text-[#C5D0DD]">
            <strong>مخاطبان هدف: </strong> {service.targetAudience}
          </div>
        </div>
      </section>

      {/* Deliverables & Outcomes */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Deliverables */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#F5F8FC]">
            اقلام تحویلی رسمی (Deliverables)
          </h2>
          <div className="space-y-3">
            {service.deliverables.map((item, i) => (
              <div
                key={i}
                className="bg-[#06111F] border border-[#172638] rounded-xl p-4 flex items-start gap-3"
              >
                <span className="font-mono text-xs text-[#00D9FF] mt-0.5">0{i + 1}.</span>
                <span className="text-sm text-[#C5D0DD]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expected Outcomes */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#F5F8FC]">
            دستاوردهای پیش‌بینی شده (Outcomes)
          </h2>
          <div className="space-y-3">
            {service.expectedOutcomes.map((item, i) => (
              <div
                key={i}
                className="bg-[#06111F] border border-[#172638] rounded-xl p-4 flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
                <span className="text-sm text-[#F5F8FC]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step by Step Process for this Service */}
      <section className="bg-[#06111F] border border-[#172638] rounded-2xl p-8 lg:p-12 space-y-8">
        <div>
          <div className="text-xs font-mono text-[#00D9FF] uppercase tracking-wider mb-2">
            METHODOLOGY / فرآیند اجرای این خدمت
          </div>
          <h2 className="text-2xl font-bold text-[#F5F8FC]">
            گام‌های اجرای پروژه در استودیو ویسپار
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {service.processSteps.map((step, i) => (
            <div
              key={i}
              className="bg-[#0A1626] border border-[#172638] rounded-xl p-6 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-sm text-[#00D9FF] block mb-3">
                  {step.step}
                </span>
                <h3 className="text-base font-bold text-[#F5F8FC] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[#8C9BAD] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="space-y-6 max-w-3xl">
          <h2 className="text-2xl font-bold text-[#F5F8FC]">
            پرسش‌های متداول پیرامون این خدمت
          </h2>
          <div className="space-y-3">
            {service.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#06111F] border border-[#172638] rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-right p-5 flex items-center justify-between text-sm font-semibold text-[#F5F8FC] hover:text-[#00D9FF] transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#8C9BAD]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#8C9BAD]" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[#8C9BAD] leading-relaxed border-t border-[#172638]/50 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Final Action Bar */}
      <section className="bg-gradient-to-r from-[#06111F] via-[#0A1626] to-[#06111F] border border-[#23364C] rounded-2xl p-8 sm:p-12 text-center space-y-6">
        <h3 className="text-2xl font-bold text-[#F5F8FC]">
          برای آغاز اجرای این خدمت آماده‌اید؟
        </h3>
        <p className="text-sm text-[#8C9BAD] max-w-xl mx-auto">
          فرم بریف ویسپار به شما کمک می‌کند تا تمام نیازمندی‌های این بخش را به‌صورت
          شفاف ثبت کنید.
        </p>
        <button
          onClick={() => onNavigate('start-project')}
          className="px-7 py-3.5 text-sm font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] rounded-xl transition-all shadow-md shadow-[#1769FF]/25 cursor-pointer"
        >
          ثبت بریف پروژه ←
        </button>
      </section>
    </div>
  );
};
