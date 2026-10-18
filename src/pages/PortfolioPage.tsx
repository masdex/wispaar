import React, { useState, useMemo } from 'react';
import { PageRoute, Project } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { ProjectCard } from '../components/ProjectCard';
import { Sparkles, Layers, ArrowLeft } from 'lucide-react';
import { useHeadless } from '../context/HeadlessContext';

interface PortfolioPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
  filterSlug?: string;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onNavigate, filterSlug }) => {
  const { projects: projectsList, isSyncing } = useHeadless();

  // Dynamically extract all unique categories/taxonomies from loaded projects
  const dynamicCategories = useMemo(() => {
    const set = new Set<string>();
    projectsList.forEach((p) => {
      if (p.industry) set.add(p.industry.trim());
      if (Array.isArray(p.tags)) {
        p.tags.forEach((t) => {
          if (t && t !== 'وردپرس هدلس' && t.trim() !== '') {
            set.add(t.trim());
          }
        });
      }
    });
    return Array.from(set);
  }, [projectsList]);

  // Map service slug or initial filter to corresponding category
  const initialCategory = useMemo(() => {
    if (!filterSlug) return 'all';
    const s = filterSlug.toLowerCase();
    if (s === 'web-design' || s.includes('web')) return 'web-design';
    if (s === 'wordpress-development' || s.includes('wordpress')) return 'wordpress';
    if (s === 'technical-seo' || s.includes('seo')) return 'seo';
    if (s === 'conversion-rate-landing' || s.includes('landing')) return 'landing';
    if (s === 'speed-optimization' || s.includes('speed')) return 'speed';
    if (s === 'it-consulting' || s.includes('consulting')) return 'consulting';

    const matched = dynamicCategories.find(
      (c) => c.toLowerCase().includes(s) || s.includes(c.toLowerCase())
    );
    return matched || 'all';
  }, [filterSlug, dynamicCategories]);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  // Build filter tabs
  const filterTabs = useMemo(() => {
    const list = [{ id: 'all', label: 'همه پروژه‌ها' }];
    dynamicCategories.forEach((cat) => {
      list.push({ id: cat, label: cat });
    });
    return list;
  }, [dynamicCategories]);

  // Filter projects accurately
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') return projectsList;

    return projectsList.filter((p: Project) => {
      // Alias check for service slugs
      if (selectedCategory === 'web-design') {
        return (
          p.services.some((s) => s.includes('طراحی') || s.includes('وب')) ||
          p.industry.includes('وب') ||
          p.projectType.includes('وب') ||
          p.relatedService === 'web-design'
        );
      }
      if (selectedCategory === 'wordpress') {
        return (
          p.services.some((s) => s.includes('وردپرس')) ||
          p.technology.some((t) => t.toLowerCase().includes('wordpress')) ||
          p.relatedService === 'wordpress-development'
        );
      }
      if (selectedCategory === 'seo') {
        return (
          p.services.some((s) => s.includes('سئو') || s.toLowerCase().includes('seo')) ||
          Boolean(p.seoMetrics && p.seoMetrics.length > 0) ||
          p.relatedService === 'technical-seo'
        );
      }
      if (selectedCategory === 'landing') {
        return (
          p.services.some((s) => s.includes('لندینگ') || s.includes('تبدیل')) ||
          p.projectType.includes('لندینگ') ||
          p.relatedService === 'conversion-rate-landing'
        );
      }
      if (selectedCategory === 'speed') {
        return (
          p.services.some((s) => s.includes('سرعت') || s.includes('پرفورمنس')) ||
          p.relatedService === 'speed-optimization'
        );
      }
      if (selectedCategory === 'consulting') {
        return (
          p.services.some((s) => s.includes('مشاوره') || s.includes('یکپارچه')) ||
          p.relatedService === 'it-consulting'
        );
      }

      // Exact or partial category / taxonomy match
      const inIndustry = p.industry.trim().toLowerCase() === selectedCategory.trim().toLowerCase();
      const inTags = p.tags && p.tags.some((t) => t.trim().toLowerCase() === selectedCategory.trim().toLowerCase());
      const inServices = p.services && p.services.some((s) => s.includes(selectedCategory));
      const inType = p.projectType && p.projectType.includes(selectedCategory);

      return inIndustry || inTags || inServices || inType;
    });
  }, [projectsList, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-16">
      <Breadcrumb items={[{ label: 'نمونه‌کارها و پروژه‌ها (Selected Work)' }]} onNavigate={onNavigate} />

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
          هر پروژه در استودیو ویسپار مانند یک اثر مستقل مهندسی خلق می‌شود. در تمام نمونه‌ها،
          سرعت بهینه، دیزاین اختصاصی و انطباق کامل با نیازهای کارفرما لحاظ شده است.
        </p>
      </section>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#172638]/70">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-[#1769FF] text-white shadow-md shadow-[#1769FF]/20 font-semibold'
                : 'bg-[#06111F] text-[#8C9BAD] hover:text-[#F5F8FC] border border-[#172638] hover:border-[#23364C]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Project Exhibition Grid */}
      <section>
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-[#06111F] border border-[#172638] rounded-2xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#0A1626] border border-[#172638] flex items-center justify-center mx-auto text-[#00D9FF]">
              <Layers className="w-6 h-6 opacity-70" />
            </div>
            <p className="text-sm text-[#8C9BAD]">
              پروژه‌ای در این دسته‌بندی یافت نشد. می‌توانید با انتخاب «همه پروژه‌ها»، مجموعه کامل آثار را بررسی فرمایید.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-5 py-2 text-xs font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] rounded-xl transition-all cursor-pointer"
            >
              نمایش همه پروژه‌ها
            </button>
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
      <section className="bg-gradient-to-r from-[#06111F] via-[#0A1626] to-[#06111F] border border-[#23364C] rounded-2xl p-8 lg:p-12 text-center space-y-5">
        <h3 className="text-xl sm:text-2xl font-bold text-[#F5F8FC]">
          پروژه بعدی متعلق به برند شماست؟
        </h3>
        <p className="text-sm text-[#8C9BAD] max-w-xl mx-auto leading-relaxed">
          ما مشتاقیم تا هویت کسب‌وکار شما را به یک تجربه دیجیتال شاخص و پربازده تبدیل کنیم.
        </p>
        <button
          onClick={() => onNavigate('start-project')}
          className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] transition-all rounded-xl shadow-lg shadow-[#1769FF]/25 cursor-pointer"
        >
          <span>شروع یک پروژه با استودیو ویسپار</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
