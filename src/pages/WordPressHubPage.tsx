import React, { useState, useEffect } from 'react';
import { PageRoute, Project } from '../types';
import { Breadcrumb } from '../components/Breadcrumb';
import { wpThemeFiles } from '../data/wordpressThemeFiles';
import { downloadWordPressThemeZip } from '../utils/exportThemeZip';
import {
  getStoredLeads,
  updateLeadStatus,
  deleteLead,
  getCustomProjects,
  saveCustomProject,
  getWordPressEndpoint,
  setWordPressEndpoint,
  WordPressLead,
} from '../utils/wordpressStore';
import { projectsData } from '../data/projectsData';
import {
  Download,
  FolderArchive,
  Layers,
  Code,
  CheckCircle2,
  FileCode,
  Copy,
  Check,
  Server,
  Sparkles,
  ExternalLink,
  Plus,
  Trash2,
  Eye,
  X,
  Phone,
  Mail,
  Calendar,
  Settings
} from 'lucide-react';

interface WordPressHubPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
  onProjectAdded?: () => void;
}

export const WordPressHubPage: React.FC<WordPressHubPageProps> = ({
  onNavigate,
  onProjectAdded,
}) => {
  const [activeTab, setActiveTab] = useState<'download' | 'leads' | 'projects' | 'files' | 'connect'>('download');
  const [downloading, setDownloading] = useState(false);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);

  // Leads state
  const [leads, setLeads] = useState<WordPressLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<WordPressLead | null>(null);

  // Projects state
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    titleEn: '',
    client: '',
    industry: 'فین‌تک و خدمات مالی',
    year: '۱۴۰۴',
    projectType: 'وب‌سایت اختصاصی و سیستم هویت برند',
    challenge: '',
    solution: '',
    kpi1Value: '۹۹/۱۰۰',
    kpi1Label: 'پرفورمنس لایت‌هاوس',
    kpi2Value: '+۷۵٪',
    kpi2Label: 'نرخ تبدیل سرنخ',
    isDemo: true,
  });

  // Remote WP endpoint state
  const [remoteEndpoint, setRemoteEndpoint] = useState('');
  const [endpointSaved, setEndpointSaved] = useState(false);

  useEffect(() => {
    setLeads(getStoredLeads());
    setRemoteEndpoint(getWordPressEndpoint());
    const custom = getCustomProjects();
    setAllProjects([...custom, ...projectsData]);
  }, []);

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      await downloadWordPressThemeZip();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyCode = (content: string, fileName: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleStatusChange = (id: string, status: 'new' | 'reviewed' | 'contacted') => {
    const updated = updateLeadStatus(id, status);
    setLeads(updated);
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status });
    }
  };

  const handleDeleteLead = (id: string) => {
    if (confirm('آیا از حذف این درخواست مطمئن هستید؟')) {
      const updated = deleteLead(id);
      setLeads(updated);
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(null);
      }
    }
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) return;

    const slug = 'project-' + Date.now();
    const createdProject: Project = {
      id: slug,
      slug: slug,
      title: newProject.title,
      titleEn: newProject.titleEn || newProject.title,
      client: newProject.client || 'سفارشی ویسپار',
      industry: newProject.industry,
      services: ['طراحی اختصاصی UI/UX', 'توسعه وردپرس مهندسی‌شده'],
      technology: ['WordPress Headless', 'Tailwind', 'ACF Pro'],
      year: newProject.year,
      projectType: newProject.projectType,
      coverImage: '/src/assets/images/project_arch_fintech_1791304932616.jpg',
      isDemo: newProject.isDemo,
      editorialQuote: '«آفریده‌شده با تلفیق خرد و فناوری در استودیو ویسپار.»',
      challenge: newProject.challenge || 'طراحی و توسعه ساختار مقیاس‌پذیر برای نیازهای کسب‌وکار.',
      solution: newProject.solution || 'پیاده‌سازی دیزاین سیستم مینیمال و بهینه‌سازی حداکثری سرعت.',
      results: [
        { label: newProject.kpi1Label, value: newProject.kpi1Value, detail: 'شاخص عملکرد' },
        { label: newProject.kpi2Label, value: newProject.kpi2Value, detail: 'شاخص رشد' }
      ],
      websiteUrlPlaceholder: 'https://demo.wispaar.com',
      tags: [newProject.industry, 'وردپرس اختصاصی']
    };

    saveCustomProject(createdProject);
    setAllProjects([createdProject, ...allProjects]);
    setShowAddProjectModal(false);
    if (onProjectAdded) onProjectAdded();
    alert('پروژه جدید با موفقیت به سیستم اضافه شد و در نمایشگاه پروژه‌ها قابل مشاهده است!');
  };

  const handleSaveEndpoint = (e: React.FormEvent) => {
    e.preventDefault();
    setWordPressEndpoint(remoteEndpoint);
    setEndpointSaved(true);
    setTimeout(() => setEndpointSaved(false), 2500);
  };

  const newLeadsCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-12">
      <Breadcrumb items={[{ label: 'مرکز توسعه وردپرس و بک‌اند (WordPress Hub)' }]} onNavigate={onNavigate} />

      {/* Hero Banner */}
      <section className="bg-gradient-to-l from-[#06111F] via-[#0A1626] to-[#06111F] border border-[#23364C] rounded-2xl p-8 lg:p-12 relative overflow-hidden">
        <div className="max-w-3xl space-y-5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF]">
            <span className="bg-[#03070D] border border-[#172638] px-2 py-0.5 rounded">&lt;/WORDPRESS CORE&gt;</span>
            <span>سازگار با المنتور (Elementor) · انواع پست سفارشی · مدیریت لیدها</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F5F8FC] leading-tight">
            تبدیل کامل به قالب وردپرس + مدیریت درخواست‌ها و نمونه‌کارها در پیشخوان
          </h1>

          <p className="text-sm sm:text-base text-[#C5D0DD] leading-relaxed">
            کدهای این پروژه به‌گونه‌ای مهندسی شده‌اند که می‌توانید آن را با یک کلیک به صورت یک{' '}
            <strong className="text-white">قالب کامل، استاندارد و آماده نصب در وردپرس</strong> دانلود کنید.
            همچنین تمام فرم‌های بریف و مشاوره مستقیماً در منوی اختصاصی پیشخوان وردپرس ذخیره شده و نمونه‌کارها به صورت انواع پست سفارشی (CPT) قابل ویرایش و افزودن هستند.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={handleDownloadZip}
              disabled={downloading}
              className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] rounded-xl transition-all shadow-lg shadow-[#1769FF]/25 flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'در حال ایجاد فایل زیپ...' : 'دانلود پکیج کامل قالب وردپرس (ZIP آماده نصب)'}</span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className="px-5 py-3.5 text-xs sm:text-sm font-medium text-[#00D9FF] bg-[#03070D] border border-[#23364C] hover:bg-[#0A1626] rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>مشاهده پیشخوان درخواست‌های رسیده</span>
              {newLeadsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#EF4444] text-white font-mono">
                  {newLeadsCount} جدید
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#172638] scrollbar-none">
        {[
          { id: 'download', label: 'راهنمای نصب و امکانات قالب', icon: FolderArchive },
          { id: 'leads', label: `درخواست‌های پروژه و لیدها (${leads.length})`, icon: Mail, badge: newLeadsCount },
          { id: 'projects', label: `مدیریت و افزودن نمونه‌کارها (${allProjects.length})`, icon: Layers },
          { id: 'connect', label: 'اتصال به سرور وردپرس واقعی (REST API)', icon: Server },
          { id: 'files', label: 'مرورگر کدهای منبع قالب (PHP & CSS)', icon: Code },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#1769FF] text-white shadow-md'
                  : 'text-[#8C9BAD] hover:text-[#F5F8FC] hover:bg-[#06111F]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge ? (
                <span className="w-5 h-5 rounded-full bg-[#EF4444] text-white text-[11px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* TAB 1: DOWNLOAD & INSTRUCTIONS */}
      {activeTab === 'download' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#06111F] border border-[#172638] rounded-2xl p-8 space-y-6">
              <h2 className="text-xl font-bold text-[#F5F8FC] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                <span>ویژگی‌های کلیدی قالب وردپرس WISPAAR</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 bg-[#0A1626] border border-[#172638] rounded-xl space-y-1.5">
                  <strong className="text-[#00D9FF] block">۱. سازگاری ۱۰۰٪ با المنتور (Elementor):</strong>
                  <span className="text-[#8C9BAD]">
                    دارای ویجت‌های اختصاصی هیرو، نمایشگاه پروژه‌ها، کارت‌های خدمات و فرم بریف قابل درگ‌اند‌دراپ در ویرایشگر المنتور.
                  </span>
                </div>

                <div className="p-4 bg-[#0A1626] border border-[#172638] rounded-xl space-y-1.5">
                  <strong className="text-[#00D9FF] block">۲. پنل پیشخوان لیدها (Leads Inbox):</strong>
                  <span className="text-[#8C9BAD]">
                    دریافت خودکار بریف‌های ۵ مرحله‌ای کاربران با تمام جزئیات (بودجه، خدمات، زمان‌بندی و شماره تماس) با ایمیل نوتیفیکیشن.
                  </span>
                </div>

                <div className="p-4 bg-[#0A1626] border border-[#172638] rounded-xl space-y-1.5">
                  <strong className="text-[#00D9FF] block">۳. انواع پست سفارشی (Custom Post Types):</strong>
                  <span className="text-[#8C9BAD]">
                    پست‌تایپ اختصاصی <code className="font-mono text-[#00D9FF]">wispaar_project</code> با فیلدهای متای کارفرما، سال، چالش، راهکار، نتایج و وضعیت دمو.
                  </span>
                </div>

                <div className="p-4 bg-[#0A1626] border border-[#172638] rounded-xl space-y-1.5">
                  <strong className="text-[#00D9FF] block">۴. اندپوینت‌های REST API یکپارچه:</strong>
                  <span className="text-[#8C9BAD]">
                    امکان استفاده به عنوان قالب مستقل PHP یا بک‌اند هدلس برای فرانت‌اند React با اندپوینت‌های امن و آماده.
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#172638]">
                <h3 className="text-sm font-bold text-[#F5F8FC] mb-3">مراحل نصب آسان در ۳ قدم:</h3>
                <ol className="space-y-3 text-xs sm:text-sm text-[#C5D0DD] list-decimal pr-5">
                  <li>
                    روی دکمه <strong className="text-[#00D9FF]">«دانلود پکیج کامل قالب وردپرس»</strong> کلیک کنید تا فایل <code className="font-mono text-white bg-[#03070D] px-2 py-0.5 rounded">wispaar-theme.zip</code> دانلود شود.
                  </li>
                  <li>
                    وارد پیشخوان وردپرس سایت خود شوید: <code className="font-mono text-white bg-[#03070D] px-2 py-0.5 rounded">yoursite.com/wp-admin</code>
                  </li>
                  <li>
                    به منوی <strong>نمایش (Appearance) ← پوسته‌ها (Themes) ← افزودن پوسته تازه ← بارگذاری پوسته</strong> رفته و فایل زیپ را آپلود و فعال نمایید.
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#06111F] border border-[#23364C] rounded-2xl p-6 text-center space-y-4">
              <FolderArchive className="w-12 h-12 text-[#00D9FF] mx-auto" />
              <h3 className="text-lg font-bold text-[#F5F8FC]">دانلود مستقیم فایل زیپ</h3>
              <p className="text-xs text-[#8C9BAD] leading-relaxed">
                این بسته شامل ۹ فایل استاندارد PHP، شیوه نامه‌های CSS، سازگاری با Elementor و راهنمای کامل است.
              </p>
              <button
                onClick={handleDownloadZip}
                disabled={downloading}
                className="w-full py-3 text-xs font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'در حال آماده‌سازی...' : 'دانلود wispaar-theme.zip'}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: LIVE WP-ADMIN LEADS INBOX */}
      {activeTab === 'leads' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF] mb-1">
                <span>&lt;WP-ADMIN SIMULATOR&gt;</span>
                <span>·</span>
                <span>منوی: درخواست‌های پروژه و بریف (Leads)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F5F8FC]">
                صندوق ورودی بریف‌ها و فرم‌های مشاوره در پیشخوان وردپرس
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('start-project')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>تست ارسال بریف جدید از فرم سایت ←</span>
              </button>
            </div>
          </div>

          {/* WordPress Leads Table */}
          <div className="bg-[#06111F] border border-[#172638] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-[#03070D] border-b border-[#172638] flex items-center justify-between text-xs text-[#8C9BAD]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#F5F8FC]">همه بریف‌های ثبت‌شده ({leads.length})</span>
                <span className="text-[#536174]">|</span>
                <span className="text-[#00D9FF]">{newLeadsCount} درخواست در انتظار بررسی</span>
              </div>
              <div className="text-[11px] text-[#536174]">ثبت آنی از فرم /start-project و /contact</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-[#0A1626] text-[#8C9BAD] border-b border-[#172638]">
                    <th className="p-4 font-semibold">نام متقاضی / سازمان</th>
                    <th className="p-4 font-semibold">شماره تماس</th>
                    <th className="p-4 font-semibold">ایمیل</th>
                    <th className="p-4 font-semibold">خدمات درخواستی</th>
                    <th className="p-4 font-semibold">بودجه</th>
                    <th className="p-4 font-semibold">وضعیت</th>
                    <th className="p-4 font-semibold">زمان ثبت</th>
                    <th className="p-4 font-semibold text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#172638]">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-[#8C9BAD]">
                        هیچ درخواستی ثبت نشده است. می‌توانید با ارسال فرم در صفحه «شروع یک پروژه»، ثبت آنی را امتحان کنید.
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-[#0A1626]/60 transition-colors">
                        <td className="p-4 font-bold text-[#F5F8FC] whitespace-nowrap">
                          {lead.name}
                        </td>
                        <td className="p-4 font-mono text-[#00D9FF] whitespace-nowrap" dir="ltr">
                          {lead.phone}
                        </td>
                        <td className="p-4 text-[#8C9BAD] whitespace-nowrap" dir="ltr">
                          {lead.email}
                        </td>
                        <td className="p-4 text-[#C5D0DD] max-w-[200px] truncate">
                          {lead.services.join('، ') || 'عمومی'}
                        </td>
                        <td className="p-4 text-[#8C9BAD] whitespace-nowrap">
                          {lead.budget ? lead.budget.split('(')[0] : 'مشاوره'}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold border outline-none cursor-pointer ${
                              lead.status === 'new'
                                ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30'
                                : lead.status === 'reviewed'
                                ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30'
                                : 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30'
                            }`}
                          >
                            <option value="new" className="bg-[#06111F] text-white">جدید (بررسی نشده)</option>
                            <option value="reviewed" className="bg-[#06111F] text-white">در حال بررسی فنی</option>
                            <option value="contacted" className="bg-[#06111F] text-white">جلسه هماهنگ شد</option>
                          </select>
                        </td>
                        <td className="p-4 text-[#536174] whitespace-nowrap font-mono text-[11px]">
                          {lead.createdAt}
                        </td>
                        <td className="p-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              title="مشاهده جزئیات کامل بریف"
                              className="p-1.5 rounded bg-[#0A1626] hover:bg-[#172638] text-[#00D9FF] transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              title="حذف"
                              className="p-1.5 rounded bg-[#0A1626] hover:bg-[#EF4444]/20 text-[#EF4444] transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lead Details Modal */}
          {selectedLead && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-[#06111F] border border-[#23364C] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-6 p-6 sm:p-8">
                <div className="flex items-center justify-between pb-4 border-b border-[#172638]">
                  <div>
                    <span className="text-xs font-mono text-[#00D9FF]">سند بریف پروژه در پیشخوان وردپرس</span>
                    <h3 className="text-xl font-bold text-[#F5F8FC] mt-0.5">{selectedLead.name}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="p-1.5 rounded-lg text-[#8C9BAD] hover:text-white hover:bg-[#0A1626]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0A1626] p-4 rounded-xl border border-[#172638]">
                    <div>
                      <span className="text-[#536174] block mb-1">شماره تماس مستقیم:</span>
                      <a href={`tel:${selectedLead.phone}`} className="font-mono text-base font-bold text-[#00D9FF]">
                        {selectedLead.phone}
                      </a>
                    </div>
                    <div>
                      <span className="text-[#536174] block mb-1">ایمیل:</span>
                      <a href={`mailto:${selectedLead.email}`} className="text-white hover:underline">
                        {selectedLead.email}
                      </a>
                    </div>
                    <div>
                      <span className="text-[#536174] block mb-1">بازه بودجه:</span>
                      <span className="text-white">{selectedLead.budget || 'مشاوره و تعیین محدوده'}</span>
                    </div>
                    <div>
                      <span className="text-[#536174] block mb-1">زمان‌بندی مد نظر:</span>
                      <span className="text-white">{selectedLead.timeline || 'استاندارد'}</span>
                    </div>
                  </div>

                  <div>
                    <strong className="text-[#F5F8FC] block mb-1">خدمات درخواستی:</strong>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedLead.services.map((s, idx) => (
                        <span key={idx} className="bg-[#03070D] border border-[#172638] px-2.5 py-1 rounded text-xs text-[#C5D0DD]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedLead.description && (
                    <div>
                      <strong className="text-[#F5F8FC] block mb-1">توضیحات و چشم‌انداز مشتری:</strong>
                      <div className="p-3 bg-[#03070D] border border-[#172638] rounded-xl text-xs text-[#C5D0DD] leading-relaxed">
                        {selectedLead.description}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-[#172638] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#8C9BAD]">تغییر وضعیت:</span>
                      <select
                        value={selectedLead.status}
                        onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as any)}
                        className="bg-[#0A1626] border border-[#172638] text-white rounded px-3 py-1.5 text-xs outline-none"
                      >
                        <option value="new">جدید (بررسی نشده)</option>
                        <option value="reviewed">در حال بررسی فنی</option>
                        <option value="contacted">جلسه هماهنگ شد</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setSelectedLead(null)}
                      className="px-5 py-2 text-xs font-semibold text-white bg-[#1769FF] rounded-lg hover:bg-[#155bd8]"
                    >
                      بستن
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB 3: PROJECTS MANAGER */}
      {activeTab === 'projects' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF] mb-1">
                <span>&lt;CUSTOM POST TYPE: wispaar_project&gt;</span>
                <span>·</span>
                <span>مدیریت نمونه‌کارها در پیشخوان</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F5F8FC]">
                پروژه‌های ثبت‌شده در وردپرس (قابلیت ویرایش و افزودن فوری)
              </h2>
            </div>

            <button
              onClick={() => setShowAddProjectModal(true)}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن نمونه‌کار جدید به وردپرس</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProjects.map((p) => (
              <div key={p.id} className="bg-[#06111F] border border-[#172638] rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#8C9BAD] mb-2 font-latin">
                    <span>{p.industry}</span>
                    <span>{p.year}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#F5F8FC] mb-1">{p.title}</h3>
                  <div className="text-xs text-[#00D9FF] font-latin mb-2">{p.titleEn}</div>
                  <p className="text-xs text-[#8C9BAD] line-clamp-2 leading-relaxed mb-4">
                    {p.challenge}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#172638] flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${p.isDemo ? 'bg-[#00D9FF]/20 text-[#00D9FF]' : 'bg-[#22C55E]/20 text-[#22C55E]'}`}>
                    {p.isDemo ? 'CONCEPT DEMO' : 'LIVE CLIENT'}
                  </span>
                  <button
                    onClick={() => onNavigate('project-detail', p.slug)}
                    className="text-[#4AA3FF] hover:underline"
                  >
                    مشاهده صفحه پروژه ←
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal to Add New Project */}
          {showAddProjectModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
              <div className="bg-[#06111F] border border-[#23364C] rounded-2xl w-full max-w-xl p-6 sm:p-8 space-y-5 my-8">
                <div className="flex items-center justify-between pb-3 border-b border-[#172638]">
                  <h3 className="text-lg font-bold text-[#F5F8FC]">افزودن نمونه‌کار تازه (CPT: wispaar_project)</h3>
                  <button onClick={() => setShowAddProjectModal(false)} className="text-[#8C9BAD] hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveProject} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#8C9BAD] mb-1">عنوان فارسی پروژه *</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: پارس ونچرز"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        className="w-full bg-[#03070D] border border-[#172638] focus:border-[#00D9FF] text-white px-3 py-2 rounded-lg text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#8C9BAD] mb-1">نام انگلیسی پروژه</label>
                      <input
                        type="text"
                        placeholder="Pars Ventures"
                        value={newProject.titleEn}
                        onChange={(e) => setNewProject({ ...newProject, titleEn: e.target.value })}
                        className="w-full bg-[#03070D] border border-[#172638] focus:border-[#00D9FF] text-white px-3 py-2 rounded-lg text-xs outline-none"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#8C9BAD] mb-1">کارفرما</label>
                      <input
                        type="text"
                        placeholder="صندوق سرمایه‌گذاری پارس"
                        value={newProject.client}
                        onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                        className="w-full bg-[#03070D] border border-[#172638] focus:border-[#00D9FF] text-white px-3 py-2 rounded-lg text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#8C9BAD] mb-1">صنعت / حوزه</label>
                      <input
                        type="text"
                        placeholder="سرمایه‌گذاری خطرپذیر"
                        value={newProject.industry}
                        onChange={(e) => setNewProject({ ...newProject, industry: e.target.value })}
                        className="w-full bg-[#03070D] border border-[#172638] focus:border-[#00D9FF] text-white px-3 py-2 rounded-lg text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#8C9BAD] mb-1">سال اجرا</label>
                      <input
                        type="text"
                        value={newProject.year}
                        onChange={(e) => setNewProject({ ...newProject, year: e.target.value })}
                        className="w-full bg-[#03070D] border border-[#172638] focus:border-[#00D9FF] text-white px-3 py-2 rounded-lg text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8C9BAD] mb-1">چالش اساسی پروژه</label>
                    <textarea
                      rows={2}
                      placeholder="مسئله‌ای که کارفرما با آن مواجه بود..."
                      value={newProject.challenge}
                      onChange={(e) => setNewProject({ ...newProject, challenge: e.target.value })}
                      className="w-full bg-[#03070D] border border-[#172638] focus:border-[#00D9FF] text-white p-2.5 rounded-lg text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8C9BAD] mb-1">راهکار مهندسی ویسپار</label>
                    <textarea
                      rows={2}
                      placeholder="راهکار طراحی و توسعه که اجرا شد..."
                      value={newProject.solution}
                      onChange={(e) => setNewProject({ ...newProject, solution: e.target.value })}
                      className="w-full bg-[#03070D] border border-[#172638] focus:border-[#00D9FF] text-white p-2.5 rounded-lg text-xs outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-[#0A1626] p-3 rounded-lg border border-[#172638]">
                    <div>
                      <label className="block text-[11px] text-[#8C9BAD] mb-1">شاخص ۱ (مقدار / برچسب)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newProject.kpi1Value}
                          onChange={(e) => setNewProject({ ...newProject, kpi1Value: e.target.value })}
                          className="w-1/2 bg-[#03070D] border border-[#172638] text-white p-1.5 rounded text-xs text-center"
                        />
                        <input
                          type="text"
                          value={newProject.kpi1Label}
                          onChange={(e) => setNewProject({ ...newProject, kpi1Label: e.target.value })}
                          className="w-1/2 bg-[#03070D] border border-[#172638] text-white p-1.5 rounded text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#8C9BAD] mb-1">شاخص ۲ (مقدار / برچسب)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newProject.kpi2Value}
                          onChange={(e) => setNewProject({ ...newProject, kpi2Value: e.target.value })}
                          className="w-1/2 bg-[#03070D] border border-[#172638] text-white p-1.5 rounded text-xs text-center"
                        />
                        <input
                          type="text"
                          value={newProject.kpi2Label}
                          onChange={(e) => setNewProject({ ...newProject, kpi2Label: e.target.value })}
                          className="w-1/2 bg-[#03070D] border border-[#172638] text-white p-1.5 rounded text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isDemoCheck"
                      checked={newProject.isDemo}
                      onChange={(e) => setNewProject({ ...newProject, isDemo: e.target.checked })}
                      className="cursor-pointer"
                    />
                    <label htmlFor="isDemoCheck" className="text-xs text-[#C5D0DD] cursor-pointer">
                      نمونه کانسپت استودیو است (Concept / Demo) — حفظ شفافیت حرفه‌ای
                    </label>
                  </div>

                  <div className="pt-3 border-t border-[#172638] flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddProjectModal(false)}
                      className="px-4 py-2 text-xs text-[#8C9BAD] hover:text-white"
                    >
                      انصراف
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 text-xs font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] rounded-lg transition-colors cursor-pointer"
                    >
                      ذخیره و انتشار پروژه در سایت
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB 4: CONNECT TO LIVE WORDPRESS */}
      {activeTab === 'connect' && (
        <section className="bg-[#06111F] border border-[#172638] rounded-2xl p-8 space-y-6 max-w-3xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF] mb-1">
              <span>&lt;REST API WEBHOOK&gt;</span>
              <span>·</span>
              <span>اتصال مستقیم فرانت‌اند به هاست وردپرس شما</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F5F8FC]">
              ارسال مستقیم فرم‌ها به وردپرس زنده شما
            </h2>
            <p className="text-sm text-[#8C9BAD] leading-relaxed mt-2">
              اگر قالب ویسپار را روی هاست وردپرس واقعی خود نصب کرده‌اید، می‌توانید آدرس دامنه آن را در کادر زیر وارد کنید تا تمام فرم‌های بریف و تماس از این سایت مستقیماً به آدرس <code className="font-mono text-[#00D9FF]">/wp-json/wispaar/v1/brief</code> ارسال و در دیتابیس وردپرس شما ذخیره گردند.
            </p>
          </div>

          <form onSubmit={handleSaveEndpoint} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#8C9BAD] mb-2">
                آدرس وب‌سایت وردپرسی شما (WordPress Site URL):
              </label>
              <input
                type="url"
                placeholder="https://your-wordpress-site.com"
                value={remoteEndpoint}
                onChange={(e) => setRemoteEndpoint(e.target.value)}
                className="w-full bg-[#03070D] border border-[#172638] focus:border-[#00D9FF] text-white px-4 py-3 rounded-xl text-sm outline-none font-mono"
                dir="ltr"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] rounded-xl transition-colors cursor-pointer"
              >
                ذخیره آدرس وب‌هوک
              </button>
              {endpointSaved && (
                <span className="text-xs text-[#22C55E] flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  تنظیمات با موفقیت ذخیره شد!
                </span>
              )}
            </div>
          </form>

          <div className="p-4 bg-[#0A1626] border border-[#172638] rounded-xl text-xs text-[#8C9BAD] space-y-2">
            <strong className="text-[#00D9FF] block">نحوه عملکرد امنیتی:</strong>
            <p>
              قالب ویسپار دارای اندپوینت‌های امنیتی استاندارد وردپرس با اعتبارسنجی ورودی‌ها (Sanitization & Nonce) است و نیازی به نصب هیچ افزونه فرم‌ساز جانبی مانند Contact Form 7 یا Gravity Forms نخواهید داشت.
            </p>
          </div>
        </section>
      )}

      {/* TAB 5: SOURCE CODE INSPECTOR */}
      {activeTab === 'files' && (
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#F5F8FC]">مرورگر ساختار فایل‌های قالب وردپرس</h2>
            <p className="text-xs text-[#8C9BAD]">
              فایل‌های PHP و CSS تمیز و بهینه‌سازی شده که درون بسته زیپ قالب قرار دارند:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* File List */}
            <div className="lg:col-span-4 space-y-2">
              {wpThemeFiles.map((file, idx) => (
                <button
                  key={file.name}
                  onClick={() => setSelectedFileIdx(idx)}
                  className={`w-full text-right p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                    selectedFileIdx === idx
                      ? 'bg-[#0A1626] border-[#00D9FF] text-[#F5F8FC]'
                      : 'bg-[#06111F] border-[#172638] text-[#8C9BAD] hover:border-[#23364C]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-[#00D9FF] shrink-0" />
                    <span className="font-mono text-left" dir="ltr">{file.name}</span>
                  </div>
                  <span className="text-[10px] text-[#536174]">PHP/CSS</span>
                </button>
              ))}
            </div>

            {/* Code View */}
            <div className="lg:col-span-8 bg-[#06111F] border border-[#172638] rounded-2xl overflow-hidden flex flex-col">
              <div className="p-4 bg-[#03070D] border-b border-[#172638] flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-[#00D9FF]" dir="ltr">
                    {wpThemeFiles[selectedFileIdx].path}
                  </span>
                  <div className="text-[11px] text-[#8C9BAD] mt-0.5">
                    {wpThemeFiles[selectedFileIdx].description}
                  </div>
                </div>

                <button
                  onClick={() => handleCopyCode(wpThemeFiles[selectedFileIdx].content, wpThemeFiles[selectedFileIdx].name)}
                  className="px-3 py-1.5 text-xs bg-[#0A1626] hover:bg-[#172638] text-[#C5D0DD] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedFile === wpThemeFiles[selectedFileIdx].name ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                      <span className="text-[#22C55E]">کپی شد!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>کپی کد</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-5 text-xs font-mono text-[#C5D0DD] overflow-x-auto max-h-[500px] leading-relaxed select-all" dir="ltr">
                {wpThemeFiles[selectedFileIdx].content}
              </pre>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
