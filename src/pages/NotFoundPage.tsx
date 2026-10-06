import React from 'react';
import { PageRoute } from '../types';
import { ArrowUpLeft, Home, Compass, Wrench, Mail } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-8">
      {/* 404 & </> Lockup */}
      <div className="flex items-center justify-center gap-3">
        <span className="font-mono text-5xl sm:text-7xl font-bold text-[#1769FF]">
          404
        </span>
        <span className="font-mono text-2xl sm:text-3xl text-[#00D9FF] bg-[#0A1626] border border-[#172638] px-3 py-1 rounded-xl">
          &lt;/&gt;
        </span>
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F8FC]">
          صفحه‌ای که به دنبال آن بودید، یافت نشد.
        </h1>
        <p className="text-sm sm:text-base text-[#8C9BAD] max-w-lg mx-auto leading-relaxed">
          ممکن است نشانی صفحه تغییر کرده یا در اثر بازآرایی ساختار سایت جابه‌جا شده
          باشد. مسیرهای زیر می‌توانند شما را به بخش مورد نظرتان هدایت کنند:
        </p>
      </div>

      {/* Recommended Recovery Routes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-xs">
        <button
          onClick={() => onNavigate('home')}
          className="p-4 rounded-xl bg-[#06111F] border border-[#172638] hover:border-[#00D9FF] text-[#F5F8FC] transition-colors flex items-center justify-between group cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Home className="w-4 h-4 text-[#00D9FF]" />
            <span>صفحه اصلی ویسپار</span>
          </span>
          <ArrowUpLeft className="w-3.5 h-3.5 text-[#8C9BAD] group-hover:text-[#00D9FF]" />
        </button>

        <button
          onClick={() => onNavigate('portfolio')}
          className="p-4 rounded-xl bg-[#06111F] border border-[#172638] hover:border-[#00D9FF] text-[#F5F8FC] transition-colors flex items-center justify-between group cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#00D9FF]" />
            <span>نمایشگاه پروژه‌ها</span>
          </span>
          <ArrowUpLeft className="w-3.5 h-3.5 text-[#8C9BAD] group-hover:text-[#00D9FF]" />
        </button>

        <button
          onClick={() => onNavigate('services')}
          className="p-4 rounded-xl bg-[#06111F] border border-[#172638] hover:border-[#00D9FF] text-[#F5F8FC] transition-colors flex items-center justify-between group cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#00D9FF]" />
            <span>معرفی خدمات تخصصی</span>
          </span>
          <ArrowUpLeft className="w-3.5 h-3.5 text-[#8C9BAD] group-hover:text-[#00D9FF]" />
        </button>

        <button
          onClick={() => onNavigate('contact')}
          className="p-4 rounded-xl bg-[#06111F] border border-[#172638] hover:border-[#00D9FF] text-[#F5F8FC] transition-colors flex items-center justify-between group cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#00D9FF]" />
            <span>ارتباط با پشتیبانی</span>
          </span>
          <ArrowUpLeft className="w-3.5 h-3.5 text-[#8C9BAD] group-hover:text-[#00D9FF]" />
        </button>
      </div>

      <div className="pt-6">
        <button
          onClick={() => onNavigate('start-project')}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-[#1769FF] rounded-xl hover:bg-[#155bd8] transition-colors cursor-pointer shadow-md"
        >
          شروع یک پروژه با ویسپار ←
        </button>
      </div>
    </div>
  );
};
