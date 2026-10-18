import React, { useState, useEffect } from 'react';
import { PageRoute, Project } from '../types';
import { wpThemeFiles } from '../data/wordpressThemeFiles';
import {
  downloadWordPressThemeZip,
  downloadWordPressPluginZip,
  downloadFixedHeadlessPluginZip,
  downloadSingleHeadlessPhpFile,
} from '../utils/exportThemeZip';
import { WordPressLead } from '../utils/wordpressStore';
import { Breadcrumb } from '../components/Breadcrumb';
import { useHeadless } from '../context/HeadlessContext';
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
  Settings,
  Activity,
  RefreshCw,
  Zap,
  Globe,
  AlertCircle,
  ArrowUpLeft,
  Database,
  Terminal,
  ShieldCheck,
  Search,
  Key,
} from 'lucide-react';

interface WordPressHubPageProps {
  onNavigate: (route: PageRoute, slug?: string) => void;
  onProjectAdded?: () => void;
}

export const WordPressHubPage: React.FC<WordPressHubPageProps> = ({
  onNavigate,
  onProjectAdded,
}) => {
  const {
    endpoint,
    setEndpoint,
    authHeader,
    setAuthHeader,
    status,
    failureCategory,
    diagnostic,
    latency,
    projects: allProjects,
    leads,
    totalProjects,
    totalArticles,
    isSyncing,
    lastSynced,
    capabilities,
    syncFromWordPress,
    runCandidateDiscovery,
    seedDatabase,
    createProject: createHeadlessProject,
    submitBrief: submitHeadlessBrief,
    updateLeadStatus,
    deleteLead,
  } = useHeadless();

  const [activeTab, setActiveTab] = useState<'connect' | 'download' | 'leads' | 'projects' | 'files'>('connect');
  const [downloading, setDownloading] = useState(false);
  const [downloadingPlugin, setDownloadingPlugin] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [inputAuthHeader, setInputAuthHeader] = useState(authHeader || '');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);

  // Leads modal state
  const [selectedLead, setSelectedLead] = useState<WordPressLead | null>(null);

  // New Project modal state
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

  // Local input for endpoint editing
  const [inputEndpoint, setInputEndpoint] = useState(endpoint || 'https://wispaar.ir');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isTestingBrief, setIsTestingBrief] = useState(false);

  useEffect(() => {
    if (endpoint) {
      setInputEndpoint(endpoint);
    }
  }, [endpoint]);

  const showBanner = (type: 'success' | 'error' | 'info', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      await downloadWordPressThemeZip();
      showBanner('success', 'فایل زیپ کامل پوسته وردپرس دانلود شد.');
    } catch (e) {
      console.error(e);
      showBanner('error', 'خطا در ایجاد فایل زیپ پوسته.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPluginZip = async () => {
    setDownloadingPlugin(true);
    try {
      await downloadFixedHeadlessPluginZip();
      showBanner('success', 'فایل زیپ افزونه وردپرس هدلس (wispaar-headless.zip) دانلود شد.');
    } catch (e) {
      console.error(e);
      showBanner('error', 'خطا در ایجاد فایل زیپ افزونه.');
    } finally {
      setDownloadingPlugin(false);
    }
  };

  const handleDownloadSinglePhp = () => {
    try {
      downloadSingleHeadlessPhpFile();
      showBanner('success', 'فایل headless.php با متد بدون BOM دانلود شد. آماده آپلود در wp-content/plugins/wispaar-headless/');
    } catch (e) {
      console.error(e);
      showBanner('error', 'خطا در دریافت مستقیم فایل PHP.');
    }
  };

  const handleCopyCode = (content: string, fileName: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleCopySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const handleSaveEndpoint = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setEndpoint(inputEndpoint);
    showBanner('info', 'در حال آزمون ارتباط با وردپرس...');
    const ok = await syncFromWordPress();
    if (ok) {
      showBanner('success', 'ارتباط با وردپرس هدلس با موفقیت برقرار شد!');
    } else {
      showBanner('error', 'ارتباط برقرار نشد. اطمینان حاصل کنید وردپرس روشن است و آدرس صحیح است.');
    }
  };

  const handleSeedDatabase = async () => {
    if (!endpoint) {
      showBanner('error', 'ابتدا آدرس سرور وردپرس را وارد کنید.');
      return;
    }
    setIsSeeding(true);
    try {
      const res = await seedDatabase();
      if (res.success) {
        showBanner('success', res.message);
      } else {
        showBanner('error', res.message);
      }
    } catch (e: any) {
      showBanner('error', 'خطا در درون‌ریزی داده‌ها در وردپرس.');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleTestBriefPush = async () => {
    setIsTestingBrief(true);
    try {
      const sampleLead = {
        name: 'تست خودکار استودیو ویسپار',
        email: 'test@wispaar.com',
        phone: '09120000000',
        services: ['توسعه پیشرفته وردپرس', 'معماری هدلس'],
        goals: ['آزمون سرعت وب‌هوک REST API'],
        platform: 'WordPress Headless Core',
        website: 'https://wispaar.com',
        budget: 'تست اتصال سیستمی',
        timeline: 'فوری',
        description: 'این بریف آزمایشی برای اعتبارسنجی ثبت خودکار در پیشخوان وردپرس از فرانت‌اند React ارسال شده است.',
      };

      const res = await submitHeadlessBrief(sampleLead);
      if (res.success) {
        showBanner('success', res.message);
        await syncFromWordPress();
      } else {
        showBanner('error', res.message);
      }
    } catch (e: any) {
      showBanner('error', 'خطا در ارسال بریف تستی.');
    } finally {
      setIsTestingBrief(false);
    }
  };

  const handleStatusChange = (id: string, newStatus: 'new' | 'reviewed' | 'contacted') => {
    updateLeadStatus(id, newStatus);
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  const handleDeleteLead = (id: string) => {
    if (confirm('آیا از حذف این درخواست مطمئن هستید؟')) {
      deleteLead(id);
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(null);
      }
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) return;

    const res = await createHeadlessProject(newProject);
    setShowAddProjectModal(false);
    showBanner('success', res.message);
    if (onProjectAdded) onProjectAdded();
  };

  const newLeadsCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-12">
      <Breadcrumb items={[{ label: 'مرکز توسعه وردپرس و بک‌اند (WordPress Headless Hub)' }]} onNavigate={onNavigate} />

      {/* Hero Banner */}
      <section className="bg-gradient-to-l from-[#06111F] via-[#0A1626] to-[#06111F] border border-[#23364C] rounded-2xl p-8 lg:p-12 relative overflow-hidden">
        <div className="max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#00D9FF]">
            <span className="bg-[#03070D] border border-[#172638] px-2 py-0.5 rounded">&lt;/HEADLESS CMS ARCHITECTURE&gt;</span>
            <span>·</span>
            <span>بک‌اند: وردپرس (REST API)</span>
            <span>·</span>
            <span>فرانت‌اند: React SPA + Tailwind</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F5F8FC] leading-tight">
            معماری هدلس؛ هر تغییری در وردپرس، آنی در فرانت‌اند ظاهر می‌شود.
          </h1>

          <p className="text-sm sm:text-base text-[#C5D0DD] leading-relaxed">
            این پروژه به صورت کامل به یک <strong className="text-white">Headless CMS</strong> تبدیل شده است: وردپرس به عنوان پنل بک‌اند برای مدیریت پروژه‌ها، مقالات و فرم‌های بریف عمل می‌کند؛ و فرانت‌اند React با اندپوینت‌های اختصاصی <code className="text-[#00D9FF] font-mono">/wp-json/wispaar/v1</code> متصل است. در صورت آفلاین بودن وردپرس نیز دیتای محلی به عنوان Fallback بی‌نقص عمل می‌کند تا سایت هرگز خالی نماند.
          </p>

          {/* Quick Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('connect')}
              className="px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#1769FF]/20"
            >
              <Zap className="w-4 h-4" />
              <span>پنل اتصال و همگام‌سازی وردپرس هدلس</span>
            </button>

            <button
              onClick={handleDownloadPluginZip}
              disabled={downloadingPlugin}
              className="px-5 py-3 text-xs sm:text-sm font-semibold text-[#00D9FF] bg-[#03070D] border border-[#00D9FF]/40 hover:bg-[#00D9FF]/10 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              title="دانلود افزونه وردپرس هدلس برای حل خطای هدر و فعال‌سازی REST API"
            >
              <Download className="w-4 h-4 text-[#00D9FF]" />
              <span>{downloadingPlugin ? 'در حال ایجاد زیپ...' : 'دانلود افزونه هدلس (ZIP)'}</span>
            </button>

            <button
              onClick={handleDownloadZip}
              disabled={downloading}
              className="px-5 py-3 text-xs sm:text-sm font-semibold text-[#C5D0DD] bg-[#03070D] border border-[#23364C] hover:bg-[#0A1626] rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'در حال ایجاد فایل زیپ...' : 'دانلود پوسته وردپرس (ZIP)'}</span>
            </button>

            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#03070D] border border-[#172638] text-xs font-mono">
              <span className={`w-2.5 h-2.5 rounded-full ${status === 'connected' ? 'bg-[#22C55E] animate-pulse' : 'bg-[#536174]'}`} />
              <span className="text-[#8C9BAD]">وضعیت اتصال:</span>
              <span className={status === 'connected' ? 'text-[#22C55E] font-bold' : 'text-[#8C9BAD]'}>
                {status === 'connected' ? `متصل (${latency}ms)` : status === 'connecting' ? 'در حال تست...' : 'آفلاین / Fallback'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Global Toast Feedback */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition-all ${
            feedbackMsg.type === 'success'
              ? 'bg-[#22C55E]/10 border-[#22C55E]/40 text-[#22C55E]'
              : feedbackMsg.type === 'error'
              ? 'bg-[#EF4444]/10 border-[#EF4444]/40 text-[#EF4444]'
              : 'bg-[#1769FF]/10 border-[#1769FF]/40 text-[#4AA3FF]'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-xs opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#172638] scrollbar-none">
        {[
          { id: 'connect', label: '⚡ وردپرس هدلس & همگام‌سازی زنده', icon: Zap },
          { id: 'download', label: 'راهنمای نصب و امکانات قالب', icon: FolderArchive },
          { id: 'leads', label: `درخواست‌های پروژه و لیدها (${leads.length})`, icon: Mail, badge: newLeadsCount },
          { id: 'projects', label: `مدیریت نمونه‌کارها (${allProjects.length})`, icon: Layers },
          { id: 'files', label: 'کدهای منبع تم و اندپوینت‌ها', icon: Code },
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

      {/* TAB 1: HEADLESS LIVE COMMAND CENTER */}
      {activeTab === 'connect' && (
        <section className="space-y-8">
          {/* Top Grid: Connection Box & Diagnostics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Endpoint Settings Form */}
            <div className="lg:col-span-7 bg-[#06111F] border border-[#172638] rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF] mb-1">
                  <span>&lt;REST API LIVE BRIDGE&gt;</span>
                  <span>·</span>
                  <span>اتصال پویا به وردپرس</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#F5F8FC]">
                  اتصال فرانت‌اند React به دیتابیس وردپرس
                </h2>
                <p className="text-xs sm:text-sm text-[#8C9BAD] leading-relaxed mt-1.5">
                  آدرس سایت وردپرس محلی (مثل LocalWP) یا دامنه سرور خود را در کادر زیر وارد کنید تا فرانت‌اند به صورت زنده به آن متصل شده و داده‌ها را بخواند و بنویسد.
                </p>
              </div>

              <form onSubmit={handleSaveEndpoint} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8C9BAD] mb-2">
                    آدرس وب‌سایت وردپرسی (WordPress Site URL):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="https://wispaar.ir"
                      value={inputEndpoint}
                      onChange={(e) => setInputEndpoint(e.target.value)}
                      className="w-full bg-[#03070D] border border-[#172638] focus:border-[#00D9FF] text-white px-4 py-3 rounded-xl text-sm outline-none font-mono"
                      dir="ltr"
                    />
                    <Globe className="w-4 h-4 text-[#536174] absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-[#536174]">انتخاب سریع آدرس‌های استاندارد (سرور پروداکشن / لوکال):</span>
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    {[
                      'https://wispaar.ir',
                      'http://demo.local',
                      'http://localhost:10004',
                      'http://localhost/demo',
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setInputEndpoint(preset);
                          setEndpoint(preset);
                        }}
                        className="px-2.5 py-1 rounded bg-[#0A1626] border border-[#172638] text-[#8C9BAD] hover:text-[#00D9FF] hover:border-[#00D9FF] transition-all cursor-pointer"
                        dir="ltr"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSyncing}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] disabled:opacity-50 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-[#1769FF]/20"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'در حال آزمون...' : 'تست اتصال و بررسی سلامت'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => syncFromWordPress()}
                    disabled={isSyncing}
                    className="px-4 py-2.5 text-xs font-medium text-[#00D9FF] bg-[#0A1626] border border-[#172638] hover:bg-[#122238] rounded-xl transition-all cursor-pointer flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>دریافت مجدد محتوا از وردپرس</span>
                  </button>
                </div>
              </form>

              {/* Status Note */}
              <div className="p-4 bg-[#0A1626] border border-[#172638] rounded-xl text-xs text-[#8C9BAD] space-y-1.5">
                <div className="flex items-center gap-2 text-[#00D9FF] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                  <span>CORS و امنیت هدلس پیش‌تنظیم شده است</span>
                </div>
                <p className="leading-relaxed">
                  پوسته اختصاصی ویسپار هدرهای استاندارد <code className="text-white font-mono">Access-Control-Allow-Origin: *</code> را به صورت خودکار به تمام ریکوئست‌های REST API تزریق می‌کند. بنابراین نیازی به نصب هیچ افزونه جانبی CORS در وردپرس نخواهید داشت.
                </p>
              </div>
            </div>

            {/* Right Col: Diagnostics Card */}
            <div className="lg:col-span-5 bg-[#06111F] border border-[#172638] rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#172638]">
                  <h3 className="text-base font-bold text-[#F5F8FC] flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#00D9FF]" />
                    <span>گزارش زنده سلامت اندپوینت وردپرس</span>
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                      status === 'connected'
                        ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30'
                        : status === 'connecting'
                        ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30'
                        : 'bg-[#536174]/15 text-[#8C9BAD] border border-[#536174]/30'
                    }`}
                  >
                    {status === 'connected' ? 'آنلاین و فعال' : status === 'connecting' ? 'در حال پینگ...' : 'حالت آفلاین / Fallback'}
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#03070D] border border-[#172638]">
                    <span className="text-[#8C9BAD]">سرعت پاسخگویی (Latency):</span>
                    <span className="font-mono text-[#00D9FF] font-bold">
                      {latency !== null ? `${latency} میلی‌ثانیه` : 'نامشخص'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#03070D] border border-[#172638]">
                    <span className="text-[#8C9BAD]">نسخه وردپرس:</span>
                    <span className="font-mono text-white">
                      {diagnostic?.wpVersion || 'WordPress Core'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#03070D] border border-[#172638]">
                    <span className="text-[#8C9BAD]">عنوان سایت در وردپرس:</span>
                    <span className="text-white font-medium">
                      {diagnostic?.siteName || 'سایت وردپرسی ویسپار'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#03070D] border border-[#172638]">
                    <span className="text-[#8C9BAD]">وضعیت موتور هدلس:</span>
                    <span className="text-[#22C55E] font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      {diagnostic?.isWispaarEngine ? 'پوسته ویسپار فعال است' : 'هسته استاندارد REST'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#03070D] border border-[#172638]">
                    <span className="text-[#8C9BAD]">آخرین زمان سینک موفق:</span>
                    <span className="font-mono text-[#8C9BAD]">
                      {lastSynced ? `ساعت ${lastSynced}` : 'اولیه'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instant Health Stats / Counts */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                <div className="p-3 bg-[#0A1626] border border-[#172638] rounded-xl">
                  <div className="font-mono text-lg font-bold text-[#00D9FF]">{allProjects.length}</div>
                  <div className="text-[10px] text-[#8C9BAD] mt-0.5">پروژه‌ها</div>
                </div>
                <div className="p-3 bg-[#0A1626] border border-[#172638] rounded-xl">
                  <div className="font-mono text-lg font-bold text-[#22C55E]">{leads.length}</div>
                  <div className="text-[10px] text-[#8C9BAD] mt-0.5">بریف‌ها</div>
                </div>
                <div className="p-3 bg-[#0A1626] border border-[#172638] rounded-xl">
                  <div className="font-mono text-lg font-bold text-[#F59E0B]">۴</div>
                  <div className="text-[10px] text-[#8C9BAD] mt-0.5">مقالات</div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Row: Two-Way Sync Operations */}
          <div className="bg-[#06111F] border border-[#172638] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="badge-code mb-1">&lt;TWO-WAY DATABASE SYNCHRONIZATION&gt;</span>
                <h3 className="text-lg sm:text-xl font-bold text-[#F5F8FC]">
                  ابزارهای تزریق و تبادل داده با دیتابیس وردپرس
                </h3>
                <p className="text-xs text-[#8C9BAD] mt-1">
                  با این دکمه‌ها می‌توانید دیتابیس یک وردپرس خام را بلافاصله پر از داده‌های واقعی کنید یا جریان بریف را آزمایش فرمایید:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tool 1: Seed WP */}
              <div className="p-5 bg-[#0A1626] border border-[#172638] rounded-xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-[#1769FF]/10 text-[#1769FF] flex items-center justify-center mb-3">
                    <Database className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-[#F5F8FC]">۱. درون‌ریزی خودکار در وردپرس</h4>
                  <p className="text-xs text-[#8C9BAD] mt-1 leading-relaxed">
                    ایجاد خودکار ۴ پروژه پرچمدار، دسته‌بندی‌ها و مقالات در دیتابیس وردپرس از طریق اندپوینت <code className="text-[#00D9FF] font-mono">/seed</code>.
                  </p>
                </div>
                <button
                  onClick={handleSeedDatabase}
                  disabled={isSeeding}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] disabled:opacity-50 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>{isSeeding ? 'در حال تزریق داده...' : 'تزریق آنی داده به دیتابیس وردپرس'}</span>
                </button>
              </div>

              {/* Tool 2: Push Test Brief */}
              <div className="p-5 bg-[#0A1626] border border-[#172638] rounded-xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-[#22C55E]/10 text-[#22C55E] flex items-center justify-center mb-3">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-[#F5F8FC]">۲. ارسال بریف تستی به پیشخوان</h4>
                  <p className="text-xs text-[#8C9BAD] mt-1 leading-relaxed">
                    ارسال یک درخواست آزمایشی به <code className="text-[#00D9FF] font-mono">/brief</code> و اطمینان از ثبت در منوی لیدهای وردپرس و ارسال ایمیل مدیر.
                  </p>
                </div>
                <button
                  onClick={handleTestBriefPush}
                  disabled={isTestingBrief}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-[#22C55E] hover:bg-[#1da850] disabled:opacity-50 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{isTestingBrief ? 'در حال ارسال...' : 'ارسال بریف تستی'}</span>
                </button>
              </div>

              {/* Tool 3: Create Project Modal Trigger */}
              <div className="p-5 bg-[#0A1626] border border-[#172638] rounded-xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center mb-3">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-[#F5F8FC]">۳. انتشار پروژه تازه</h4>
                  <p className="text-xs text-[#8C9BAD] mt-1 leading-relaxed">
                    فرم افزودن نمونه‌کار جدید با شاخص لایت‌هاوس، چالش و راهکار که همزمان در وردپرس و فرانت‌اند منتشر می‌شود.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProjectModal(true)}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-[#6366F1] hover:bg-[#5254db] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>افزودن نمونه‌کار جدید</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Headless REST API Endpoints Cheat Sheet */}
          <div className="bg-[#06111F] border border-[#172638] rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#00D9FF] mb-1">
                <span>&lt;REST API SPECIFICATION&gt;</span>
                <span>·</span>
                <span>فهرست کامل اندپوینت‌های اختصاصی تم</span>
              </div>
              <h3 className="text-lg font-bold text-[#F5F8FC]">
                مستندات فنی اندپوینت‌های REST API هدلس ویسپار
              </h3>
              <p className="text-xs text-[#8C9BAD] mt-1">
                می‌توانید این اندپوینت‌ها را با Postman، cURL یا Fetch در هر زبانی فراخوانی کنید:
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  method: 'GET',
                  route: '/wp-json/wispaar/v1/health',
                  desc: 'بررسی زنده بودن سرور، وضعیت CORS، نسخه وردپرس و شمارش محتوا',
                  curl: `curl -X GET "${endpoint || 'https://wispaar.ir'}/wp-json/wispaar/v1/health"`,
                },
                {
                  method: 'GET',
                  route: '/wp-json/wispaar/v1/projects',
                  desc: 'دریافت تمام نمونه‌کارها با تمام متادیتا (شاخص‌ها، فناوری‌ها، چالش، راهکار)',
                  curl: `curl -X GET "${endpoint || 'https://wispaar.ir'}/wp-json/wispaar/v1/projects"`,
                },
                {
                  method: 'POST',
                  route: '/wp-json/wispaar/v1/projects',
                  desc: 'ایجاد پروژه تازه در دیتابیس وردپرس CPT مستقیماً از فرانت‌اند',
                  curl: `curl -X POST "${endpoint || 'https://wispaar.ir'}/wp-json/wispaar/v1/projects" -H "Content-Type: application/json" -d '{"title":"پروژه جدید","industry":"فین‌تک"}'`,
                },
                {
                  method: 'GET',
                  route: '/wp-json/wispaar/v1/articles',
                  desc: 'دریافت مقالات ژورنال و وبلاگ با زمان تقریبی مطالعه و نام نویسنده',
                  curl: `curl -X GET "${endpoint || 'https://wispaar.ir'}/wp-json/wispaar/v1/articles"`,
                },
                {
                  method: 'POST',
                  route: '/wp-json/wispaar/v1/brief',
                  desc: 'ثبت بریف دریافتی در پست تایپ اختصاصی wispaar_brief همراه با اعلان ایمیل به مدیر',
                  curl: `curl -X POST "${endpoint || 'https://wispaar.ir'}/wp-json/wispaar/v1/brief" -H "Content-Type: application/json" -d '{"name":"علی","phone":"09121111111"}'`,
                },
                {
                  method: 'POST',
                  route: '/wp-json/wispaar/v1/seed',
                  desc: 'درون‌ریزی ۱ کلیک تمام پروژه‌های دمو در دیتابیس وردپرس',
                  curl: `curl -X POST "${endpoint || 'https://wispaar.ir'}/wp-json/wispaar/v1/seed"`,
                },
              ].map((ep) => (
                <div
                  key={ep.route + ep.method}
                  className="p-4 bg-[#03070D] border border-[#172638] rounded-xl space-y-2 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          ep.method === 'GET'
                            ? 'bg-[#1769FF]/20 text-[#00D9FF] border border-[#1769FF]/40'
                            : 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <code className="font-mono text-white text-xs" dir="ltr">
                        {ep.route}
                      </code>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopySnippet(ep.curl, ep.route)}
                      className="px-2.5 py-1 rounded bg-[#0A1626] hover:bg-[#172638] text-[#8C9BAD] hover:text-[#00D9FF] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSnippet === ep.route ? (
                        <>
                          <Check className="w-3 h-3 text-[#22C55E]" />
                          <span className="text-[#22C55E]">کپی شد</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>کپی دستور cURL</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[#8C9BAD] leading-relaxed">{ep.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: DOWNLOAD & INSTRUCTIONS */}
      {activeTab === 'download' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#06111F] border border-[#172638] rounded-2xl p-8 space-y-6">
              <h2 className="text-xl font-bold text-[#F5F8FC] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                <span>ویژگی‌های کلیدی پکیج قالب و هسته وردپرس WISPAAR</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 bg-[#0A1626] border border-[#172638] rounded-xl space-y-1.5">
                  <strong className="text-[#00D9FF] block">۱. سازگاری ۱۰۰٪ با المنتور (Elementor):</strong>
                  <span className="text-[#8C9BAD]">
                    دارای ویجت‌های اختصاصی هیرو، نمایشگاه پروژه‌ها، کارت‌های خدمات و فرم بریف قابل درگ‌اند‌دراپ در ویرایشگر المنتور.
                  </span>
                </div>

                <div className="p-4 bg-[#0A1626] border border-[#172638] rounded-xl space-y-1.5">
                  <strong className="text-[#00D9FF] block">۲. پست تایپ اختصاصی پروژه‌ها (CPT):</strong>
                  <span className="text-[#8C9BAD]">
                    فیلدهای سفارشی متادیتا شامل نام انگلیسی، نام مشتری، سال، چالش، راهکار، شاخص‌های لایت‌هاوس و نرخ تبدیل.
                  </span>
                </div>

                <div className="p-4 bg-[#0A1626] border border-[#172638] rounded-xl space-y-1.5">
                  <strong className="text-[#00D9FF] block">۳. صندوق دریافت درخواست‌های پروژه (Leads CRM):</strong>
                  <span className="text-[#8C9BAD]">
                    هر بریف یا فرم مشاوره‌ای که توسط کاربران ارسال شود در منوی اختصاصی پیشخوان وردپرس ذخیره و اعلان ایمیل به مدیر ارسال می‌شود.
                  </span>
                </div>

                <div className="p-4 bg-[#0A1626] border border-[#172638] rounded-xl space-y-1.5">
                  <strong className="text-[#00D9FF] block">۴. هسته مدرن REST API با هدرهای CORS:</strong>
                  <span className="text-[#8C9BAD]">
                    آماده برای اتصال فوری به فرانت‌آند‌های مدرن React، Next.js یا Vue بدون نیاز به هیچ کانفیگ پیچیده در سرور.
                  </span>
                </div>
              </div>

              {/* Step by step install */}
              <div className="pt-4 border-t border-[#172638] space-y-4">
                <h3 className="text-base font-bold text-[#F5F8FC]">راهنمای گام‌به‌گام نصب در پیشخوان وردپرس:</h3>
                <ol className="space-y-3 text-xs sm:text-sm text-[#C5D0DD] list-decimal list-inside leading-relaxed">
                  <li>روی دکمه آبی‌رنگ «دانلود پکیج کامل قالب وردپرس» کلیک کنید تا فایل <code className="font-mono text-[#00D9FF]">wispaar-theme.zip</code> دانلود شود.</li>
                  <li>وارد پیشخوان وردپرس خود شوید (<code className="font-mono text-[#00D9FF]">wp-admin</code>).</li>
                  <li>از منوی کناری به مسیر <strong>نمایش (Appearance) → پوسته‌ها (Themes) → افزودن پوسته تازه → بارگذاری پوسته</strong> بروید.</li>
                  <li>فایل زیپ دانلودشده را انتخاب کرده و روی <strong>«هم‌اکنون نصب کن»</strong> و سپس <strong>«فعال‌سازی»</strong> کلیک نمایید.</li>
                  <li>بلافاصله منوهای <strong>«پروژه‌های ویسپار»</strong> و <strong>«درخواست‌های پروژه»</strong> در پیشخوان شما فعال خواهند شد!</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: Headless Plugin (Primary for wispaar.ir) */}
            <div className="bg-[#06111F] border-2 border-[#00D9FF]/40 rounded-2xl p-6 space-y-5 shadow-xl shadow-[#00D9FF]/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded">
                  ضروری برای پروداکشن
                </span>
                <span className="text-xs font-mono text-[#22C55E]">v2.1.0 Clean</span>
              </div>
              <h3 className="text-base font-bold text-[#F5F8FC]">افزونه وردپرس هدلس (حل خطای هدر)</h3>
              <p className="text-xs text-[#8C9BAD] leading-relaxed">
                این افزونه مسیرهای اختصاصی REST API را فعال و خطای <code className="text-[#EF4444] font-mono">Cannot modify header information</code> در سرور را به دلیل کدگذاری استاندارد UTF-8 بدون BOM کاملاً برطرف می‌کند.
              </p>

              <div className="space-y-2 text-xs font-mono bg-[#03070D] p-3 rounded-xl border border-[#172638]">
                <div className="text-[#8C9BAD]">مسیر در سرور cPanel:</div>
                <div className="text-[#00D9FF] text-[11px] break-all">
                  wp-content/plugins/wispaar-headless/headless.php
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleDownloadPluginZip}
                  disabled={downloadingPlugin}
                  className="w-full py-3 text-xs sm:text-sm font-semibold text-white bg-[#00D9FF] hover:bg-[#00c2e6] text-black disabled:opacity-50 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#00D9FF]/20"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadingPlugin ? 'در حال ایجاد فایل زیپ...' : 'دانلود زیپ افزونه (wispaar-headless.zip)'}</span>
                </button>

                <button
                  onClick={handleDownloadSinglePhp}
                  className="w-full py-2.5 text-xs font-medium text-[#00D9FF] hover:text-white bg-[#0A1626] border border-[#00D9FF]/30 hover:border-[#00D9FF] rounded-xl transition-colors text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileCode className="w-4 h-4" />
                  <span>دانلود فایل تکی headless.php (برای آپلود مستقیم)</span>
                </button>
              </div>
            </div>

            {/* Card 2: Monolithic Theme (Optional) */}
            <div className="bg-[#06111F] border border-[#172638] rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#8C9BAD] bg-[#0A1626] px-2 py-0.5 rounded">
                  اختیاری (قالب مستقل)
                </span>
                <span className="text-xs font-mono text-[#8C9BAD]">v1.0.2</span>
              </div>
              <h3 className="text-base font-bold text-[#F5F8FC]">پوسته کامل وردپرس ویسپار</h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-[#172638]">
                  <span className="text-[#8C9BAD]">تعداد فایل‌ها:</span>
                  <span className="font-mono text-[#00D9FF]">{wpThemeFiles.length} فایل</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#172638]">
                  <span className="text-[#8C9BAD]">نیازمندی:</span>
                  <span className="text-white">PHP 7.4+ / WordPress 5.8+</span>
                </div>
              </div>

              <button
                onClick={handleDownloadZip}
                disabled={downloading}
                className="w-full py-3 text-xs sm:text-sm font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] disabled:opacity-50 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#1769FF]/20"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'در حال ایجاد فایل زیپ...' : 'دانلود پوسته وردپرس (Theme Zip)'}</span>
              </button>

              <button
                onClick={() => setActiveTab('files')}
                className="w-full py-2.5 text-xs font-medium text-[#8C9BAD] hover:text-white bg-[#0A1626] border border-[#172638] rounded-xl transition-colors text-center"
              >
                مشاهده و مرور کدهای PHP قالب ←
              </button>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: LEADS INBOX */}
      {activeTab === 'leads' && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F5F8FC]">
                پیشخوان درخواست‌های پروژه و سرنخ‌ها (Leads Inbox)
              </h2>
              <p className="text-xs sm:text-sm text-[#8C9BAD] mt-1">
                این بریف‌ها از طریق فرم تعاملی فرانت‌اند ارسال و در دیتابیس ثبت شده‌اند:
              </p>
            </div>

            <button
              onClick={() => onNavigate('start-project')}
              className="px-4 py-2 text-xs font-medium text-white bg-[#1769FF] hover:bg-[#155bd8] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ارسال بریف جدید از صفحه فرم</span>
            </button>
          </div>

          {/* Leads Table */}
          <div className="bg-[#06111F] border border-[#172638] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#03070D] border-b border-[#172638] text-[#8C9BAD]">
                  <tr>
                    <th className="p-4 font-semibold">نام مشتری / برند</th>
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
                              className="p-1.5 rounded bg-[#0A1626] hover:bg-[#172638] text-[#00D9FF] transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              title="حذف"
                              className="p-1.5 rounded bg-[#0A1626] hover:bg-[#EF4444]/20 text-[#EF4444] transition-colors cursor-pointer"
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

          {/* Modal for Lead Details */}
          {selectedLead && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-[#06111F] border border-[#23364C] rounded-2xl w-full max-w-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#172638]">
                  <div>
                    <h3 className="text-lg font-bold text-[#F5F8FC]">جزئیات بریف پروژه: {selectedLead.name}</h3>
                    <span className="text-xs text-[#8C9BAD] font-mono">{selectedLead.createdAt}</span>
                  </div>
                  <button onClick={() => setSelectedLead(null)} className="text-[#8C9BAD] hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-[#0A1626] rounded-xl border border-[#172638] space-y-1">
                    <span className="text-[#8C9BAD] block">شماره تماس مشتری:</span>
                    <span className="font-mono text-[#00D9FF] text-sm font-bold" dir="ltr">{selectedLead.phone}</span>
                  </div>
                  <div className="p-3 bg-[#0A1626] rounded-xl border border-[#172638] space-y-1">
                    <span className="text-[#8C9BAD] block">پست الکترونیکی:</span>
                    <span className="font-mono text-white text-sm" dir="ltr">{selectedLead.email}</span>
                  </div>
                  <div className="p-3 bg-[#0A1626] rounded-xl border border-[#172638] space-y-1">
                    <span className="text-[#8C9BAD] block">بودجه سرمایه‌گذاری:</span>
                    <span className="text-white font-medium">{selectedLead.budget || 'توافقی'}</span>
                  </div>
                  <div className="p-3 bg-[#0A1626] rounded-xl border border-[#172638] space-y-1">
                    <span className="text-[#8C9BAD] block">زمان‌بندی تحویل:</span>
                    <span className="text-white font-medium">{selectedLead.timeline || 'استاندارد'}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <strong className="text-[#00D9FF] block">خدمات مورد نیاز:</strong>
                  <div className="flex flex-wrap gap-2">
                    {selectedLead.services.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-md bg-[#0A1626] border border-[#172638] text-white">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedLead.description && (
                  <div className="space-y-1 text-xs">
                    <strong className="text-[#00D9FF] block">چشم‌انداز و توضیحات کارفرما:</strong>
                    <p className="p-3 bg-[#0A1626] rounded-xl border border-[#172638] text-[#C5D0DD] leading-relaxed">
                      {selectedLead.description}
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-[#172638] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#8C9BAD]">تغییر وضعیت:</span>
                    <button
                      onClick={() => handleStatusChange(selectedLead.id, 'contacted')}
                      className="px-3 py-1 rounded bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/20"
                    >
                      جلسه هماهنگ شد ✓
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#1769FF] rounded-lg hover:bg-[#155bd8]"
                  >
                    بستن پنجره
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB 4: PROJECTS MANAGEMENT */}
      {activeTab === 'projects' && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#F5F8FC]">
                مدیریت پروژه‌ها و نمونه‌کارها (CPT: wispaar_project)
              </h2>
              <p className="text-xs sm:text-sm text-[#8C9BAD] mt-1">
                این پروژه‌ها مستقیماً در دیتابیس وردپرس و نمایشگاه کارهای فرانت‌اند ذخیره شده‌اند:
              </p>
            </div>

            <button
              onClick={() => setShowAddProjectModal(true)}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-[#1769FF] hover:bg-[#155bd8] rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-[#1769FF]/20"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن نمونه‌کار جدید به سایت</span>
            </button>
          </div>

          {/* Projects Table */}
          <div className="bg-[#06111F] border border-[#172638] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#03070D] border-b border-[#172638] text-[#8C9BAD]">
                  <tr>
                    <th className="p-4 font-semibold">عنوان پروژه</th>
                    <th className="p-4 font-semibold">کارفرما</th>
                    <th className="p-4 font-semibold">صنعت</th>
                    <th className="p-4 font-semibold">سال</th>
                    <th className="p-4 font-semibold">شاخص ۱</th>
                    <th className="p-4 font-semibold">شاخص ۲</th>
                    <th className="p-4 font-semibold">نوع</th>
                    <th className="p-4 font-semibold text-center">مشاهده</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#172638]">
                  {allProjects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-[#0A1626]/60 transition-colors">
                      <td className="p-4 font-bold text-[#F5F8FC] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{proj.title}</span>
                          <span className="text-[10px] text-[#536174] font-mono" dir="ltr">({proj.titleEn})</span>
                        </div>
                      </td>
                      <td className="p-4 text-[#C5D0DD] whitespace-nowrap">{proj.client}</td>
                      <td className="p-4 text-[#8C9BAD] whitespace-nowrap">{proj.industry}</td>
                      <td className="p-4 text-[#8C9BAD] font-mono whitespace-nowrap">{proj.year}</td>
                      <td className="p-4 font-mono text-[#00D9FF] whitespace-nowrap">
                        {proj.results[0]?.value} <span className="text-[10px] text-[#536174] font-sans">({proj.results[0]?.label})</span>
                      </td>
                      <td className="p-4 font-mono text-[#22C55E] whitespace-nowrap">
                        {proj.results[1]?.value}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {proj.isDemo ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0A1626] border border-[#23364C] text-[#00D9FF]">
                            CONCEPT / DEMO
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]">
                            LIVE
                          </span>
                        )}
                      </td>
                      <td className="p-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => onNavigate('project-detail', proj.slug)}
                          className="p-1.5 rounded bg-[#0A1626] hover:bg-[#1769FF]/20 text-[#00D9FF] transition-colors cursor-pointer"
                          title="مشاهده صفحه اختصاصی اثر"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
