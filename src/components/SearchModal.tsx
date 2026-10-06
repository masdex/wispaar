import React, { useState, useEffect, useRef } from 'react';
import { PageRoute } from '../types';
import { projectsData } from '../data/projectsData';
import { servicesData } from '../data/servicesData';
import { seoCaseStudiesData } from '../data/seoCaseStudiesData';
import { articlesData } from '../data/articlesData';
import { faqData } from '../data/faqData';
import { Search, X, ArrowUpLeft, Folder, Wrench, FileText, HelpCircle } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const normalizedQuery = query.trim().toLowerCase();

  const filteredProjects = normalizedQuery
    ? projectsData.filter(
        (p) =>
          p.title.toLowerCase().includes(normalizedQuery) ||
          p.titleEn.toLowerCase().includes(normalizedQuery) ||
          p.industry.toLowerCase().includes(normalizedQuery) ||
          p.challenge.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const filteredServices = normalizedQuery
    ? servicesData.filter(
        (s) =>
          s.title.toLowerCase().includes(normalizedQuery) ||
          s.titleEn.toLowerCase().includes(normalizedQuery) ||
          s.shortDescription.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const filteredArticles = normalizedQuery
    ? articlesData.filter(
        (a) =>
          a.title.toLowerCase().includes(normalizedQuery) ||
          a.excerpt.toLowerCase().includes(normalizedQuery) ||
          a.tags.some((t) => t.toLowerCase().includes(normalizedQuery))
      )
    : [];

  const filteredFaqs = normalizedQuery
    ? faqData.filter(
        (f) =>
          f.question.toLowerCase().includes(normalizedQuery) ||
          f.answer.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const hasResults =
    filteredProjects.length > 0 ||
    filteredServices.length > 0 ||
    filteredArticles.length > 0 ||
    filteredFaqs.length > 0;

  const handleSelect = (route: PageRoute, slug?: string) => {
    onNavigate(route, slug);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#06111F] border border-[#23364C] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#172638] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#8C9BAD] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="جستجو در پروژه‌ها، خدمات، سئو و یادداشت‌های ویسپار..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[#F5F8FC] placeholder-[#536174] text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#8C9BAD] hover:text-white px-2 py-1 rounded"
            >
              پاک کردن
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-[#8C9BAD] hover:text-white rounded-lg hover:bg-[#0A1626]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 overflow-y-auto space-y-6 flex-1">
          {!query && (
            <div className="text-center py-10 text-sm text-[#8C9BAD]">
              <div className="text-[#C5D0DD] font-medium mb-1">
                جستجوی جامع در تمام ارکان دانشی و تجربی ویسپار
              </div>
              <div className="text-xs text-[#536174]">
                مثال: «وردپرس»، «طراحی اختصاصی»، «سئو»، «پرفورمنس» یا «لندینگ پیج»
              </div>
            </div>
          )}

          {query && !hasResults && (
            <div className="text-center py-12 text-sm text-[#8C9BAD]">
              نتیجه‌ای برای عبارت «{query}» یافت نشد. می‌توانید با اصطلاحات کلی‌تر جستجو کنید یا مستقیماً با تیم در تماس باشید.
            </div>
          )}

          {/* Services Matches */}
          {filteredServices.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8C9BAD] uppercase mb-2">
                <Wrench className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span>خدمات و راهکارها ({filteredServices.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredServices.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelect('service-detail', s.slug)}
                    className="w-full text-right p-3 rounded-lg bg-[#0A1626] hover:bg-[#0F2035] border border-[#172638] hover:border-[#23364C] transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-[#F5F8FC] group-hover:text-[#00D9FF]">
                        {s.title}
                      </div>
                      <div className="text-xs text-[#8C9BAD] line-clamp-1 mt-0.5">
                        {s.shortDescription}
                      </div>
                    </div>
                    <ArrowUpLeft className="w-4 h-4 text-[#8C9BAD] group-hover:text-[#00D9FF] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Projects Matches */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8C9BAD] uppercase mb-2">
                <Folder className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span>پروژه‌ها و نمونه‌کارها ({filteredProjects.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect('project-detail', p.slug)}
                    className="w-full text-right p-3 rounded-lg bg-[#0A1626] hover:bg-[#0F2035] border border-[#172638] hover:border-[#23364C] transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-[#F5F8FC] group-hover:text-[#00D9FF]">
                        {p.title}
                        <span className="text-xs font-normal text-[#8C9BAD] mr-2">
                          ({p.industry})
                        </span>
                      </div>
                      <div className="text-xs text-[#8C9BAD] line-clamp-1 mt-0.5">
                        {p.challenge}
                      </div>
                    </div>
                    <ArrowUpLeft className="w-4 h-4 text-[#8C9BAD] group-hover:text-[#00D9FF] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Articles Matches */}
          {filteredArticles.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8C9BAD] uppercase mb-2">
                <FileText className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span>یادداشت‌ها و مقالات ({filteredArticles.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredArticles.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleSelect('article-detail', a.slug)}
                    className="w-full text-right p-3 rounded-lg bg-[#0A1626] hover:bg-[#0F2035] border border-[#172638] hover:border-[#23364C] transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-[#F5F8FC] group-hover:text-[#00D9FF]">
                        {a.title}
                      </div>
                      <div className="text-xs text-[#8C9BAD] line-clamp-1 mt-0.5">
                        {a.excerpt}
                      </div>
                    </div>
                    <ArrowUpLeft className="w-4 h-4 text-[#8C9BAD] group-hover:text-[#00D9FF] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Matches */}
          {filteredFaqs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8C9BAD] uppercase mb-2">
                <HelpCircle className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span>پرسش‌های متداول ({filteredFaqs.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredFaqs.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => handleSelect('faq')}
                    className="w-full text-right p-3 rounded-lg bg-[#0A1626] hover:bg-[#0F2035] border border-[#172638] transition-all"
                  >
                    <div className="text-xs font-medium text-[#F5F8FC] mb-1">
                      {f.question}
                    </div>
                    <div className="text-xs text-[#8C9BAD] line-clamp-2">
                      {f.answer}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
