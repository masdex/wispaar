import React, { useState } from 'react';
import { PageRoute } from '../types';
import { projectsData } from '../data/projectsData';
import { Breadcrumb } from '../components/Breadcrumb';
import { ProjectCard } from '../components/ProjectCard';
import { Sparkles, Filter } from 'lucide-react';

interface PortfolioPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
  filterSlug?: string;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onNavigate, filterSlug }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>(
    filterSlug === 'web-design' ? 'web-design' : 'all'
  );

  const industries = [
    { id: 'all', label: 'همه پروژه‌ها' },
    { id: 'web-design', label: 'طراحی اختصاصی وب' },
    { id: 'fintech', label: 'فین‌تک و سرمایه‌گذاری' },
    { id: 'biotech', label: 'علوم زیستی و پزشکی' },
    { id: 'luxury', label: 'معماری و دکوراسیون' },
    { id: 'cloud', label: 'زیرساخت ابری و IT' },
  ];

  const filteredProjects = projectsData.filter((p) => {
    if (selectedIndustry === 'all') return true;
    if (selectedIndustry === 'web-design') return p.services.some((s) => s.includes('طراحی') || s.includes('وب'));
    if (selectedIndustry === 'fintech') return p.industry.includes('فین‌تک');
    if (selectedIndustry === 'biotech') return p.industry.includes('زیستی') || p.industry.includes('سلامت');
    if (selectedIndustry === 'luxury') return p.industry.includes('معماری');
    if (selectedIndustry === 'cloud') return p.industry.includes('شبکه') || p.industry.includes('فناوری');
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-16">
      <Breadcrumb items={[{ label: 'پروژه‌ها (Selected Work)' }]} onNavigate={onNavigate} />

      {/* Hero Exhibition Header */}
      <section className="max-w-4xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF]">
          <span className="bg-[#0A1626] border border-[#172638] px-2 py-0.5 rounded">&lt;/&gt;</span>
          <span>SELECTED WORK / نمایشگاه دیجیتال پروژه‌ها</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#F5F8FC] leading-tight">
          آفرینش‌های دیجیتال؛ تلفیق ساختار، هنر و سرعت.
        </h1>
        <p className="text-base sm:text-lg text-[#8C9BAD] leading-relaxed max-w-2xl">
          هر پروژه مانند یک اثر مستقل مهندسی و دیزاین شده است. در تمام نمونه‌ها،
          استانداردهای مدرن وب، سرعت بهینه و سازگاری با سیستم‌های مدیریت محتوا
          رعایت شده است.
        </p>

        {/* CMS / Demo Transparency Note */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A1626] border border-[#172638] text-xs text-[#8C9BAD]">
          <span className="w-2 h-2 rounded-full bg-[#00D9FF]" />
          <span>پروژه‌ها با ساختار CMS-ready و دارای برچسب شفاف وضعیت (Concept / Demo) هستند.</span>
        </div>
      </section>

      {/* Filter Tabs (Interactive Functional Buttons per Anti-Slop constitution) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {industries.map((ind) => (
          <button
            key={ind.id}
            onClick={() => setSelectedIndustry(ind.id)}
            className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedIndustry === ind.id
                ? 'bg-[#1769FF] text-white shadow-sm'
                : 'bg-[#06111F] text-[#8C9BAD] hover:text-[#F5F8FC] border border-[#172638] hover:border-[#23364C]'
            }`}
          >
            {ind.label}
          </button>
        ))}
      </div>

      {/* Project Exhibition Grid */}
      <section>
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-[#06111F] border border-[#172638] rounded-2xl p-8 text-sm text-[#8C9BAD]">
            پروژه‌ای در این دسته‌بندی یافت نشد. لطفاً گزینه «همه پروژه‌ها» را انتخاب فرمایید.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </section>

      {/* Bottom Conversion Module */}
      <section className="bg-[#06111F] border border-[#172638] rounded-2xl p-8 lg:p-12 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-[#F5F8FC]">
          پروژه بعدی متعلق به برند شماست؟
        </h3>
        <p className="text-sm text-[#8C9BAD] max-w-xl mx-auto">
          ما مشتاقیم تا هویت کسب‌وکار شما را به یک تجربه دیجیتال ملموس و سودآور
          تبدیل کنیم.
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
