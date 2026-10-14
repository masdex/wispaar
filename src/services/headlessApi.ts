/**
 * Headless WordPress API Client for WISPAAR
 * Handles decoupled communication between React frontend and WordPress REST API.
 */

import { Project, Article } from '../types';
import { WordPressLead } from '../utils/wordpressStore';

export interface HealthCheckResult {
  ok: boolean;
  latency: number;
  isWispaarEngine: boolean;
  version?: string;
  siteName?: string;
  siteUrl?: string;
  counts?: {
    projects: number;
    articles: number;
    leads: number;
  };
  error?: string;
}

export function normalizeEndpointUrl(url: string): string {
  if (!url) return '';
  let clean = url.trim();
  // Strip trailing slashes
  while (clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }
  // Ensure http:// or https://
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = 'http://' + clean;
  }
  return clean;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Diagnostic Health Check
 */
export async function checkWordPressHealth(endpoint: string): Promise<HealthCheckResult> {
  const cleanUrl = normalizeEndpointUrl(endpoint);
  if (!cleanUrl) {
    return {
      ok: false,
      latency: 0,
      isWispaarEngine: false,
      error: 'آدرس سرور وردپرس مشخص نشده است.',
    };
  }

  const startTime = performance.now();

  try {
    // 1. Try Wispaar dedicated health endpoint
    const response = await fetchWithTimeout(`${cleanUrl}/wp-json/wispaar/v1/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    }, 4500);

    const latency = Math.round(performance.now() - startTime);

    if (response.ok) {
      const data = await response.json();
      return {
        ok: true,
        latency,
        isWispaarEngine: true,
        version: data.wp_version || '6.x',
        siteName: data.site_name || 'سایت وردپرسی',
        siteUrl: data.site_url || cleanUrl,
        counts: data.counts || { projects: 0, articles: 0, leads: 0 },
      };
    }

    // 2. Fallback check for standard WordPress REST root
    const fallbackRes = await fetchWithTimeout(`${cleanUrl}/wp-json/`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    }, 3500);

    if (fallbackRes.ok) {
      const fallbackData = await fallbackRes.json();
      return {
        ok: true,
        latency: Math.round(performance.now() - startTime),
        isWispaarEngine: false,
        version: 'WordPress Core',
        siteName: fallbackData.name || 'وردپرس',
        siteUrl: fallbackData.url || cleanUrl,
        error: 'وردپرس فعال است، اما پوسته/اندپوینت‌های اختصاصی ویسپار روی آن فعال نشده است.',
      };
    }

    return {
      ok: false,
      latency,
      isWispaarEngine: false,
      error: `پاسخ ناموفق از سرور وردپرس (کد: ${response.status})`,
    };
  } catch (err: any) {
    const latency = Math.round(performance.now() - startTime);
    let msg = 'ارتباط با وردپرس برقرار نشد. اطمینان حاصل کنید سرور محلی (مانند LocalWP) روشن است و خطای CORS وجود ندارد.';
    if (err?.name === 'AbortError') {
      msg = 'زمان انتظار برای پاسخ وردپرس به پایان رسید (Timeout).';
    }
    return {
      ok: false,
      latency,
      isWispaarEngine: false,
      error: msg,
    };
  }
}

/**
 * Fetch Projects from WordPress CPT
 */
export async function fetchWordPressProjects(endpoint: string): Promise<Project[] | null> {
  const cleanUrl = normalizeEndpointUrl(endpoint);
  if (!cleanUrl) return null;

  try {
    const response = await fetchWithTimeout(`${cleanUrl}/wp-json/wispaar/v1/projects`, {
      headers: { Accept: 'application/json' },
    }, 5000);

    if (!response.ok) return null;

    const data = await response.json();
    if (data.success && Array.isArray(data.projects)) {
      return data.projects;
    }
    return null;
  } catch (e) {
    console.warn('Notice: Remote WP projects fetch not reachable, falling back.', e);
    return null;
  }
}

/**
 * Fetch Articles / Blog Posts from WordPress
 */
export async function fetchWordPressArticles(endpoint: string): Promise<Article[] | null> {
  const cleanUrl = normalizeEndpointUrl(endpoint);
  if (!cleanUrl) return null;

  try {
    const response = await fetchWithTimeout(`${cleanUrl}/wp-json/wispaar/v1/articles`, {
      headers: { Accept: 'application/json' },
    }, 5000);

    if (!response.ok) return null;

    const data = await response.json();
    if (data.success && Array.isArray(data.articles)) {
      return data.articles;
    }
    return null;
  } catch (e) {
    console.warn('Notice: Remote WP articles fetch not reachable, falling back.', e);
    return null;
  }
}

/**
 * Fetch Leads / Briefs from WordPress
 */
export async function fetchWordPressLeads(endpoint: string): Promise<WordPressLead[] | null> {
  const cleanUrl = normalizeEndpointUrl(endpoint);
  if (!cleanUrl) return null;

  try {
    const response = await fetchWithTimeout(`${cleanUrl}/wp-json/wispaar/v1/leads`, {
      headers: { Accept: 'application/json' },
    }, 5000);

    if (!response.ok) return null;

    const data = await response.json();
    if (data.success && Array.isArray(data.leads)) {
      return data.leads;
    }
    return null;
  } catch (e) {
    return null;
  }
}

/**
 * Create a Project in WordPress via REST API
 */
export async function createWordPressProject(endpoint: string, projectData: any): Promise<{ success: boolean; project?: Project; message: string }> {
  const cleanUrl = normalizeEndpointUrl(endpoint);
  if (!cleanUrl) {
    return { success: false, message: 'آدرس اندپوینت وردپرس تنظیم نشده است.' };
  }

  try {
    const response = await fetchWithTimeout(`${cleanUrl}/wp-json/wispaar/v1/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(projectData),
    }, 6000);

    const data = await response.json();
    if (response.ok && data.success) {
      return { success: true, project: data.project, message: data.message || 'پروژه با موفقیت ایجاد شد.' };
    }
    return { success: false, message: data.message || 'خطا در ثبت پروژه در وردپرس.' };
  } catch (e: any) {
    return { success: false, message: 'عدم برقراری ارتباط با وردپرس: ' + (e?.message || 'خطای شبکه') };
  }
}

