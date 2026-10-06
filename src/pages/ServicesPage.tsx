import React from 'react';
import { PageRoute } from '../types';
import { servicesData } from '../data/servicesData';
import { Breadcrumb } from '../components/Breadcrumb';
import { ArrowUpLeft, CheckCircle2, ChevronDown, Wrench } from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-24">
      <Breadcrumb items={[{ label: 'خدمات تخصصی' }]} onNavigate={onNavigate} />

      {/* Hero */}
      <section className="max-w-4xl">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF] mb-3">
          <span className="bg-[#0A1626] border border-[#172638] px-2 py-0.5 rounded">&lt;/&gt;</span>
          <span>DISCIPLINES & CAPABILITIES / خدمات و راهکارها</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#F5F8FC] leading-tight mb-6">
          طراحی، توسعه و بهینه‌سازی دیجیتال؛ فراتر از کلیشه‌های مرسوم وب.
        </h1>
        <p className="text-base sm:text-lg text-[#8C9BAD] leading-relaxed max-w-2xl">
          هر خدمت در ویسپار پاسخی مهندسی‌شده به یک نیاز حیاتی کسب‌وکار است: از
          ساخت وب‌سایت‌های منحصربه‌فرد گرفته تا بازمهندسی وردپرس، سئو پایدار و
          صفحات فرود پربازده.
        </p>
      </section>

      {/* Services Breakdown List (Editorial Full Width Cards) */}
      <section className="space-y-12">
        {servicesData.map((service, idx) => (
          <div
            key={service.id}
            id={service.slug}
            className="bg-[#06111F] border border-[#172638] rounded-2xl p-8 lg:p-12 hover:border-[#23364C] transition-all"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Title & Philosophy */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-3 text-xs font-mono text-[#00D9FF]">
                  <span>0{idx + 1}.</span>
                  <span className="font-latin">{service.titleEn}</span>
                </div>

                <h2 className="text-2xl font-bold text-[#F5F8FC]">
                  {service.title}
                </h2>

                <p className="text-sm text-[#C5D0DD] leading-relaxed">
                  {service.shortDescription}
                </p>

                <div className="p-4 bg-[#0A1626] border border-[#172638] rounded-xl text-xs text-[#8C9BAD] leading-relaxed">
                  <span className="text-[#00D9FF] font-medium block mb-1">فلسفه طراحی این خدمت:</span>
                  {service.philosophy}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('service-detail', service.slug)}
                    className="text-sm font-semibold text-[#1769FF] hover:text-[#00D9FF] transition-colors flex items-center gap-1.5"
                  >
                    <span>مشاهده صفحه مستقل و چک‌لیست این خدمت</span>
                    <ArrowUpLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Outcomes & Deliverables */}
              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#03070D]/50 p-6 rounded-xl border border-[#172638]/70">
                {/* Deliverables */}
                <div>
                  <h3 className="text-xs font-semibold text-[#F5F8FC] uppercase tracking-wider mb-3">
                    اقلام تحویلی (Deliverables)
                  </h3>
                  <ul className="space-y-2 text-xs text-[#8C9BAD]">
                    {service.deliverables.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#00D9FF] mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Expected Outcomes */}
                <div>
                  <h3 className="text-xs font-semibold text-[#F5F8FC] uppercase tracking-wider mb-3">
                    نتایج و اثر ملموس (Expected Outcomes)
                  </h3>
                  <ul className="space-y-2 text-xs text-[#C5D0DD]">
                    {service.expectedOutcomes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 pt-4 border-t border-[#172638] text-[11px] text-[#536174]">
                    <strong>مناسب برای: </strong>
                    {service.targetAudience}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Philosophy of Engagement */}
      <section className="bg-gradient-to-l from-[#06111F] via-[#0A1626] to-[#06111F] border border-[#23364C] rounded-2xl p-8 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F8FC]">
          سفارشی‌سازی بر اساس مأموریت برند شما
        </h2>
        <p className="text-sm text-[#8C9BAD] max-w-2xl mx-auto leading-relaxed">
          نیاز پروژه شما در قالب‌های آماده نمی‌گنجد؟ ما ساختار پیشنهادی را بر اساس
          اهداف استراتژیک شما تلفیق می‌کنیم.
        </p>
        <button
          onClick={() => onNavigate('start-project')}
          className="px-6 py-3 text-sm font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] transition-colors rounded-xl shadow-lg shadow-[#1769FF]/20"
        >
          طراحی بریف سفارشی با ویسپار ←
        </button>
      </section>
    </div>
  );
};
