import React, { useState } from 'react';
import { PageRoute } from '../types';
import { articlesData } from '../data/articlesData';
import { Breadcrumb } from '../components/Breadcrumb';
import { ArrowUpLeft, BookOpen, Clock, Calendar, User } from 'lucide-react';

interface BlogPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'همه یادداشت‌ها' },
    { id: 'طراحی وب', label: 'طراحی وب' },
    { id: 'وردپرس', label: 'وردپرس' },
    { id: 'سئو', label: 'سئو' },
    { id: 'تجربه کاربری', label: 'تجربه کاربری و پرفورمنس' },
  ];

  const filteredArticles = articlesData.filter((a) => {
    if (selectedCategory === 'all') return true;
    return a.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-16">
      <Breadcrumb items={[{ label: 'یادداشت‌ها و بینش‌ها (Journal)' }]} onNavigate={onNavigate} />

      {/* Hero */}
      <section className="max-w-4xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF]">
          <span className="bg-[#0A1626] border border-[#172638] px-2 py-0.5 rounded">&lt;/&gt;</span>
          <span>WISPAAR JOURNAL / دانش و تحلیل‌های استودیو</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-[#F5F8FC] leading-tight">
          تأملاتی پیرامون معماری وب، پرفورمنس و روانشناسی تصمیم‌گیری.
        </h1>
        <p className="text-base sm:text-lg text-[#8C9BAD] leading-relaxed max-w-2xl">
          نوشته‌هایی برآمده از تجربه عملی پروژه‌ها و مهندسی نرم‌افزار؛ بدون
          متون تکراری و شعارهای کلیشه‌ای بازاریابی.
        </p>
      </section>

      {/* Category Tabs (Interactive Functional Buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#172638]">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              selectedCategory === c.id
                ? 'bg-[#1769FF] text-white shadow-sm'
                : 'text-[#8C9BAD] hover:text-[#F5F8FC] hover:bg-[#06111F]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredArticles.map((article, idx) => (
          <article
            key={article.id}
            onClick={() => onNavigate('article-detail', article.slug)}
            className={`bg-[#06111F] border border-[#172638] hover:border-[#23364C] rounded-2xl p-8 transition-all flex flex-col justify-between group cursor-pointer ${
              idx === 0 ? 'md:col-span-2 bg-[#081527]' : ''
            }`}
          >
            <div>
              {/* Unboxed Metadata */}
              <div className="flex items-center gap-3 text-xs text-[#8C9BAD] mb-3">
                <span className="text-[#00D9FF] font-medium">{article.category}</span>
                <span aria-hidden="true" className="text-[#536174]">·</span>
                <span>{article.readTime} زمان مطالعه</span>
                <span aria-hidden="true" className="text-[#536174]">·</span>
                <span>{article.publishedDate}</span>
              </div>

              <h2 className={`font-bold text-[#F5F8FC] group-hover:text-[#00D9FF] transition-colors leading-snug mb-4 ${
                idx === 0 ? 'text-2xl sm:text-3xl' : 'text-xl'
              }`}>
                {article.title}
              </h2>

              <p className="text-sm text-[#8C9BAD] leading-relaxed line-clamp-3 mb-6">
                {article.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-[#172638] flex items-center justify-between text-xs text-[#536174]">
              <div className="flex items-center gap-2 text-[#8C9BAD]">
                <User className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span>{article.author.name}</span>
              </div>
              <span className="text-[#4AA3FF] group-hover:text-[#00D9FF] font-medium flex items-center gap-1">
                خواندن کامل یادداشت
                <ArrowUpLeft className="w-4 h-4" />
              </span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};
