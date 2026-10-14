import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
} from '../utils/wordpressStore';
import {
  checkWordPressHealth,
  fetchWordPressProjects,
  fetchWordPressArticles,
  fetchWordPressLeads,
  createWordPressProject,
  submitWordPressBrief,
  seedWordPressDatabase,
  HealthCheckResult,
} from '../services/headlessApi';

export type HeadlessStatus = 'connected' | 'connecting' | 'offline' | 'fallback';

interface HeadlessContextType {
  endpoint: string;
  setEndpoint: (url: string) => void;
  status: HeadlessStatus;
  latency: number | null;
  wpHealth: HealthCheckResult | null;
  projects: Project[];
  articles: Article[];
  leads: WordPressLead[];
  lastSynced: string | null;
  isSyncing: boolean;
  syncFromWordPress: () => Promise<boolean>;
  createProject: (projectData: any) => Promise<{ success: boolean; message: string }>;
  submitBrief: (briefData: any) => Promise<{ success: boolean; message: string }>;
  seedDatabase: () => Promise<{ success: boolean; message: string }>;
  updateLeadStatus: (id: string, status: 'new' | 'reviewed' | 'contacted') => void;
  deleteLead: (id: string) => void;
}

const HeadlessContext = createContext<HeadlessContextType | undefined>(undefined);

