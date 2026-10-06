import React, { useState } from 'react';
import { PageRoute } from '../types';
import { faqData } from '../data/faqData';
import { Breadcrumb } from '../components/Breadcrumb';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FaqPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openIds, setOpenIds] = useState<string[]>(['f1', 'f3', 'f5']);

  const categories = [
    { id: 'all', label: 'همه پرسش‌ها' },
    { id: 'طراحی سایت', label: 'طراحی سایت' },
    { id: 'وردپرس', label: 'وردپرس' },
    { id: 'سئو', label: 'سئو و بهینه‌سازی' },
    { id: 'فرآیند همکاری', label: 'فرآیند همکاری' },
    { id: 'پشتیبانی', label: 'پشتیبانی و گارانتی' },
  ];

  const filteredFaqs = faqData.filter((f) => {
    if (selectedCategory === 'all') return true;
    return f.category === selectedCategory;
  });

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-14">
      <Breadcrumb items={[{ label: 'پرسش‌های متداول' }]} onNavigate={onNavigate} />

      {/* Header */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF]">
          <span className="bg-[#0A1626] border border-[#172638] px-2 py-0.5 rounded">&lt;/&gt;</span>
          <span>FREQUENTLY ASKED QUESTIONS / پرسش‌های متداول</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#F5F8FC]">
          پاسخ به ابهامات متداول درباره فرآیندها، فناوری‌ها و نحوه همکاری.
        </h1>
        <p className="text-sm sm:text-base text-[#8C9BAD] leading-relaxed">
          اگر پرسش شما در میان موارد زیر نیست، تیم پشتیبانی ویسپار همواره مشتاق
          پاسخگویی مستقیم به شماست.
        </p>
      </section>

      {/* Category Filter Buttons */}
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

      {/* Accordions */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => {
          const isOpen = openIds.includes(faq.id);
          return (
            <div
              key={faq.id}
              className="bg-[#06111F] border border-[#172638] hover:border-[#23364C] rounded-xl overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full text-right p-5 flex items-center justify-between text-sm sm:text-base font-semibold text-[#F5F8FC] hover:text-[#00D9FF] transition-colors"
              >
                <span>{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#00D9FF] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#8C9BAD] shrink-0" />
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

      {/* Bottom CTA */}
      <div className="bg-[#06111F] border border-[#23364C] p-8 rounded-2xl text-center space-y-4">
        <h3 className="text-xl font-bold text-[#F5F8FC]">
          سؤال خاص دیگری در ذهن دارید؟
        </h3>
        <p className="text-xs sm:text-sm text-[#8C9BAD] max-w-md mx-auto">
          ما با کمال میل به تمامی جزئیات فنی و مالی پروژه شما پاسخ خواهیم داد.
        </p>
        <button
          onClick={() => onNavigate('contact')}
          className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] rounded-xl transition-colors cursor-pointer shadow-md"
        >
          ارتباط با کارشناسان ویسپار ←
        </button>
      </div>
    </div>
  );
};
