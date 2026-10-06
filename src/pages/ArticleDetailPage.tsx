import React from 'react';
import { PageRoute } from '../types';
import { articlesData } from '../data/articlesData';
import { Breadcrumb } from '../components/Breadcrumb';
import { Clock, Calendar, User, ArrowUpLeft, Share2, Tag, BookOpen } from 'lucide-react';

interface ArticleDetailPageProps {
  slug: string;
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  slug,
  onNavigate,
}) => {
  const article = articlesData.find((a) => a.slug === slug) || articlesData[0];
  const relatedArticles = articlesData.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-12">
      <Breadcrumb
        items={[
          { label: 'یادداشت‌ها', route: 'blog' },
          { label: article.title }
        ]}
        onNavigate={onNavigate}
      />

      {/* Header */}
      <header className="space-y-6">
        <div className="flex items-center gap-3 text-xs text-[#00D9FF]">
          <span className="font-mono bg-[#0A1626] border border-[#172638] px-2 py-0.5 rounded">&lt;/&gt;</span>
          <span>{article.category}</span>
          <span className="text-[#536174]">·</span>
          <span className="text-[#8C9BAD] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime} مطالعه
          </span>
          <span className="text-[#536174]">·</span>
          <span className="text-[#8C9BAD]">{article.publishedDate}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-[#F5F8FC] leading-snug">
          {article.title}
        </h1>

        <p className="text-base sm:text-lg text-[#C5D0DD] leading-relaxed border-r-2 border-[#1769FF] pr-4 italic">
          {article.excerpt}
        </p>

        {/* Author byline */}
        <div className="flex items-center justify-between py-4 border-t border-b border-[#172638] text-xs text-[#8C9BAD]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0A1626] border border-[#172638] flex items-center justify-center text-[#00D9FF] font-mono font-bold">
              W
            </div>
            <div>
              <div className="font-semibold text-[#F5F8FC]">{article.author.name}</div>
              <div className="text-[#536174]">{article.author.role}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#536174]">انتشار اختصاصی در ژورنال ویسپار</span>
          </div>
        </div>
      </header>

      {/* Table of Contents Mini Box */}
      <div className="bg-[#06111F] border border-[#172638] rounded-xl p-5 text-xs space-y-2">
        <div className="font-bold text-[#F5F8FC] flex items-center gap-1.5 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-[#00D9FF]" />
          <span>سرفصل‌های این نوشتار:</span>
        </div>
        <ul className="space-y-1.5 text-[#8C9BAD]">
          {article.contentParagraphs.map((para, i) => (
            para.subheading && (
              <li key={i} className="hover:text-[#F5F8FC] transition-colors">
                • {para.subheading}
              </li>
            )
          ))}
        </ul>
      </div>

      {/* Body Content */}
      <div className="space-y-10 text-base text-[#C5D0DD] leading-loose">
        {article.contentParagraphs.map((para, idx) => (
          <section key={idx} className="space-y-4">
            {para.subheading && (
              <h2 className="text-xl sm:text-2xl font-bold text-[#F5F8FC] pt-4">
                {para.subheading}
              </h2>
            )}
            <p className="text-justify text-[#C5D0DD] leading-relaxed">
              {para.text}
            </p>
            {para.quote && (
              <blockquote className="my-6 p-6 bg-[#06111F] border-r-4 border-[#00D9FF] rounded-l-xl text-[#F5F8FC] font-medium italic leading-relaxed text-sm sm:text-base">
                {para.quote}
              </blockquote>
            )}
          </section>
        ))}
      </div>

      {/* Tags */}
      <div className="pt-6 border-t border-[#172638] flex flex-wrap items-center gap-2 text-xs">
        <Tag className="w-3.5 h-3.5 text-[#536174]" />
        <span className="text-[#536174]">کلیدواژه‌ها:</span>
        {article.tags.map((t, i) => (
          <span key={i} className="text-[#8C9BAD] font-latin">
            #{t}
          </span>
        ))}
      </div>

      {/* Related Reads */}
      <section className="pt-10 border-t border-[#172638] space-y-6">
        <h3 className="text-lg font-bold text-[#F5F8FC]">
          یادداشت‌های پیشنهادی دیگر
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {relatedArticles.map((rel) => (
            <article
              key={rel.id}
              onClick={() => onNavigate('article-detail', rel.slug)}
              className="bg-[#06111F] border border-[#172638] hover:border-[#23364C] p-5 rounded-xl cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="text-[11px] text-[#00D9FF] mb-2">{rel.category}</div>
                <h4 className="text-sm font-bold text-[#F5F8FC] group-hover:text-[#00D9FF] transition-colors leading-snug mb-2">
                  {rel.title}
                </h4>
              </div>
              <div className="text-xs text-[#4AA3FF] flex items-center gap-1 mt-4">
                مطالعه
                <ArrowUpLeft className="w-3.5 h-3.5" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="bg-[#06111F] border border-[#23364C] p-8 rounded-2xl text-center space-y-4">
        <h4 className="text-lg font-bold text-[#F5F8FC]">
          برای وب‌سایت برند خود به دنبال چنین استاندارد مهندسی هستید؟
        </h4>
        <p className="text-xs sm:text-sm text-[#8C9BAD] max-w-lg mx-auto">
          ما آماده‌ایم تا این اصول را در قالب پروژه‌ای سفارشی و پربازده برای شما پیاده‌سازی کنیم.
        </p>
        <button
          onClick={() => onNavigate('start-project')}
          className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] rounded-xl transition-colors cursor-pointer shadow-md"
        >
          شروع پروژه با ویسپار ←
        </button>
      </div>
    </div>
  );
};