export const HeadlessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [endpoint, setEndpointState] = useState<string>(() => {
    return getWordPressEndpoint() || 'http://demo.local';
  });

  const [status, setStatus] = useState<HeadlessStatus>('fallback');
  const [latency, setLatency] = useState<number | null>(null);
  const [wpHealth, setWpHealth] = useState<HealthCheckResult | null>(null);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Data states
  const [projects, setProjects] = useState<Project[]>(() => {
    const custom = getCustomProjects();
    return [...custom, ...projectsData];
  });

  const [articles, setArticles] = useState<Article[]>(articlesData);
  const [leads, setLeads] = useState<WordPressLead[]>(() => getStoredLeads());

  const setEndpoint = (newUrl: string) => {
    setEndpointState(newUrl);
    setWordPressEndpoint(newUrl);
  };

  // Perform a full sync from WordPress
  const syncFromWordPress = useCallback(async (): Promise<boolean> => {
    if (!endpoint) {
      setStatus('fallback');
      return false;
    }

    setIsSyncing(true);
    setStatus('connecting');

    try {
      const health = await checkWordPressHealth(endpoint);
      setWpHealth(health);
      setLatency(health.latency);

      if (health.ok) {
        setStatus('connected');

        // Fetch live projects
        const remoteProjects = await fetchWordPressProjects(endpoint);
        if (remoteProjects && remoteProjects.length > 0) {
          // Merge remote projects with local custom projects
          const custom = getCustomProjects();
          const mergedSlugs = new Set(remoteProjects.map((p) => p.slug));
          const nonDuplicateCustom = custom.filter((p) => !mergedSlugs.has(p.slug));
          setProjects([...remoteProjects, ...nonDuplicateCustom]);
        }

        // Fetch live articles
        const remoteArticles = await fetchWordPressArticles(endpoint);
        if (remoteArticles && remoteArticles.length > 0) {
          setArticles(remoteArticles);
        }

        // Fetch live leads
        const remoteLeads = await fetchWordPressLeads(endpoint);
        if (remoteLeads && remoteLeads.length > 0) {
          setLeads(remoteLeads);
        }

        const now = new Date();
        setLastSynced(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
        setIsSyncing(false);
        return true;
      } else {
        setStatus('offline');
        setIsSyncing(false);
        return false;
      }
    } catch (e) {
      console.warn('Sync failed, running in fallback mode', e);
      setStatus('offline');
      setIsSyncing(false);
      return false;
    }
  }, [endpoint]);

  // Initial check on mount
  useEffect(() => {
    syncFromWordPress();
  }, [syncFromWordPress]);

  // Create project both remotely (if connected) and locally
  const createProject = async (projectData: any): Promise<{ success: boolean; message: string }> => {
    const slug = 'project-' + Date.now();
    const localProject: Project = {
      id: slug,
      slug: slug,
      title: projectData.title,
      titleEn: projectData.titleEn || projectData.title,
      client: projectData.client || 'سفارشی ویسپار',
      industry: projectData.industry || 'فین‌تک و خدمات مالی',
      services: ['طراحی اختصاصی UI/UX', 'توسعه وردپرس مهندسی‌شده'],
      technology: ['WordPress Headless', 'Tailwind', 'ACF Pro'],
      year: projectData.year || '۱۴۰۴',
      projectType: projectData.projectType || 'وب‌سایت اختصاصی',
      coverImage: '/images/fintech.jpg',
      isDemo: Boolean(projectData.isDemo),
      editorialQuote: '«آفریده‌شده با تلفیق خرد و فناوری در استودیو ویسپار.»',
      challenge: projectData.challenge || 'طراحی و توسعه ساختار مقیاس‌پذیر برای نیازهای کسب‌وکار.',
      solution: projectData.solution || 'پیاده‌سازی دیزاین سیستم مینیمال و بهینه‌سازی حداکثری سرعت.',
      results: [
        { label: projectData.kpi1Label || 'شاخص لایت‌هاوس', value: projectData.kpi1Value || '۹۹/۱۰۰', detail: 'شاخص عملکرد' },
        { label: projectData.kpi2Label || 'نرخ تبدیل', value: projectData.kpi2Value || '+۷۵٪', detail: 'شاخص رشد' },
      ],
      websiteUrlPlaceholder: 'https://demo.wispaar.com',
      tags: [projectData.industry || 'سفارشی', 'وردپرس هدلس'],
    };

    // Save to local storage first
    saveLocalCustomProject(localProject);
    setProjects((prev) => [localProject, ...prev]);

    // If connected to remote WordPress, push via REST API
    if (status === 'connected' && endpoint) {
      try {
        const res = await createWordPressProject(endpoint, projectData);
        if (res.success && res.project) {
          // Re-sync to reflect exact WP ID and meta
          syncFromWordPress();
          return { success: true, message: 'پروژه هم در کدهای فرانت‌اند و هم در دیتابیس وردپرس هدلس ثبت گردید.' };
        }
      } catch (e) {
        // Return local success even if remote fail
      }
    }

    return { success: true, message: 'پروژه در سیستم ذخیره گردید و آماده همگام‌سازی با وردپرس است.' };
  };

  // Submit project brief
  const submitBrief = async (briefData: any): Promise<{ success: boolean; message: string }> => {
    // Save to local leads
    const createdLocal = saveLocalLead(briefData);
    setLeads((prev) => [createdLocal, ...prev]);

    if (endpoint) {
      try {
        const res = await submitWordPressBrief(endpoint, briefData);
        if (res.success) {
          return { success: true, message: 'درخواست شما مستقیماً در دیتابیس وردپرس (Cypress/Leads) ثبت شد.' };
        }
      } catch (e) {
        // ignore
      }
    }

    return { success: true, message: 'درخواست شما در حافظه سیستم ثبت شد و در اتصال بعدی با وردپرس سینک خواهد شد.' };
  };

  // Seed remote WordPress database
  const seedDatabase = async (): Promise<{ success: boolean; message: string }> => {
    if (!endpoint) {
      return { success: false, message: 'ابتدا آدرس سایت وردپرس را مشخص فرمایید.' };
    }

    setIsSyncing(true);
    const res = await seedWordPressDatabase(endpoint);
    if (res.success) {
      await syncFromWordPress();
    }
    setIsSyncing(false);
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
        status,
        latency,
        wpHealth,
        projects,
        articles,
        leads,
        lastSynced,
        isSyncing,
        syncFromWordPress,
        createProject,
        submitBrief,
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
