import React from 'react';
import { PageRoute } from '../types';
import { ChevronLeft } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  route?: PageRoute;
  slug?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (route: PageRoute, slug?: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
  return (
    <nav aria-label="موقعیت در سایت" className="flex items-center gap-1.5 text-xs text-[#8C9BAD] mb-6">
      <button
        onClick={() => onNavigate('home')}
        className="hover:text-[#F5F8FC] transition-colors"
      >
        خانه
      </button>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronLeft className="w-3.5 h-3.5 opacity-50 text-[#536174]" />
          {item.route ? (
            <button
              onClick={() => onNavigate(item.route!, item.slug)}
              className="hover:text-[#F5F8FC] transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-[#C5D0DD] font-medium" aria-current="page">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
