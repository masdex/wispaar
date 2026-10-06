import React, { useState } from 'react';
import { PageRoute } from '../types';
import { projectsData } from '../data/projectsData';
import { Breadcrumb } from '../components/Breadcrumb';
import {
  ArrowUpLeft,
  ArrowRight,
  ExternalLink,
  Monitor,
  Smartphone,
  CheckCircle2,
  Calendar,
  Layers,
  Wrench
} from 'lucide-react';

interface ProjectDetailPageProps {
  slug: string;
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  slug,
  onNavigate,
}) => {
  const currentIndex = projectsData.findIndex((p) => p.slug === slug);
  const project = currentIndex !== -1 ? projectsData[currentIndex] : projectsData[0];
  const nextProject = projectsData[(currentIndex + 1) % projectsData.length];

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showCmsSchema, setShowCmsSchema] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-16">
      <Breadcrumb
        items={[
          { label: 'پروژه‌ها', route: 'portfolio' },
          { label: project.title }
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Meta Header */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#00D9FF]">
          <div className="flex items-center gap-2">
            <span className="bg-[#0A1626] border border-[#172638] px-2 py-0.5 rounded">&lt;/&gt;</span>
            <span>CASE STUDY / {project.titleEn}</span>
          </div>

          {project.isDemo && (
            <div className="bg-[#03070D] border border-[#23364C] px-2.5 py-1 rounded text-[#00D9FF]">
              CONCEPT & DEMO SPECIFICATION
            </div>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-[#F5F8FC] leading-tight">
          {project.title}
        </h1>

        {project.editorialQuote && (
          <p className="text-base sm:text-xl text-[#00D9FF] font-medium leading-relaxed italic border-r-2 border-[#1769FF] pr-4">
            {project.editorialQuote}
          </p>
        )}

        {/* Structured Spec Grid (Unboxed Metadata) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-[#06111F] border border-[#172638] rounded-xl p-6 text-xs">
          <div>
            <div className="text-[#536174] mb-1">مشتری / کارفرما</div>
            <div className="text-[#F5F8FC] font-medium">{project.client}</div>
          </div>
          <div>
            <div className="text-[#536174] mb-1">صنعت و حوزه</div>
            <div className="text-[#F5F8FC] font-medium">{project.industry}</div>
          </div>
          <div>
            <div className="text-[#536174] mb-1">سال اجرا</div>
            <div className="text-[#F5F8FC] font-medium font-mono">{project.year}</div>
          </div>
          <div>
            <div className="text-[#536174] mb-1">نوع اثر دیجیتال</div>
            <div className="text-[#F5F8FC] font-medium">{project.projectType}</div>
          </div>
        </div>
      </section>

      {/* Main Visual Showcase Frame */}
      <section className="relative rounded-2xl overflow-hidden border border-[#172638] bg-[#06111F] shadow-2xl">
        <div className="p-3 bg-[#03070D] border-b border-[#172638] flex items-center justify-between text-xs text-[#8C9BAD]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
            <span className="mr-3 font-mono text-[#536174]">{project.websiteUrlPlaceholder}</span>
          </div>

          <div className="flex items-center gap-1 bg-[#0A1626] border border-[#172638] rounded p-0.5">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                previewDevice === 'desktop' ? 'bg-[#172638] text-white' : 'text-[#8C9BAD]'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>دسکتاپ</span>
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                previewDevice === 'mobile' ? 'bg-[#172638] text-white' : 'text-[#8C9BAD]'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>موبایل</span>
            </button>
          </div>
        </div>

        <div className={`p-6 sm:p-10 flex items-center justify-center transition-all ${
          previewDevice === 'mobile' ? 'max-w-md mx-auto' : ''
        }`}>
          <img
            src={project.coverImage}
            alt={project.title}
            referrerPolicy="no-referrer"
            className={`w-full rounded-xl object-cover shadow-2xl ${
              previewDevice === 'mobile' ? 'border-4 border-[#172638] rounded-3xl max-h-[600px]' : 'max-h-[650px]'
            }`}
          />
        </div>
      </section>

      {/* Challenge & Architectural Solution */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-[#06111F] border border-[#172638] rounded-2xl p-8 space-y-4">
          <div className="text-xs font-mono text-[#EF4444] uppercase tracking-wider">
            THE CHALLENGE / چالش اولیه
          </div>
          <h2 className="text-xl font-bold text-[#F5F8FC]">
            مسئله اساسی پروژه چه بود؟
          </h2>
          <p className="text-sm text-[#8C9BAD] leading-relaxed">
            {project.challenge}
          </p>
        </div>

        <div className="bg-[#06111F] border border-[#172638] rounded-2xl p-8 space-y-4">
          <div className="text-xs font-mono text-[#00D9FF] uppercase tracking-wider">
            THE ARCHITECTURAL SOLUTION / راهکار مهندسی ویسپار
          </div>
          <h2 className="text-xl font-bold text-[#F5F8FC]">
            چگونه با خرد و فناوری حل شد؟
          </h2>
          <p className="text-sm text-[#8C9BAD] leading-relaxed">
            {project.solution}
          </p>
        </div>
      </section>

      {/* Results & KPI Proof */}
      <section className="bg-[#0A1626] border border-[#23364C] rounded-2xl p-8 sm:p-12 space-y-6">
        <div>
          <div className="text-xs font-mono text-[#22C55E] uppercase tracking-wider mb-1">
            MEASURED OUTCOMES / شاخص‌های نتایج پروژه
          </div>
          <h2 className="text-2xl font-bold text-[#F5F8FC]">
            بازدهی ثبت‌شده در این پروژه
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {project.results.map((res, i) => (
            <div key={i} className="bg-[#03070D] border border-[#172638] rounded-xl p-5">
              <div className="text-2xl sm:text-3xl font-bold text-[#00D9FF] font-mono mb-1">
                {res.value}
              </div>
              <div className="text-xs font-semibold text-[#F5F8FC] mb-1">{res.label}</div>
              <div className="text-[11px] text-[#8C9BAD] leading-relaxed">{res.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services and Technologies Used */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#172638] pt-10">
        <div>
          <h3 className="text-xs font-semibold text-[#8C9BAD] uppercase tracking-wider mb-4">
            خدمات ارائه‌شده در این پروژه
          </h3>
          <div className="flex flex-wrap gap-2 text-xs">
            {project.services.map((s, idx) => (
              <span
                key={idx}
                className="bg-[#06111F] border border-[#172638] px-3 py-1.5 rounded-lg text-[#C5D0DD]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-[#8C9BAD] uppercase tracking-wider mb-4">
            پشته فناوری (Technology Stack)
          </h3>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {project.technology.map((t, idx) => (
              <span
                key={idx}
                className="bg-[#06111F] border border-[#172638] px-3 py-1.5 rounded-lg text-[#00D9FF]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* WordPress CMS-Ready Schema Inspector (Developer & Architecture Transparency) */}
      <section className="border-t border-[#172638] pt-8">
        <div className="bg-[#06111F] border border-[#172638] rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF] mb-1">
                <span>&lt;WORDPRESS CMS ARCHITECTURE&gt;</span>
                <span>·</span>
                <span>Custom Post Type Ready</span>
              </div>
              <h4 className="text-sm font-bold text-[#F5F8FC]">
                معماری داده پروژه برای انتقال مستقیم به وردپرس (WordPress CPT & ACF)
              </h4>
              <p className="text-xs text-[#8C9BAD] mt-0.5">
                این پروژه دارای ساختار داده مستقل و جدا از لایه نمایش است و بدون وابستگی، آماده ثبت در وردپرس می‌باشد.
              </p>
            </div>

            <button
              onClick={() => setShowCmsSchema(!showCmsSchema)}
              className="px-4 py-2 text-xs font-mono bg-[#0A1626] border border-[#23364C] hover:border-[#00D9FF] text-[#00D9FF] rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              {showCmsSchema ? 'پنهان کردن ساختار JSON' : 'مشاهده مدل داده CPT & ACF'}
            </button>
          </div>

          {showCmsSchema && (
            <div className="mt-6 pt-6 border-t border-[#172638] space-y-4">
              <div className="text-xs text-[#8C9BAD]">
                مدل شیء پست سفارشی (Post Type: <code className="font-mono text-[#00D9FF]">wispaar_project</code>) و فیلدهای سفارشی (ACF):
              </div>
              <pre className="p-4 bg-[#03070D] border border-[#172638] rounded-lg text-xs font-mono text-[#C5D0DD] overflow-x-auto leading-relaxed" dir="ltr">
{JSON.stringify(
  {
    post_type: 'wispaar_project',
    post_title: project.title,
    post_name: project.slug,
    taxonomies: {
      project_industry: project.industry,
      project_tech: project.technology,
      project_tags: project.tags,
    },
    meta_fields: {
      client_name: project.client,
      project_year: project.year,
      project_type: project.projectType,
      challenge_text: project.challenge,
      solution_architecture: project.solution,
      key_kpis: project.results,
      demo_status: project.isDemo ? 'concept_demo' : 'production_verified',
    },
    rest_api_endpoint: `/wp-json/wispaar/v1/projects/${project.slug}`,
  },
  null,
  2
)}
              </pre>
            </div>
          )}
        </div>
      </section>

      {/* Next Project Footer Bar */}
      <section className="border-t border-[#172638] pt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-xs text-[#536174] mb-1">پروژه بعدی برای بررسی:</div>
          <button
            onClick={() => onNavigate('project-detail', nextProject.slug)}
            className="text-xl font-bold text-[#F5F8FC] hover:text-[#00D9FF] transition-colors flex items-center gap-2"
          >
            <span>{nextProject.title}</span>
            <span className="text-sm font-normal text-[#8C9BAD]">({nextProject.industry})</span>
            <ArrowUpLeft className="w-5 h-5 text-[#00D9FF]" />
          </button>
        </div>

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
