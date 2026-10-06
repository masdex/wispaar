import React, { useState } from 'react';
import { Project, PageRoute } from '../types';
import { ArrowUpLeft, ExternalLink, Smartphone, Monitor } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onNavigate: (route: PageRoute, slug?: string) => void;
  featured?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onNavigate,
  featured = false,
}) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <article
      className={`group relative bg-[#06111F] border border-[#172638] hover:border-[#23364C] transition-all duration-300 rounded-xl overflow-hidden flex flex-col ${
        featured ? 'lg:col-span-2' : ''
      }`}
    >
      {/* Top Media Frame */}
      <div className="relative aspect-[16/10] bg-[#0A1626] overflow-hidden border-b border-[#172638]">
        {/* Concept / Demo Marker (unboxed, honest indicator per specification) */}
        {project.isDemo && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-[#03070D]/80 border border-[#23364C] backdrop-blur-md px-2.5 py-1 rounded text-[11px] text-[#00D9FF] font-mono">
            <span>CONCEPT / DEMO</span>
          </div>
        )}

        {/* View Toggle on Hover/Interactive */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-[#03070D]/80 border border-[#172638] rounded p-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewMode('desktop');
            }}
            title="نمای دسکتاپ"
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'desktop' ? 'bg-[#172638] text-white' : 'text-[#8C9BAD] hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewMode('mobile');
            }}
            title="نمای موبایل"
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'mobile' ? 'bg-[#172638] text-white' : 'text-[#8C9BAD] hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual Asset Container */}
        <div
          onClick={() => onNavigate('project-detail', project.slug)}
          className={`w-full h-full cursor-pointer flex items-center justify-center p-4 transition-transform duration-500 ${
            viewMode === 'mobile' ? 'max-w-[240px] mx-auto' : ''
          }`}
        >
          <img
            src={project.coverImage}
            alt={project.title}
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover rounded-lg group-hover:scale-102 transition-transform duration-500 shadow-xl ${
              viewMode === 'mobile' ? 'border-2 border-[#172638] shadow-2xl rounded-2xl' : ''
            }`}
          />
          {/* Styled CSS fallback if image not yet loaded */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-tr from-[#06111F] to-[#0A1626] flex items-center justify-center text-xs text-[#8C9BAD]">
              <span>در حال بارگذاری اثر...</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata (Zero-Pill discipline) */}
          <div className="flex items-center gap-2 text-xs text-[#8C9BAD] mb-2.5 font-latin">
            <span>{project.industry}</span>
            <span aria-hidden="true" className="text-[#536174]">·</span>
            <span>{project.projectType}</span>
            <span aria-hidden="true" className="text-[#536174]">·</span>
            <span>{project.year}</span>
          </div>

          {/* Title & Link */}
          <h3 className="text-xl font-bold text-[#F5F8FC] group-hover:text-[#00D9FF] transition-colors flex items-center justify-between mb-3">
            <button
              onClick={() => onNavigate('project-detail', project.slug)}
              className="text-right focus:outline-none"
            >
              {project.title}
              <span className="block text-xs font-normal text-[#8C9BAD] font-latin mt-0.5">
                {project.titleEn}
              </span>
            </button>
            <ArrowUpLeft className="w-5 h-5 text-[#8C9BAD] group-hover:text-[#00D9FF] transition-all transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
          </h3>

          <p className="text-sm text-[#8C9BAD] line-clamp-2 leading-relaxed mb-4">
            {project.challenge}
          </p>

          {/* Key KPI / Result Highlight */}
          {project.results && project.results.length > 0 && (
            <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-[#172638]/70 my-3">
              <div>
                <div className="text-lg font-bold text-[#F5F8FC] font-latin">
                  {project.results[0].value}
                </div>
                <div className="text-[11px] text-[#8C9BAD] truncate">
                  {project.results[0].label}
                </div>
              </div>
              {project.results[1] && (
                <div>
                  <div className="text-lg font-bold text-[#00D9FF] font-latin">
                    {project.results[1].value}
                  </div>
                  <div className="text-[11px] text-[#8C9BAD] truncate">
                    {project.results[1].label}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info & CTA */}
        <div className="pt-3 flex items-center justify-between text-xs border-t border-[#172638]/50">
          <div className="text-[#536174] truncate max-w-[200px]">
            {project.technology.join(' · ')}
          </div>
          <button
            onClick={() => onNavigate('project-detail', project.slug)}
            className="text-[#4AA3FF] hover:text-[#00D9FF] font-medium transition-colors flex items-center gap-1"
          >
            <span>مشاهده مطالعه کامل</span>
            <span className="font-mono text-xs">←</span>
          </button>
        </div>
      </div>
    </article>
  );
};
