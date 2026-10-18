import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Project, Article } from '../types';
import { projectsData } from '../data/projectsData';
import { articlesData } from '../data/articlesData';
import {
  WordPressLead,
  getStoredLeads,
  saveLead as saveLocalLead,
  updateLeadStatus as updateLocalLeadStatus,
  deleteLead as deleteLocalLead,
  getCustomProjects,
  saveCustomProject as saveLocalCustomProject,
  getWordPressEndpoint,
  setWordPressEndpoint,
  getWordPressAuthHeader,
  setWordPressAuthHeader,
} from '../utils/wordpressStore';
import {
  runFullDiagnostic,
  fetchWordPressProjects,
  fetchWordPressArticles,
  fetchWordPressLeads,
  createWordPressProject,
  submitWordPressBrief,
  submitWordPressContact,
  seedWordPressDatabase,
  discoverReachableEndpoint,
  KNOWN_CANDIDATE_ENDPOINTS,
} from '../services/headlessApi';
import {
  ConnectionState,
  ConnectionFailureCategory,
  DiagnosticResult,
  EndpointCapabilities,
  WPProjectCreatePayload,
  WPBriefPayload,
  WPContactPayload,
} from '../types/wordpress';

interface HeadlessContextType {
  endpoint: string;
  setEndpoint: (url: string) => void;
  authHeader: string;
  setAuthHeader: (header: string) => void;
  status: ConnectionState;
  failureCategory: ConnectionFailureCategory;
  diagnostic: DiagnosticResult | null;
  latency: number | null;
  projects: Project[];
  articles: Article[];
  leads: WordPressLead[];
  totalProjects: number;
  totalArticles: number;
  isEmptyProjects: boolean;
  isEmptyArticles: boolean;
  lastSynced: string | null;
  isSyncing: boolean;
  capabilities: EndpointCapabilities;
  syncFromWordPress: (targetUrl?: string) => Promise<boolean>;
  runCandidateDiscovery: () => Promise<DiagnosticResult | null>;
  createProject: (projectData: WPProjectCreatePayload) => Promise<{ success: boolean; message: string }>;
  submitBrief: (briefData: WPBriefPayload) => Promise<{ success: boolean; message: string; pendingLocal?: boolean }>;
  submitContact: (contactData: WPContactPayload) => Promise<{ success: boolean; message: string }>;
  seedDatabase: () => Promise<{ success: boolean; message: string }>;
  updateLeadStatus: (id: string, status: 'new' | 'reviewed' | 'contacted') => void;
  deleteLead: (id: string) => void;
}

const defaultCapabilities: EndpointCapabilities = {
  wpRestRootReachable: false,
  wispaarNamespaceReachable: false,
  readProjectsAvailable: false,
  readArticlesAvailable: false,
  submitBriefAvailable: true,
  writeProjectsAuthorized: false,
  readLeadsAuthorized: false,
  seedDatabaseAuthorized: false,
};

const HeadlessContext = createContext<HeadlessContextType | undefined>(undefined);

