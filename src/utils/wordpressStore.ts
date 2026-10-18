import { Project } from '../types';

export interface WordPressLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  services: string[];
  goals: string[];
  platform: string;
  website: string;
  budget: string;
  timeline: string;
  description: string;
  status: 'new' | 'reviewed' | 'contacted';
  createdAt: string;
}

const LEADS_STORAGE_KEY = 'wispaar_wp_leads';
const PROJECTS_STORAGE_KEY = 'wispaar_wp_projects';
const WP_ENDPOINT_KEY = 'wispaar_wp_endpoint';
const WP_AUTH_KEY = 'wispaar_wp_auth_header';

/**
 * Returns saved leads from local storage for offline fallback
 */
export function getStoredLeads(): WordPressLead[] {
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading stored leads', e);
  }
  return [
    {
      id: 'lead-1',
      name: 'مهندس حسینی (گروه پارس اطلس)',
      phone: '09123456789',
      email: 'hoseini@parsatlas.ir',
      services: ['طراحی و توسعه وب‌سایت اختصاصی', 'سئو تکنیکال و معماری کلمات'],
      goals: ['ساخت هویت و اعتبار متمایز برند', 'افزایش ترافیک ارگانیک از موتورهای جستجو'],
      platform: 'سایت وردپرسی موجود',
      website: 'https://parsatlas.ir',
      budget: 'پروژه جامع شرکتی / پورتال اختصاصی استاندارد',
      timeline: 'استاندارد (طی ۱ الی ۲ ماه)',
      description: 'نیاز به بازطراحی کامل سایت شرکتی و بهینه‌سازی سرعت وردپرس داریم.',
      status: 'new',
      createdAt: 'امروز، ساعت ۱۰:۳۰',
    },
    {
      id: 'lead-2',
      name: 'دکتر ستوده (کلینیک هوشمند)',
      phone: '09129876543',
      email: 'sotoodeh@clinic.com',
      services: ['طراحی لندینگ پیج و افزایش نرخ تبدیل', 'بهینه‌سازی سرعت و پرفورمنس Core Web Vitals'],
      goals: ['افزایش نرخ تبدیل سرنخ و فروش آنلاین'],
      platform: 'پروژه جدید (از ابتدا)',
      website: '',
      budget: 'پروژه متمرکز (شروع مناسب برای لندینگ یا بهینه‌سازی فنی)',
      timeline: 'فوری (طی ۲ الی ۳ هفته)',
      description: 'کمپین تبلیغاتی داریم و نیاز به یک لندینگ پیج اختصاصی فوق سریع با فرم نوبت‌دهی داریم.',
      status: 'contacted',
      createdAt: 'دیروز، ساعت ۱۶:۱۵',
    },
  ];
}

/**
 * Saves a lead into local storage for offline availability
 */
export function saveLead(lead: Omit<WordPressLead, 'id' | 'createdAt' | 'status'>): WordPressLead {
  const current = getStoredLeads();
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const dateStr = 'امروز، ساعت ' + timeStr;

  const newLead: WordPressLead = {
    ...lead,
    id: 'lead-' + Date.now(),
    status: 'new',
    createdAt: dateStr,
  };

  const updated = [newLead, ...current];
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving lead locally', e);
  }

  return newLead;
}

export function updateLeadStatus(id: string, status: 'new' | 'reviewed' | 'contacted'): WordPressLead[] {
  const current = getStoredLeads();
  const updated = current.map((l) => (l.id === id ? { ...l, status } : l));
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error updating lead status', e);
  }
  return updated;
}

export function deleteLead(id: string): WordPressLead[] {
  const current = getStoredLeads();
  const updated = current.filter((l) => l.id !== id);
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting lead', e);
  }
  return updated;
}

export function getCustomProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading custom projects', e);
  }
  return [];
}

export function saveCustomProject(project: Project): void {
  const current = getCustomProjects();
  const updated = [project, ...current];
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving custom project', e);
  }
}

/**
 * Predictable endpoint precedence:
 * 1. Explicit user override in localStorage
 * 2. Environment configuration (import.meta.env.VITE_WP_API_URL)
 * 3. Verified same-origin production configuration (when running on wispaar.ir)
 * 4. Canonical production base URL fallback (https://wispaar.ir)
 */
export function getWordPressEndpoint(): string {
  try {
    const userOverride = localStorage.getItem(WP_ENDPOINT_KEY);
    if (userOverride && userOverride.trim() !== '') {
      return userOverride.trim();
    }
  } catch {
    // Local storage unavailable
  }

  // Check Vite environment variable
  const envUrl = (import.meta as any).env?.VITE_WP_API_URL;
  if (typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim();
  }

  // Verified same-origin check for browser execution on target domain
  if (typeof window !== 'undefined' && window.location?.origin) {
    const origin = window.location.origin;
    if (origin.includes('wispaar.ir')) {
      return origin;
    }
  }

  // Canonical production endpoint
  return 'https://wispaar.ir';
}

export function setWordPressEndpoint(url: string): void {
  try {
    if (!url || url.trim() === '') {
      localStorage.removeItem(WP_ENDPOINT_KEY);
    } else {
      localStorage.setItem(WP_ENDPOINT_KEY, url.trim());
    }
  } catch (e) {
    console.error('Error saving WP endpoint', e);
  }
}

/**
 * Optional WordPress Auth Header (e.g. Basic Auth for Application Passwords)
 */
export function getWordPressAuthHeader(): string {
  try {
    return localStorage.getItem(WP_AUTH_KEY) || '';
  } catch {
    return '';
  }
}

export function setWordPressAuthHeader(header: string): void {
  try {
    if (!header || header.trim() === '') {
      localStorage.removeItem(WP_AUTH_KEY);
    } else {
      localStorage.setItem(WP_AUTH_KEY, header.trim());
    }
  } catch {
    // ignore
  }
}
