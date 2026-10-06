import React, { useState } from 'react';
import { PageRoute } from '../types';
import { projectsData } from '../data/projectsData';
import { servicesData } from '../data/servicesData';
import { seoCaseStudiesData } from '../data/seoCaseStudiesData';
import { articlesData } from '../data/articlesData';
import { faqData } from '../data/faqData';
import { Breadcrumb } from '../components/Breadcrumb';
import { Search, ArrowUpLeft, Folder, Wrench, FileText, HelpCircle, TrendingUp } from 'lucide-react';

interface SearchPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'services' | 'projects' | 'seo' | 'articles' | 'faq'>('all');

  const normalized = query.trim().toLowerCase();

  const matchingServices = normalized
    ? servicesData.filter(
        (s) =>
          s.title.toLowerCase().includes(normalized) ||
          s.titleEn.toLowerCase().includes(normalized) ||
          s.shortDescription.toLowerCase().includes(normalized) ||
          s.deliverables.some((d) => d.toLowerCase().includes(normalized))
      )
    : [];

  const matchingProjects = normalized
    ? projectsData.filter(
        (p) =>
          p.title.toLowerCase().includes(normalized) ||
          p.titleEn.toLowerCase().includes(normalized) ||
          p.industry.toLowerCase().includes(normalized) ||
          p.challenge.toLowerCase().includes(normalized) ||
          p.technology.some((t) => t.toLowerCase().includes(normalized))
      )
    : [];

  const matchingSeo = normalized
    ? seoCaseStudiesData.filter(
        (s) =>
          s.clientTitle.toLowerCase().includes(normalized) ||
          s.industry.toLowerCase().includes(normalized) ||
          s.initialSituation.toLowerCase().includes(normalized) ||
          s.strategy.toLowerCase().includes(normalized)
      )
    : [];

  const matchingArticles = normalized
    ? articlesData.filter(
        (a) =>
          a.title.toLowerCase().includes(normalized) ||
          a.excerpt.toLowerCase().includes(normalized) ||
          a.tags.some((t) => t.toLowerCase().includes(normalized))
      )
    : [];

  const matchingFaqs = normalized
    ? faqData.filter(
        (f) =>
          f.question.toLowerCase().includes(normalized) ||
          f.answer.toLowerCase().includes(normalized)
      )
    : [];

  const totalResults =
    matchingServices.length +
    matchingProjects.length +
    matchingSeo.length +
    matchingArticles.length +
    matchingFaqs.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-12">
      <Breadcrumb items={[{ label: 'جستجو در پایگاه دانشی ویسپار' }]} onNavigate={onNavigate} />

      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF]">
          <span className="bg-[#0A1626] border border-[#172638] px-2 py-0.5 rounded">&lt;/&gt;</span>
          <span>DISCOVERY SEARCH / جستجوی جامع</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#F5F8FC]">
          جستجو در کلیه خدمات، پروژه‌ها و مقالات ویسپار
        </h1>
      </header>

      {/* Main Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#8C9BAD]">
          <Search className="w-5 h-5 text-[#00D9FF]" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="عبارت مورد نظر خود را تایپ کنید (مثلاً: وردپرس، سئو، فین‌تک، پرفورمنس، لندینگ پیج)..."
          className="w-full bg-[#06111F] border border-[#23364C] focus:border-[#00D9FF] rounded-2xl py-4 pr-12 pl-4 text-base text-[#F5F8FC] placeholder-[#536174] outline-none shadow-xl transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 left-0 pl-4 flex items-center text-xs text-[#8C9BAD] hover:text-white"
          >
            پاک کردن
          </button>
        )}
      </div>

      {/* Quick suggest tags */}
      <div className="flex items-center gap-2 flex-wrap text-xs text-[#8C9BAD]">
        <span>پیشنهادها:</span>
        {['طراحی اختصاصی', 'بهینه‌سازی وردپرس', 'سئو تکنیکال', 'نرخ تبدیل', 'Core Web Vitals'].map((term) => (
          <button
            key={term}
            onClick={() => setQuery(term)}
            className="px-2.5 py-1 rounded bg-[#0A1626] border border-[#172638] hover:border-[#23364C] text-[#C5D0DD] hover:text-[#00D9FF] transition-colors"
          >
            {term}
          </button>
        ))}
      </div>

      {/* Tabs */}
      {query && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#172638]">
          {[
            { id: 'all', label: `همه نتایج (${totalResults})` },
            { id: 'services', label: `خدمات (${matchingServices.length})` },
            { id: 'projects', label: `پروژه‌ها (${matchingProjects.length})` },
            { id: 'seo', label: `سئو (${matchingSeo.length})` },
            { id: 'articles', label: `مقالات (${matchingArticles.length})` },
            { id: 'faq', label: `پرسش‌ها (${matchingFaqs.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === t.id
                  ? 'bg-[#1769FF] text-white'
                  : 'text-[#8C9BAD] hover:text-white hover:bg-[#0A1626]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Results Content */}
      <div className="space-y-10">
        {!query && (
          <div className="text-center py-16 bg-[#06111F] border border-[#172638] rounded-2xl p-8 space-y-3">
            <Search className="w-10 h-10 text-[#536174] mx-auto" />
            <h3 className="text-lg font-bold text-[#F5F8FC]">منتظر جستجوی شما هستیم</h3>
            <p className="text-sm text-[#8C9BAD] max-w-md mx-auto">
              کلمه یا موضوع مد نظر خود را وارد فرمایید تا تمام منابع مرتبط فوراً فهرست شوند.
            </p>
          </div>
        )}

        {query && totalResults === 0 && (
          <div className="text-center py-16 bg-[#06111F] border border-[#172638] rounded-2xl p-8 space-y-3">
            <h3 className="text-lg font-bold text-[#F5F8FC]">نتیجه‌ای برای «{query}» یافت نشد</h3>
            <p className="text-sm text-[#8C9BAD] max-w-md mx-auto">
              می‌توانید از کلمات کلی‌تر استفاده کنید یا مستقیماً از بخش ارتباط با ما، استعلام نمایید.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('contact')}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#1769FF] rounded-xl hover:bg-[#155bd8]"
              >
                ارتباط با کارشناسان ویسپار ←
              </button>
            </div>
          </div>
        )}

        {/* Services Group */}
        {(activeTab === 'all' || activeTab === 'services') && matchingServices.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#8C9BAD] uppercase tracking-wider flex items-center gap-2">
              <Wrench className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>خدمات و راهکارهای ویسپار</span>
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {matchingServices.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onNavigate('service-detail', s.slug)}
                  className="bg-[#06111F] border border-[#172638] hover:border-[#23364C] rounded-xl p-5 cursor-pointer group transition-all flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-base font-bold text-[#F5F8FC] group-hover:text-[#00D9FF] transition-colors">
                      {s.title}
                    </h4>
                    <p className="text-xs text-[#8C9BAD] mt-1 line-clamp-2">
                      {s.shortDescription}
                    </p>
                  </div>
                  <ArrowUpLeft className="w-4 h-4 text-[#8C9BAD] group-hover:text-[#00D9FF] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Group */}
        {(activeTab === 'all' || activeTab === 'projects') && matchingProjects.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#8C9BAD] uppercase tracking-wider flex items-center gap-2">
              <Folder className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>پروژه‌ها و نمونه‌کارها</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchingProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onNavigate('project-detail', p.slug)}
                  className="bg-[#06111F] border border-[#172638] hover:border-[#23364C] rounded-xl p-5 cursor-pointer group transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[11px] text-[#8C9BAD] mb-1 font-latin">{p.industry} · {p.year}</div>
                    <h4 className="text-base font-bold text-[#F5F8FC] group-hover:text-[#00D9FF] transition-colors">
                      {p.title}
                    </h4>
                    <p className="text-xs text-[#8C9BAD] mt-1 line-clamp-2">
                      {p.challenge}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#172638] flex items-center justify-between text-xs text-[#4AA3FF]">
                    <span>مشاهده مطالعه کامل</span>
                    <ArrowUpLeft className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEO Group */}
        {(activeTab === 'all' || activeTab === 'seo') && matchingSeo.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#8C9BAD] uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>مطالعات موردی سئو</span>
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {matchingSeo.map((seo) => (
                <div
                  key={seo.id}
                  onClick={() => onNavigate('seo')}
                  className="bg-[#06111F] border border-[#172638] hover:border-[#23364C] rounded-xl p-5 cursor-pointer group transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="text-[11px] text-[#8C9BAD] mb-1">{seo.industry} · {seo.duration}</div>
                    <h4 className="text-base font-bold text-[#F5F8FC] group-hover:text-[#00D9FF]">
                      {seo.clientTitle}
                    </h4>
                    <p className="text-xs text-[#8C9BAD] mt-1 line-clamp-2">
                      {seo.strategy}
                    </p>
                  </div>
                  <ArrowUpLeft className="w-4 h-4 text-[#8C9BAD] group-hover:text-[#00D9FF] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Articles Group */}
        {(activeTab === 'all' || activeTab === 'articles') && matchingArticles.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#8C9BAD] uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>ژورنال و یادداشت‌های تخصصی</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchingArticles.map((a) => (
                <div
                  key={a.id}
                  onClick={() => onNavigate('article-detail', a.slug)}
                  className="bg-[#06111F] border border-[#172638] hover:border-[#23364C] rounded-xl p-5 cursor-pointer group transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[11px] text-[#00D9FF] mb-1">{a.category} · {a.readTime}</div>
                    <h4 className="text-base font-bold text-[#F5F8FC] group-hover:text-[#00D9FF]">
                      {a.title}
                    </h4>
                    <p className="text-xs text-[#8C9BAD] mt-1 line-clamp-2">
                      {a.excerpt}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#172638] flex items-center justify-between text-xs text-[#4AA3FF]">
                    <span>مطالعه نوشتار</span>
                    <ArrowUpLeft className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs Group */}
        {(activeTab === 'all' || activeTab === 'faq') && matchingFaqs.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#8C9BAD] uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>پرسش‌های متداول</span>
            </h3>
            <div className="space-y-2">
              {matchingFaqs.map((f) => (
                <div
                  key={f.id}
                  onClick={() => onNavigate('faq')}
                  className="bg-[#06111F] border border-[#172638] hover:border-[#23364C] rounded-xl p-4 cursor-pointer"
                >
                  <div className="text-sm font-semibold text-[#F5F8FC] mb-1">{f.question}</div>
                  <div className="text-xs text-[#8C9BAD] line-clamp-2">{f.answer}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
