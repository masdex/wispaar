import React from 'react';
import { PageRoute } from '../types';
import { servicesData } from '../data/servicesData';
import { ArrowUpLeft, Mail, Phone, MapPin, Globe } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (route: PageRoute, slug?: string) => {
    onNavigate(route, slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#02050A] border-t border-[#172638] text-[#8C9BAD] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-[#172638]/70">
          {/* Brand Info Column */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2.5">
              <span className="font-latin text-2xl font-bold tracking-tight text-[#F5F8FC]">
                WISPAAR
              </span>
              <span className="font-mono text-xs text-[#00D9FF] bg-[#0A1626] border border-[#172638] px-1.5 py-0.5 rounded">
                &lt;/&gt;
              </span>
              <span className="text-sm text-[#8C9BAD]">| ویسپار</span>
            </div>

            <div className="text-sm text-[#00D9FF] font-medium tracking-wide">
              آفرینش با خرد — Wisdom + Technology
            </div>

            <p className="text-sm text-[#8C9BAD] leading-relaxed max-w-sm">
              استودیو فناوری و طراحی دیجیتال ویسپار. ما وب‌سایت‌های شاخص اختصاصی،
              معماری عمیق وردپرس، لندینگ‌پیج‌های تبدیل‌محور و راهکارهای سئو را با
              انضباط مهندسی و نگاه هنری خلق می‌کنیم.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-[#C5D0DD]">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span className="font-mono tracking-wider">contact@wispaar.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span>طراحی، مهندسی و استراتژی دیجیتال تراز اول</span>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div className="space-y-4">
            <div className="text-xs font-semibold text-[#F5F8FC] uppercase tracking-wider">
              خدمات تخصصی
            </div>
            <ul className="space-y-2.5 text-sm">
              {servicesData.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => handleNav('service-detail', s.slug)}
                    className="hover:text-[#F5F8FC] transition-colors text-right flex items-center justify-between w-full group"
                  >
                    <span>{s.title}</span>
                    <ArrowUpLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#00D9FF]" />
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="text-xs text-[#4AA3FF] hover:underline pt-1 inline-block"
                >
                  همه خدمات و راهکارها ←
                </button>
              </li>
            </ul>
          </div>

          {/* Projects & SEO Column */}
          <div className="space-y-4">
            <div className="text-xs font-semibold text-[#F5F8FC] uppercase tracking-wider">
              پروژه‌ها و نتایج
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('portfolio')}
                  className="hover:text-[#F5F8FC] transition-colors text-right"
                >
                  منتخب پروژه‌ها (Selected Work)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('seo')}
                  className="hover:text-[#F5F8FC] transition-colors text-right"
                >
                  مطالعات موردی سئو
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('process')}
                  className="hover:text-[#F5F8FC] transition-colors text-right"
                >
                  فرآیند همکاری (۸ مرحله)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('start-project')}
                  className="hover:text-[#00D9FF] font-medium transition-colors text-right"
                >
                  فرم بریف پروژه جدید
                </button>
              </li>
            </ul>
          </div>

          {/* About & Studio */}
          <div className="space-y-4">
            <div className="text-xs font-semibold text-[#F5F8FC] uppercase tracking-wider">
              استودیو ویسپار
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-[#F5F8FC] transition-colors text-right"
                >
                  درباره ویسپار و مانیفست
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('blog')}
                  className="hover:text-[#F5F8FC] transition-colors text-right"
                >
                  یادداشت‌ها و بینش‌ها (Journal)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('faq')}
                  className="hover:text-[#F5F8FC] transition-colors text-right"
                >
                  پرسش‌های متداول (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-[#F5F8FC] transition-colors text-right"
                >
                  تماس و راه‌های ارتباطی
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-[#8C9BAD]">
            تمام حقوق محفوظ است © ۱۴۰۴ WISPAAR. خلق شده با اندیشه و فناوری در استودیو ویسپار.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNav('privacy')}
              className="hover:text-[#F5F8FC] transition-colors"
            >
              حریم خصوصی
            </button>
            <button
              onClick={() => handleNav('terms')}
              className="hover:text-[#F5F8FC] transition-colors"
            >
              شرایط همکاری
            </button>
            <span className="font-mono text-[#00D9FF]">
              &lt;/&gt; Creation with Wisdom
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
