import React from 'react';
import { SeoCaseStudy, PageRoute } from '../types';
import { ArrowUpLeft, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';

interface SeoCaseStudyCardProps {
  caseStudy: SeoCaseStudy;
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const SeoCaseStudyCard: React.FC<SeoCaseStudyCardProps> = ({
  caseStudy,
  onNavigate,
}) => {
  return (
    <div className="bg-[#06111F] border border-[#172638] rounded-xl p-6 hover:border-[#23364C] transition-all flex flex-col justify-between">
      <div>
        {/* Unboxed Metadata */}
        <div className="flex items-center gap-2 text-xs text-[#8C9BAD] mb-3">
          <span>{caseStudy.industry}</span>
          <span aria-hidden="true" className="text-[#536174]">·</span>
          <span>{caseStudy.duration}</span>
          {caseStudy.isCaseStudyDemo && (
            <>
              <span aria-hidden="true" className="text-[#536174]">·</span>
              <span className="font-mono text-[11px] text-[#00D9FF]">CASE STUDY DEMO</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[#F5F8FC] mb-3 leading-snug">
          {caseStudy.clientTitle}
        </h3>

        <p className="text-sm text-[#8C9BAD] leading-relaxed mb-5">
          {caseStudy.initialSituation}
        </p>

        {/* Before / After Module */}
        <div className="bg-[#0A1626] border border-[#172638] rounded-lg p-4 mb-5 space-y-3">
          <div className="text-xs font-semibold text-[#8C9BAD] uppercase tracking-wider mb-2">
            ممیزی قبل و تحول بعد از بهینه‌سازی (Before & After)
          </div>

          <div className="flex items-start gap-2.5 text-xs text-[#C5D0DD]">
            <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#8C9BAD] font-medium">وضعیت اولیه: </span>
              <span>{caseStudy.beforeMetric}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-[#F5F8FC]">
            <CheckCircle className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#00D9FF] font-medium">نتیجه مهندسی: </span>
              <span>{caseStudy.afterMetric}</span>
            </div>
          </div>
        </div>

        {/* Growth Indicators Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-5">
          <div className="bg-[#03070D] border border-[#172638]/70 p-3 rounded">
            <span className="text-[#8C9BAD] block text-[11px] mb-1">رشد ترافیک ارگانیک</span>
            <span className="font-mono font-bold text-[#00D9FF]">
              {caseStudy.organicGrowthIndicator}
            </span>
          </div>
          <div className="bg-[#03070D] border border-[#172638]/70 p-3 rounded">
            <span className="text-[#8C9BAD] block text-[11px] mb-1">تسخیر کلمات کلیدی</span>
            <span className="font-mono font-bold text-[#22C55E]">
              {caseStudy.keywordGrowthIndicator}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#172638] flex items-center justify-between">
        <span className="text-xs text-[#536174] truncate max-w-[220px]">
          {caseStudy.services.join(' · ')}
        </span>
        <button
          onClick={() => onNavigate('seo')}
          className="text-xs text-[#4AA3FF] hover:text-[#00D9FF] font-medium transition-colors flex items-center gap-1"
        >
          <span>بررسی جزئیات استراتژی</span>
          <ArrowUpLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