export const HeadlessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial endpoint following strict precedence:
  // (1) LocalStorage user override, (2) VITE_WP_API_URL, (3) Same-origin, (4) Canonical 'https://wispaar.ir'
  const [endpoint, setEndpointState] = useState<string>(() => {
    return getWordPressEndpoint();
  });

  const [authHeader, setAuthHeaderState] = useState<string>(() => getWordPressAuthHeader());
  const [status, setStatus] = useState<ConnectionState>('unconfigured');
  const [failureCategory, setFailureCategory] = useState<ConnectionFailureCategory>('none');
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [capabilities, setCapabilities] = useState<EndpointCapabilities>(defaultCapabilities);

  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isEmptyProjects, setIsEmptyProjects] = useState<boolean>(false);
  const [isEmptyArticles, setIsEmptyArticles] = useState<boolean>(false);

  // Content state (initialized with offline fallbacks so the app renders immediately)
  const [projects, setProjects] = useState<Project[]>(() => {
    const custom = getCustomProjects();
    return [...custom, ...projectsData];
  });
  const [totalProjects, setTotalProjects] = useState<number>(() => projectsData.length);

  const [articles, setArticles] = useState<Article[]>(articlesData);
  const [totalArticles, setTotalArticles] = useState<number>(() => articlesData.length);

  const [leads, setLeads] = useState<WordPressLead[]>(() => getStoredLeads());

  // Ref to guard against overlapping sync runs
  const activeSyncRef = useRef<boolean>(false);

  const setEndpoint = (newUrl: string) => {
    setEndpointState(newUrl);
    setWordPressEndpoint(newUrl);
  };

  const setAuthHeader = (newHeader: string) => {
    setAuthHeaderState(newHeader);
    setWordPressAuthHeader(newHeader);
  };

  /**
   * Sync from WordPress: runs diagnostic first, then loads live CMS collections
   */
  const syncFromWordPress = useCallback(
    async (targetUrlOverride?: string): Promise<boolean> => {
      const targetUrl = targetUrlOverride !== undefined ? targetUrlOverride : endpoint;

      if (!targetUrl || targetUrl.trim() === '') {
        setStatus('unconfigured');
        setFailureCategory('none');
        setDiagnostic(null);
        return false;
      }

      if (activeSyncRef.current) {
        return false;
      }

      activeSyncRef.current = true;
      setIsSyncing(true);
      setStatus('connecting');

      try {
        const diag = await runFullDiagnostic(targetUrl);
        setDiagnostic(diag);
        setStatus(diag.state);
        setFailureCategory(diag.failureCategory);
        setLatency(diag.latencyMs);
        setCapabilities(diag.capabilities);

        if (diag.state === 'connected' || diag.state === 'partially_connected') {
          // Fetch live projects
          const projectsResult = await fetchWordPressProjects(targetUrl, {
            authHeader: authHeader || undefined,
          });

          if (projectsResult) {
            if (projectsResult.projects.length > 0) {
              const custom = getCustomProjects();
              const liveSlugs = new Set(projectsResult.projects.map((p) => p.slug));
              const preservedCustom = custom.filter((p) => !liveSlugs.has(p.slug));
              setProjects([...projectsResult.projects, ...preservedCustom]);
              setTotalProjects(projectsResult.total);
              setIsEmptyProjects(false);
            } else {
              // Verified empty collection on WordPress backend
              setTotalProjects(0);
              setIsEmptyProjects(true);
            }
          }

          // Fetch live articles
          const articlesResult = await fetchWordPressArticles(targetUrl);
          if (articlesResult) {
            if (articlesResult.articles.length > 0) {
              setArticles(articlesResult.articles);
              setTotalArticles(articlesResult.total);
              setIsEmptyArticles(false);
            } else {
              setTotalArticles(0);
              setIsEmptyArticles(true);
            }
          }

          // Fetch live leads if authorized
          if (authHeader) {
            const leadsResult = await fetchWordPressLeads(targetUrl, authHeader);
            if (leadsResult && leadsResult.authorized && leadsResult.leads.length > 0) {
              setLeads(leadsResult.leads);
            }
          }

          const now = new Date();
          const timeFormatted = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
          setLastSynced(timeFormatted);
          setIsSyncing(false);
          activeSyncRef.current = false;
          return true;
        }

        setIsSyncing(false);
        activeSyncRef.current = false;
        return false;
      } catch (err) {
        console.warn('[Wispaar Headless] Sync exception:', err);
        setStatus('disconnected');
        setFailureCategory('inaccessible_host');
        setIsSyncing(false);
        activeSyncRef.current = false;
        return false;
      }
    },
    [endpoint, authHeader]
  );

  /**
   * Run controlled candidate discovery
   */
  const runCandidateDiscovery = useCallback(async (): Promise<DiagnosticResult | null> => {
    setIsSyncing(true);
    setStatus('connecting');
    const result = await discoverReachableEndpoint(KNOWN_CANDIDATE_ENDPOINTS);
    setIsSyncing(false);

    if (result) {
      setEndpoint(result.endpoint);
      setDiagnostic(result);
      setStatus(result.state);
      setFailureCategory(result.failureCategory);
      setLatency(result.latencyMs);
      setCapabilities(result.capabilities);
      // Run sync on discovered endpoint
      await syncFromWordPress(result.endpoint);
      return result;
    }

    setStatus('disconnected');
    setFailureCategory('inaccessible_host');
    return null;
  }, [setEndpoint, syncFromWordPress]);

  // Initial sync on mount (only once, non-repeating)
  useEffect(() => {
    let cancelled = false;
    if (endpoint && !cancelled) {
      syncFromWordPress();
    }
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Create a project
   */
  const createProject = async (
    projectData: WPProjectCreatePayload
  ): Promise<{ success: boolean; message: string }> => {
    // 1. If connected to WordPress, send to API
    if (status === 'connected' && endpoint) {
      const res = await createWordPressProject(endpoint, projectData, authHeader || undefined);
      if (res.success && res.project) {
        setProjects((prev) => [res.project!, ...prev]);
        return { success: true, message: res.message };
      }
      if (!res.success && res.message.includes('Unauthorized')) {
        // Fallback to local save with clear note
        const slug = 'project-' + Date.now();
        const localProject: Project = {
          id: slug,
          slug: slug,
          title: projectData.title,
          titleEn: projectData.titleEn || projectData.title,
          client: projectData.client || 'سفارشی ویسپار',
          industry: projectData.industry || 'فین‌تک و خدمات مالی',
          services: projectData.services || ['طراحی اختصاصی UI/UX'],
          technology: projectData.technology || ['WordPress Headless'],
          year: projectData.year || '۱۴۰۴',
          projectType: projectData.projectType || 'وب‌سایت اختصاصی',
          coverImage: '/images/fintech.jpg',
          isDemo: Boolean(projectData.isDemo),
          editorialQuote: '«آفریده‌شده با تلفیق خرد و فناوری در استودیو ویسپار.»',
          challenge: projectData.challenge || 'طراحی و توسعه ساختار مقیاس‌پذیر برای نیازهای کسب‌وکار.',
          solution: projectData.solution || 'پیاده‌سازی دیزاین سیستم مینیمال و بهینه‌سازی سرعت.',
          results: [
            { label: projectData.kpi1Label || 'شاخص عملکرد لایت‌هاوس', value: projectData.kpi1Value || '۹۹/۱۰۰', detail: 'شاخص عملکرد' },
            { label: projectData.kpi2Label || 'نرخ تبدیل لندینگ', value: projectData.kpi2Value || '+۷۵٪', detail: 'شاخص رشد' },
          ],
          websiteUrlPlaceholder: 'https://demo.wispaar.com',
          tags: [projectData.industry || 'سفارشی', 'وردپرس هدلس'],
        };
        saveLocalCustomProject(localProject);
        setProjects((prev) => [localProject, ...prev]);
        return {
          success: true,
          message: 'به دلیل عدم ارسال Application Password، پروژه به صورت پیش‌نمایش در حافظه محلی ذخیره شد.',
        };
      }
      return { success: false, message: res.message };
    }

    // 2. Offline / local fallback save
    const slug = 'project-' + Date.now();
    const localProject: Project = {
      id: slug,
      slug: slug,
      title: projectData.title,
      titleEn: projectData.titleEn || projectData.title,
      client: projectData.client || 'سفارشی ویسپار',
      industry: projectData.industry || 'فین‌تک و خدمات مالی',
      services: projectData.services || ['طراحی اختصاصی UI/UX'],
      technology: projectData.technology || ['WordPress Headless'],
      year: projectData.year || '۱۴۰۴',
      projectType: projectData.projectType || 'وب‌سایت اختصاصی',
      coverImage: '/images/fintech.jpg',
      isDemo: Boolean(projectData.isDemo),
      editorialQuote: '«آفریده‌شده با تلفیق خرد و فناوری در استودیو ویسپار.»',
      challenge: projectData.challenge || 'طراحی و توسعه ساختار مقیاس‌پذیر.',
      solution: projectData.solution || 'پیاده‌سازی دیزاین سیستم مینیمال.',
      results: [
        { label: projectData.kpi1Label || 'شاخص عملکرد لایت‌هاوس', value: projectData.kpi1Value || '۹۹/۱۰۰', detail: 'شاخص عملکرد' },
        { label: projectData.kpi2Label || 'نرخ تبدیل لندینگ', value: projectData.kpi2Value || '+۷۵٪', detail: 'شاخص رشد' },
      ],
      websiteUrlPlaceholder: 'https://demo.wispaar.com',
      tags: [projectData.industry || 'سفارشی', 'وردپرس هدلس'],
    };
    saveLocalCustomProject(localProject);
    setProjects((prev) => [localProject, ...prev]);
    return { success: true, message: 'پروژه جدید با موفقیت در مخزن محلی ذخیره شد (حالت آفلاین).' };
  };

  /**
   * Submit client brief
   */
  const submitBrief = async (
    briefData: WPBriefPayload
  ): Promise<{ success: boolean; message: string; pendingLocal?: boolean }> => {
    // Save locally first for guaranteed recovery
    const localLead = saveLocalLead({
      name: briefData.name,
      phone: briefData.phone || '',
      email: briefData.email || '',
      services: briefData.services || [],
      goals: briefData.goals || [],
      platform: briefData.platform || '',
      website: briefData.website || '',
      budget: briefData.budget || '',
      timeline: briefData.timeline || '',
      description: briefData.description || '',
    });
    setLeads((prev) => [localLead, ...prev]);

    // Send to remote WordPress API
    if (endpoint) {
      try {
        const res = await submitWordPressBrief(endpoint, briefData);
        if (res.success) {
          return {
            success: true,
            message: res.message || 'بریف شما با موفقیت در پیشخوان وردپرس ثبت شد.',
          };
        } else {
          return {
            success: false,
            pendingLocal: true,
            message: res.message || 'خطا در ثبت بریف در سرور وردپرس. پیش‌نویس در مرورگر ذخیره شد.',
          };
        }
      } catch {
        return {
          success: false,
          pendingLocal: true,
          message: 'عدم پاسخگویی سرور وردپرس. اطلاعات شما در مرورگر ذخیره شد تا پس از آنلاین شدن ارسال گردد.',
        };
      }
    }

    return {
      success: false,
      pendingLocal: true,
      message: 'سرور وردپرس متصل نیست؛ اطلاعات در حافظه محلی ذخیره شد.',
    };
  };

  /**
   * Submit direct contact message to WordPress
   */
  const submitContact = async (
    contactData: WPContactPayload
  ): Promise<{ success: boolean; message: string }> => {
    if (endpoint) {
      try {
        const res = await submitWordPressContact(endpoint, contactData);
        return {
          success: res.success,
          message: res.message,
        };
      } catch (err: any) {
        return {
          success: false,
          message: 'خطا در ارتباط با سرور وردپرس: ' + (err?.message || 'عدم دسترسی'),
        };
      }
    }
    return {
      success: true,
      message: 'پیام شما دریافت شد.',
    };
  };

  /**
   * Database seeding
   */
  const seedDatabase = async (): Promise<{ success: boolean; message: string }> => {
    if (!endpoint) {
      return { success: false, message: 'آدرس سرور وردپرس مشخص نیست.' };
    }
    const res = await seedWordPressDatabase(endpoint, authHeader || undefined);
    if (res.success) {
      await syncFromWordPress();
    }
    return res;
  };

  const updateLeadStatus = (id: string, newStatus: 'new' | 'reviewed' | 'contacted') => {
    const updated = updateLocalLeadStatus(id, newStatus);
    setLeads(updated);
  };

  const deleteLead = (id: string) => {
    const updated = deleteLocalLead(id);
    setLeads(updated);
  };

  return (
    <HeadlessContext.Provider
      value={{
        endpoint,
        setEndpoint,
        authHeader,
        setAuthHeader,
        status,
        failureCategory,
        diagnostic,
        latency,
        projects,
        articles,
        leads,
        totalProjects,
        totalArticles,
        isEmptyProjects,
        isEmptyArticles,
        lastSynced,
        isSyncing,
        capabilities,
        syncFromWordPress,
        runCandidateDiscovery,
        createProject,
        submitBrief,
        submitContact,
        seedDatabase,
        updateLeadStatus,
        deleteLead,
      }}
    >
      {children}
    </HeadlessContext.Provider>
  );
};

export const useHeadless = (): HeadlessContextType => {
  const context = useContext(HeadlessContext);
  if (!context) {
    throw new Error('useHeadless must be used within a HeadlessProvider');
  }
  return context;
};
