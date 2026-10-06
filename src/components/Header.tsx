import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { servicesData } from '../data/servicesData';
import { Search, Menu, X, ArrowUpLeft, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentRoute: PageRoute;
  currentSlug?: string;
  onNavigate: (route: PageRoute, slug?: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  currentSlug,
  onNavigate,
  onOpenSearch,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (route: PageRoute, slug?: string) => {
    onNavigate(route, slug);
    setMobileMenuOpen(false);
    setServicesMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#03070D]/95 border-b border-[#172638] backdrop-blur-md py-3.5 shadow-lg shadow-black/40'
            : 'bg-[#03070D] border-b border-[#172638]/50 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Zone 1: Single Text Element Wordmark */}
            <a
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                handleNav('home');
              }}
              className="group flex items-center gap-2.5 text-left rtl:text-right"
              aria-label="ویسپار - صفحه اصلی"
            >
              <span className="font-latin text-xl sm:text-2xl font-bold tracking-tight text-[#F5F8FC] group-hover:text-[#00D9FF] transition-colors">
                WISPAAR
              </span>
              <span className="font-mono text-xs text-[#00D9FF] bg-[#0A1626] border border-[#172638] px-1.5 py-0.5 rounded tracking-tighter">
                &lt;/&gt;
              </span>
            </a>

            {/* Zone 2: 4-6 Clean Text Nav Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#C5D0DD]">
              <button
                onClick={() => handleNav('home')}
                className={`transition-colors hover:text-[#F5F8FC] ${
                  currentRoute === 'home' ? 'text-[#00D9FF] font-semibold' : ''
                }`}
              >
                خانه
              </button>

              {/* Services with subtle Mega Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setServicesMenuOpen(true)}
                onMouseLeave={() => setServicesMenuOpen(false)}
              >
                <button
                  onClick={() => handleNav('services')}
                  className={`flex items-center gap-1 transition-colors hover:text-[#F5F8FC] ${
                    currentRoute === 'services' || currentRoute === 'service-detail'
                      ? 'text-[#00D9FF] font-semibold'
                      : ''
                  }`}
                >
                  <span>خدمات</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {/* Dropdown Menu */}
                {servicesMenuOpen && (
                  <div className="absolute top-full right-0 pt-2 w-80 z-50">
                    <div className="bg-[#06111F] border border-[#23364C] rounded-xl p-2.5 shadow-2xl backdrop-blur-xl">
                      <div className="px-3 py-1.5 text-xs text-[#8C9BAD] border-b border-[#172638] mb-1">
                        راهکارهای تخصصی دیجیتال
                      </div>
                      {servicesData.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleNav('service-detail', s.slug)}
                          className="w-full text-right px-3 py-2.5 rounded-lg hover:bg-[#0A1626] transition-colors group flex items-start justify-between"
                        >
                          <div>
                            <div className="text-sm font-medium text-[#F5F8FC] group-hover:text-[#00D9FF] transition-colors">
                              {s.title}
                            </div>
                            <div className="text-xs text-[#8C9BAD] line-clamp-1 mt-0.5">
                              {s.shortDescription}
                            </div>
                          </div>
                          <ArrowUpLeft className="w-4 h-4 text-[#8C9BAD] opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
                        </button>
                      ))}
                      <div className="pt-1.5 border-t border-[#172638] mt-1">
                        <button
                          onClick={() => handleNav('services')}
                          className="w-full text-center py-1.5 text-xs text-[#4AA3FF] hover:underline"
                        >
                          مشاهده معرفی کامل تمام خدمات ←
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleNav('portfolio')}
                className={`transition-colors hover:text-[#F5F8FC] ${
                  currentRoute === 'portfolio' || currentRoute === 'project-detail'
                    ? 'text-[#00D9FF] font-semibold'
                    : ''
                }`}
              >
                پروژه‌ها
              </button>

              <button
                onClick={() => handleNav('seo')}
                className={`transition-colors hover:text-[#F5F8FC] ${
                  currentRoute === 'seo' ? 'text-[#00D9FF] font-semibold' : ''
                }`}
              >
                مطالعه موردی سئو
              </button>

              <button
                onClick={() => handleNav('process')}
                className={`transition-colors hover:text-[#F5F8FC] ${
                  currentRoute === 'process' ? 'text-[#00D9FF] font-semibold' : ''
                }`}
              >
                فرآیند همکاری
              </button>

              <button
                onClick={() => handleNav('about')}
                className={`transition-colors hover:text-[#F5F8FC] ${
                  currentRoute === 'about' ? 'text-[#00D9FF] font-semibold' : ''
                }`}
              >
                درباره ویسپار
              </button>

              <button
                onClick={() => handleNav('blog')}
                className={`transition-colors hover:text-[#F5F8FC] ${
                  currentRoute === 'blog' || currentRoute === 'article-detail'
                    ? 'text-[#00D9FF] font-semibold'
                    : ''
                }`}
              >
                یادداشت‌ها
              </button>

              <button
                onClick={() => handleNav('contact')}
                className={`transition-colors hover:text-[#F5F8FC] ${
                  currentRoute === 'contact' ? 'text-[#00D9FF] font-semibold' : ''
                }`}
              >
                تماس
              </button>
            </nav>

            {/* Zone 3: 1-2 Primary Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenSearch}
                aria-label="جستجو در سایت"
                className="p-2 text-[#8C9BAD] hover:text-[#F5F8FC] transition-colors rounded-lg hover:bg-[#0A1626] border border-transparent hover:border-[#172638]"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleNav('start-project')}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] active:scale-[0.98] transition-all rounded-lg whitespace-nowrap shadow-sm shadow-[#1769FF]/20 cursor-pointer"
              >
                <span>شروع یک پروژه</span>
                <span className="font-mono text-xs opacity-70">←</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="منوی موبایل"
                className="lg:hidden p-2 text-[#C5D0DD] hover:text-white rounded-lg hover:bg-[#0A1626]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[65px] z-40 bg-[#03070D]/95 backdrop-blur-xl border-t border-[#172638] lg:hidden overflow-y-auto">
          <div className="max-w-lg mx-auto p-6 space-y-4">
            <div className="flex flex-col space-y-3 text-base font-medium">
              <button
                onClick={() => handleNav('home')}
                className="text-right py-2 text-[#F5F8FC] hover:text-[#00D9FF] border-b border-[#172638]/60"
              >
                خانه
              </button>
              <button
                onClick={() => handleNav('services')}
                className="text-right py-2 text-[#F5F8FC] hover:text-[#00D9FF] border-b border-[#172638]/60"
              >
                خدمات ویسپار
              </button>
              <div className="pr-4 space-y-2 border-r border-[#172638] my-1">
                {servicesData.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleNav('service-detail', s.slug)}
                    className="block text-xs text-[#8C9BAD] hover:text-[#00D9FF] text-right"
                  >
                    • {s.title}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleNav('portfolio')}
                className="text-right py-2 text-[#F5F8FC] hover:text-[#00D9FF] border-b border-[#172638]/60"
              >
                پروژه‌ها و نمونه‌کارها
              </button>
              <button
                onClick={() => handleNav('seo')}
                className="text-right py-2 text-[#F5F8FC] hover:text-[#00D9FF] border-b border-[#172638]/60"
              >
                مطالعه موردی سئو
              </button>
              <button
                onClick={() => handleNav('process')}
                className="text-right py-2 text-[#F5F8FC] hover:text-[#00D9FF] border-b border-[#172638]/60"
              >
                فرآیند همکاری (۸ مرحله)
              </button>
              <button
                onClick={() => handleNav('about')}
                className="text-right py-2 text-[#F5F8FC] hover:text-[#00D9FF] border-b border-[#172638]/60"
              >
                درباره ویسپار
              </button>
              <button
                onClick={() => handleNav('blog')}
                className="text-right py-2 text-[#F5F8FC] hover:text-[#00D9FF] border-b border-[#172638]/60"
              >
                یادداشت‌ها و مقالات
              </button>
              <button
                onClick={() => handleNav('faq')}
                className="text-right py-2 text-[#F5F8FC] hover:text-[#00D9FF] border-b border-[#172638]/60"
              >
                پرسش‌های متداول
              </button>
              <button
                onClick={() => handleNav('contact')}
                className="text-right py-2 text-[#F5F8FC] hover:text-[#00D9FF] border-b border-[#172638]/60"
              >
                تماس با ما
              </button>
            </div>

            <div className="pt-4">
              <button
                onClick={() => handleNav('start-project')}
                className="w-full text-center py-3 px-4 text-sm font-semibold text-white bg-[#1769FF] rounded-xl hover:bg-[#155bd8] transition-colors"
              >
                شروع یک پروژه با ویسپار
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