/**
 * Submit Brief / Lead to WordPress via REST API
 */
export async function submitWordPressBrief(endpoint: string, briefData: any): Promise<{ success: boolean; lead?: any; message: string }> {
  const cleanUrl = normalizeEndpointUrl(endpoint);
  if (!cleanUrl) {
    return { success: false, message: 'آدرس اندپوینت وردپرس موجود نیست.' };
  }

  try {
    const response = await fetchWithTimeout(`${cleanUrl}/wp-json/wispaar/v1/brief`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(briefData),
    }, 6000);

    const data = await response.json();
    if (response.ok && data.success) {
      return { success: true, lead: data.lead, message: data.message || 'بریف در وردپرس ثبت شد.' };
    }
    return { success: false, message: data.message || 'خطا در ارسال بریف به وردپرس.' };
  } catch (e: any) {
    return { success: false, message: 'عدم پاسخگویی سرور وردپرس: ' + (e?.message || 'خطا') };
  }
}

/**
 * One-Click Seed WordPress Database
 */
export async function seedWordPressDatabase(endpoint: string): Promise<{ success: boolean; message: string }> {
  const cleanUrl = normalizeEndpointUrl(endpoint);
  if (!cleanUrl) {
    return { success: false, message: 'آدرس وردپرس تعیین نشده است.' };
  }

  try {
    const response = await fetchWithTimeout(`${cleanUrl}/wp-json/wispaar/v1/seed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }, 8000);

    const data = await response.json();
    if (response.ok && data.success) {
      return { success: true, message: data.message || 'داده‌های اولیه در وردپرس ثبت گردید.' };
    }
    return { success: false, message: data.message || 'خطا در درون‌ریزی داده‌ها در وردپرس.' };
  } catch (e: any) {
    return { success: false, message: 'خطای ارتباط با سرور وردپرس: ' + (e?.message || 'نامشخص') };
  }
}
