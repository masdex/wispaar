/**
 * WISPAAR Headless WordPress API Client
 * Centralized, typed, and resilient client connecting the React SPA to the WordPress REST API.
 */

import { Project, Article } from '../types';
import { WordPressLead } from '../utils/wordpressStore';
import {
  ConnectionState,
  ConnectionFailureCategory,
  DiagnosticResult,
  EndpointCapabilities,
  WPHealthResponse,
  WPRootResponse,
  WPPaginatedResponse,
  WPRawProjectItem,
  WPRawArticleItem,
  WPBriefPayload,
  WPBriefResponse,
  WPContactPayload,
  WPContactResponse,
  WPProjectCreatePayload,
  WPProjectCreateResponse,
  WPSeedResponse,
} from '../types/wordpress';

// Default timeout in milliseconds
const DEFAULT_TIMEOUT_MS = 6000;

// Canonical production endpoint
export const CANONICAL_WP_ENDPOINT = 'https://wispaar.ir';

// Known candidate endpoints for controlled discovery
export const KNOWN_CANDIDATE_ENDPOINTS = [
  'https://wispaar.ir',
  'http://demo.local',
  'http://localhost:10004',
  'http://localhost/demo',
  'http://localhost:8000',
];

/**
 * Strips HTML tags and decodes common HTML entities from rendered WordPress fields
 */
export function cleanHtmlText(raw: string | { rendered?: string } | undefined | null): string {
  if (!raw) return '';
  const text = typeof raw === 'object' && raw !== null ? raw.rendered || '' : String(raw);
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&rlm;|&lrm;/g, '')
    .trim();
}

/**
 * Safely sanitizes WordPress rich HTML content (from Gutenberg or Classic editor)
 * preserving safe formatting, images, figures, videos, embeds, lists, tables, and blockquotes
 * while removing executable scripts, form tags, and dangerous inline event handlers.
 */
export function sanitizeHtmlForProse(raw: string | { rendered?: string } | undefined | null): string {
  if (!raw) return '';
  let html = typeof raw === 'object' && raw !== null ? raw.rendered || '' : String(raw);

  // 1. Strip script, style, form tags and their contents
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  html = html.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '');

  // 2. Remove dangerous inline attributes (on*, javascript:, data:)
  html = html.replace(/\s+on[a-z]+\s*=\s*(['"]).*?\1/gi, '');
  html = html.replace(/\s+on[a-z]+\s*=\s*[^\s>]+/gi, '');
  html = html.replace(/href\s*=\s*(['"])javascript:.*?\1/gi, 'href="#"');
  html = html.replace(/src\s*=\s*(['"])javascript:.*?\1/gi, '');

  // 3. Ensure lazy loading on images
  html = html.replace(/<img(?![^>]*loading=)/gi, '<img loading="lazy"');

  return html.trim();
}

/**
 * Normalizes an endpoint URL:
 * - Trims whitespace
 * - Strips trailing slashes
 * - Strips accidental trailing '/wp-json' or '/wp-json/' to prevent double wp-json in requests
 * - Enforces http:// or https:// protocol (enforces HTTPS on wispaar.ir)
 */
export function normalizeEndpointUrl(url: string | undefined | null): string {
  if (!url) return '';
  let clean = url.trim();
  while (clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }
  // Strip trailing /wp-json if accidentally included by user
  if (clean.endsWith('/wp-json')) {
    clean = clean.slice(0, -8);
    while (clean.endsWith('/')) {
      clean = clean.slice(0, -1);
    }
  }
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = (clean.includes('wispaar.ir') ? 'https://' : 'http://') + clean;
  }
  // Canonical host: strip www. for wispaar.ir and enforce https
  if (clean.includes('www.wispaar.ir')) {
    clean = clean.replace('www.wispaar.ir', 'wispaar.ir');
  }
  if (clean.startsWith('http://wispaar.ir')) {
    clean = clean.replace('http://', 'https://');
  }
  return clean;
}

/**
 * Detects whether the current environment is running over HTTPS
 */
export function isBrowserHttps(): boolean {
  return typeof window !== 'undefined' && window.location.protocol === 'https:';
}

/**
 * Validates whether a URL requires HTTPS or is an allowed local development exception
 */
export function isLocalOrLoopbackUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    return (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.endsWith('.local') ||
      host.endsWith('.test') ||
      host.endsWith('.example') ||
      /^192\.168\.\d+\.\d+$/.test(host) ||
      /^10\.\d+\.\d+\.\d+$/.test(host)
    );
  } catch {
    return false;
  }
}

/**
 * Fetch wrapper with timeout and abort signal support
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timer);
    return response;
  } catch (error) {
    clearTimeout(timer);
    throw error;
  }
}

/**
 * Parses potential fetch errors into typed categories
 */
export function categorizeFetchError(err: unknown, targetUrl: string): { category: ConnectionFailureCategory; message: string } {
  const isHttps = isBrowserHttps();
  const isTargetHttp = targetUrl.startsWith('http://');

  if (isHttps && isTargetHttp && !isLocalOrLoopbackUrl(targetUrl)) {
    return {
      category: 'mixed_content',
      message: 'مسدود شدن به دلیل Mixed Content: مرورگر در پروتکل HTTPS اجازه درخواست مستقیم به HTTP ناامن را نمی‌دهد.',
    };
  }

  if (err instanceof Error) {
    if (err.name === 'AbortError') {
      return {
        category: 'timeout',
        message: 'زمان انتظار برای پاسخ به پایان رسید (Timeout). سرور وردپرس در زمان مجاز پاسخ نداد.',
      };
    }

    const msg = err.message.toLowerCase();
    if (msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('cors')) {
      return {
        category: 'cors_error',
        message: 'خطای CORS یا عدم دسترسی به سرور: اطمینان حاصل کنید وردپرس هدرهای CORS را ارسال کرده و سرور روشن است.',
      };
    }
  }

  return {
    category: 'inaccessible_host',
    message: 'هاست وردپرس در دسترس نیست یا ارتباط شبکه با خطا مواجه شد.',
  };
}

/**
 * Extracts normalized siteName, wpVersion and isOnline status from health/root responses
 */
export function parseHealthData(healthJson: any, rootJson?: any): { siteName: string; wpVersion: string; isOnline: boolean } {
  const isOnline = Boolean(healthJson?.success || healthJson?.status === 'online' || healthJson?.status === 'ok');
  const siteName = healthJson?.site || healthJson?.site_name || rootJson?.name || 'سایت وردپرسی';
  const wpVersion = healthJson?.wp || healthJson?.wp_version || 'شناسایی شده';
  return { siteName, wpVersion, isOnline };
}

/**
 * Parses and validates collection response envelope
 */
export function parseCollectionData<T>(data: any): { items: T[]; total: number; totalPages: number; isMalformed: boolean } {
  if (!data || typeof data !== 'object') {
    return { items: [], total: 0, totalPages: 0, isMalformed: true };
  }
  if (Array.isArray(data.items)) {
    return {
      items: data.items,
      total: typeof data.total === 'number' ? data.total : data.items.length,
      totalPages: typeof data.total_pages === 'number' ? data.total_pages : 1,
      isMalformed: false,
    };
  }
  if (Array.isArray(data.projects)) {
    return {
      items: data.projects,
      total: typeof data.count === 'number' ? data.count : data.projects.length,
      totalPages: 1,
      isMalformed: false,
    };
  }
  if (Array.isArray(data.articles)) {
    return {
      items: data.articles,
      total: typeof data.count === 'number' ? data.count : data.articles.length,
      totalPages: 1,
      isMalformed: false,
    };
  }
  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
      totalPages: 1,
      isMalformed: false,
    };
  }
  return { items: [], total: 0, totalPages: 0, isMalformed: true };
}

/**
 * Performs a deep diagnostic health check on a target WordPress URL.
 * Step 1: Checks /wp-json/ root.
 * Step 2: Checks /wp-json/wispaar/v1/health.
 * Step 3: Checks /wp-json/wispaar/v1/projects.
 */
export async function runFullDiagnostic(endpointUrl: string): Promise<DiagnosticResult> {
  const cleanUrl = normalizeEndpointUrl(endpointUrl);
  const startTime = performance.now();

  const emptyCapabilities = {
    wpRestRootReachable: false,
    wispaarNamespaceReachable: false,
    readProjectsAvailable: false,
    readArticlesAvailable: false,
    submitBriefAvailable: true, // public route
    writeProjectsAuthorized: false,
    readLeadsAuthorized: false,
    seedDatabaseAuthorized: false,
  };

  if (!cleanUrl) {
    return {
      endpoint: '',
      state: 'unconfigured',
      failureCategory: 'none',
      latencyMs: 0,
      isWispaarEngine: false,
      capabilities: emptyCapabilities,
      diagnosticAdvice: 'آدرس سرور وردپرس هنوز وارد نشده است. آدرس لوکال یا دامنه سرور را وارد کنید.',
    };
  }

  // 1. Check /wp-json/
  let rootJson: WPRootResponse | null = null;
  try {
    const rootRes = await fetchWithTimeout(
      `${cleanUrl}/wp-json/`,
      { headers: { Accept: 'application/json' } },
      4000
    );

    if (!rootRes.ok) {
      const latency = Math.round(performance.now() - startTime);
      return {
        endpoint: cleanUrl,
        state: 'disconnected',
        failureCategory: rootRes.status === 404 ? 'not_found' : 'server_error',
        httpStatus: rootRes.status,
        latencyMs: latency,
        isWispaarEngine: false,
        capabilities: emptyCapabilities,
        errorMessage: `پاسخ با کد ${rootRes.status} از ریشه REST API وردپرس.`,
        diagnosticAdvice: 'پلاگین وردپرس یا تنظیمات پیوند یکتا (Permalinks) در وردپرس را روی «نام نوشته» بررسی کنید.',
      };
    }

    try {
      rootJson = await rootRes.json();
    } catch {
      return {
        endpoint: cleanUrl,
        state: 'configuration_error',
        failureCategory: 'invalid_json',
        latencyMs: Math.round(performance.now() - startTime),
        isWispaarEngine: false,
        capabilities: emptyCapabilities,
        errorMessage: 'پاسخ سرور وردپرس در ریشه REST با فرمت JSON معتبر نبود.',
        diagnosticAdvice: 'ممکن است خطای PHP یا خروجی افزونه‌های جانبی مانع از رندر صحیح JSON شده باشد.',
      };
    }
  } catch (err) {
    const parsed = categorizeFetchError(err, cleanUrl);
    return {
      endpoint: cleanUrl,
      state: 'disconnected',
      failureCategory: parsed.category,
      latencyMs: Math.round(performance.now() - startTime),
      isWispaarEngine: false,
      capabilities: emptyCapabilities,
      errorMessage: parsed.message,
      diagnosticAdvice: 'بررسی کنید LocalWP / زمپ / آپاچی فعال است و آدرس دامنه در فایل hosts یا DNS قابل دسترسی است.',
    };
  }

  // 2. Check /wp-json/wispaar/v1/health
  let healthJson: WPHealthResponse | null = null;
  let isWispaarEngine = false;

  try {
    const healthRes = await fetchWithTimeout(
      `${cleanUrl}/wp-json/wispaar/v1/health`,
      { headers: { Accept: 'application/json' } },
      4500
    );

    if (healthRes.ok) {
      try {
        healthJson = await healthRes.json();
        isWispaarEngine = Boolean(healthJson?.success || healthJson?.status === 'online' || healthJson?.status === 'ok');
      } catch {
        // Invalid JSON on health
      }
    }
  } catch {
    // Health not reachable or timed out
  }

  const latencyMs = Math.round(performance.now() - startTime);

  // 3. Test content read endpoint (/projects)
  let readProjectsOk = false;
  try {
    const testProjectsRes = await fetchWithTimeout(
      `${cleanUrl}/wp-json/wispaar/v1/projects`,
      { headers: { Accept: 'application/json' } },
      4000
    );
    if (testProjectsRes.ok) {
      const data = await testProjectsRes.json();
      readProjectsOk = Array.isArray(data.items) || Array.isArray(data.projects);
    }
  } catch {
    readProjectsOk = false;
  }

  const capabilities: EndpointCapabilities = {
    wpRestRootReachable: true,
    wispaarNamespaceReachable: isWispaarEngine,
    readProjectsAvailable: readProjectsOk,
    readArticlesAvailable: isWispaarEngine,
    submitBriefAvailable: true,
    writeProjectsAuthorized: false,
    readLeadsAuthorized: false,
    seedDatabaseAuthorized: false,
  };

  const siteName = healthJson?.site || healthJson?.site_name || rootJson?.name || 'سایت وردپرسی';
  const wpVersion = healthJson?.wp || healthJson?.wp_version || 'شناسایی شده';

  if (isWispaarEngine && readProjectsOk) {
    return {
      endpoint: cleanUrl,
      state: 'connected',
      failureCategory: 'none',
      httpStatus: 200,
      latencyMs,
      siteName,
      wpVersion,
      isWispaarEngine: true,
      capabilities,
      diagnosticAdvice: 'ارتباط کامل با وردپرس برقرار است. داده‌های زنده دریافت می‌شوند.',
    };
  }

  if (rootJson && !isWispaarEngine) {
    return {
      endpoint: cleanUrl,
      state: 'partially_connected',
      failureCategory: 'not_found',
      latencyMs,
      siteName,
      wpVersion,
      isWispaarEngine: false,
      capabilities,
      errorMessage: 'هسته وردپرس پاسخگو است، اما افزونه/اندپوینت‌های Wispaar Headless فعال نیستند.',
      diagnosticAdvice: 'پلاگین wispaar-headless-cms را در وردپرس نصب و فعال کنید.',
    };
  }

  return {
    endpoint: cleanUrl,
    state: 'disconnected',
    failureCategory: 'malformed_response',
    latencyMs,
    siteName,
    wpVersion,
    isWispaarEngine: false,
    capabilities,
    errorMessage: 'پاسخ دریافتی با ساختار مورد انتظار اندپوینت‌های ویسپار همخوانی ندارد.',
  };
}

/**
 * Standardizes a raw WordPress project into the frontend Project domain model
 */
export function normalizeProjectItem(raw: WPRawProjectItem, index = 0): Project {
  const id = String(raw.id || `wp-project-${index}`);
  const slug = raw.slug || `project-${id}`;
  const title = cleanHtmlText(raw.title);
  const titleEn = raw.title_en || cleanHtmlText(raw.slug).replace(/-/g, ' ');
  const client = raw.client || 'سفارشی ویسپار';
  const industry = raw.industry || 'فین‌تک و خدمات مالی';
  const year = raw.year || '۱۴۰۴';
  const projectType = raw.project_type || 'وب‌سایت اختصاصی و سیستم هویت برند';
  const challenge = cleanHtmlText(raw.challenge || raw.excerpt || raw.content || 'طراحی و پیاده‌سازی پلتفرم اختصاصی با استانداردهای نوین پرفورمنس.');
  const solution = cleanHtmlText(raw.solution || 'طراحی سیستم دیزاین مینیمال و اتصال مستقیم به هسته وردپرس هدلس.');

  // Safe image resolution: never null or empty string
  const coverImage = raw.featured_image && typeof raw.featured_image === 'string' && raw.featured_image.trim() !== ''
    ? raw.featured_image
    : (index % 3 === 0 ? '/images/fintech.jpg' : index % 3 === 1 ? '/images/biotech.jpg' : '/images/luxury.jpg');

  // Services
  let services: string[] = ['طراحی اختصاصی UI/UX', 'توسعه وردپرس مهندسی‌شده'];
  if (Array.isArray(raw.services)) {
    services = raw.services.map((s) => cleanHtmlText(s)).filter(Boolean);
  } else if (typeof raw.services === 'string' && raw.services.trim() !== '') {
    services = raw.services.split(',').map((s) => s.trim()).filter(Boolean);
  }

  // Technology
  let technology: string[] = ['WordPress Headless', 'React', 'Tailwind CSS', 'REST API'];
  if (Array.isArray(raw.technology)) {
    technology = raw.technology.map((t) => cleanHtmlText(t)).filter(Boolean);
  } else if (typeof raw.technology === 'string' && raw.technology.trim() !== '') {
    technology = raw.technology.split(',').map((t) => t.trim()).filter(Boolean);
  }

  // Results
  const results = [
    {
      label: raw.kpi1_label || 'شاخص عملکرد لایت‌هاوس',
      value: raw.kpi1_value || '۹۹/۱۰۰',
      detail: 'شاخص پرفورمنس هسته',
    },
    {
      label: raw.kpi2_label || 'نرخ تبدیل لندینگ',
      value: raw.kpi2_value || '+۷۵٪',
      detail: 'شاخص رشد سرنخ',
    },
  ];

  if (Array.isArray(raw.results) && raw.results.length > 0) {
    results[0] = {
      label: raw.results[0].label || results[0].label,
      value: raw.results[0].value || results[0].value,
      detail: raw.results[0].detail || results[0].detail,
    };
    if (raw.results[1]) {
      results[1] = {
        label: raw.results[1].label || results[1].label,
        value: raw.results[1].value || results[1].value,
        detail: raw.results[1].detail || results[1].detail,
      };
    }
  }

  return {
    id,
    slug,
    title,
    titleEn,
    client,
    industry,
    services,
    technology,
    year,
    projectType,
    challenge,
    solution,
    results,
    coverImage,
    isDemo: Boolean(raw.is_demo ?? true),
    isFeatured: Boolean(raw.is_featured || raw.isFeatured),
    relatedService: raw.related_service ? cleanHtmlText(raw.related_service) : undefined,
    editorialQuote: raw.quote || '«آفریده‌شده با تلفیق خرد و فناوری در استودیو ویسپار.»',
    websiteUrlPlaceholder: raw.demo_url || raw.link || 'https://demo.wispaar.com',
    tags: Array.from(
      new Set([
        industry,
        raw.category ? cleanHtmlText(raw.category).trim() : '',
        ...(Array.isArray(raw.categories) ? raw.categories.map((c) => cleanHtmlText(c).trim()) : []),
        ...services.slice(0, 3),
      ])
    ).filter(Boolean),
  };
}

/**
 * Standardizes a raw WordPress article into the frontend Article domain model
 */
export function normalizeArticleItem(raw: WPRawArticleItem, index = 0): Article {
  const id = String(raw.id || `wp-article-${index}`);
  const slug = raw.slug || `article-${id}`;
  const title = cleanHtmlText(raw.title);
  const excerpt = cleanHtmlText(raw.excerpt || raw.content || 'بررسی رویکردهای نوین در معماری وب و طراحی تجربه‌های پربازده.');
  const fullContent = cleanHtmlText(raw.content || raw.excerpt);

  // Preserve real WordPress category dynamically
  let category = 'یادداشت‌های استودیو';
  const rawCat = raw.category ? cleanHtmlText(raw.category).trim() : '';
  const rawCatsList: string[] = Array.isArray(raw.categories)
    ? raw.categories.map((c) => cleanHtmlText(c).trim()).filter(Boolean)
    : [];

  const meaningfulCats = rawCatsList.filter(
    (c) => c !== 'دسته‌بندی نشده' && c !== 'Uncategorized' && c !== 'عمومی'
  );

  if (meaningfulCats.length > 0) {
    category = meaningfulCats[0];
  } else if (rawCat && rawCat !== 'دسته‌بندی نشده' && rawCat !== 'Uncategorized') {
    category = rawCat;
  } else if (rawCatsList.length > 0) {
    category = rawCatsList[0];
  } else if (rawCat) {
    category = rawCat;
  }

  const readTime = raw.read_time || '۵ دقیقه';
  const publishedDate = raw.date ? new Date(raw.date).toLocaleDateString('fa-IR') : '۱۴۰۴';

  const contentParagraphs = fullContent
    ? [
        {
          text: fullContent.slice(0, 400),
          subheading: 'مقدمه و طرح مسئله',
        },
        {
          text: fullContent.length > 400 ? fullContent.slice(400) : 'ادامه بررسی تخصصی و تحلیل‌های فنی در مستندات پروژه.',
          quote: '«فناوری بدون استراتژی صرفاً کدهای اضافه است؛ ارزش واقعی در ساده‌سازی حل مسئله نهفته است.»',
        },
      ]
    : [
        {
          text: excerpt,
          subheading: 'نگاه کلی',
        },
      ];

  let tags = ['وردپرس', 'معماری وب'];
  if (Array.isArray(raw.tags)) {
    tags = raw.tags.map((t) => cleanHtmlText(t)).filter(Boolean);
  } else if (typeof raw.tags === 'string' && raw.tags.trim() !== '') {
    tags = raw.tags.split(',').map((t) => t.trim()).filter(Boolean);
  }

  // Preserve rich HTML content from Gutenberg/Classic editor
  let rawHtmlContent: string | undefined = undefined;
  if (typeof raw.content === 'string' && raw.content.trim() !== '') {
    rawHtmlContent = sanitizeHtmlForProse(raw.content);
  } else if (raw.content && typeof raw.content === 'object' && typeof raw.content.rendered === 'string' && raw.content.rendered.trim() !== '') {
    rawHtmlContent = sanitizeHtmlForProse(raw.content.rendered);
  }

  // Preserve featured image if supplied
  const featuredImage = typeof raw.featured_image === 'string' && raw.featured_image.trim() !== ''
    ? raw.featured_image
    : undefined;

  return {
    id,
    slug,
    title,
    category,
    readTime,
    publishedDate,
    author: {
      name: raw.author_name || 'تیم مهندسی ویسپار',
      role: raw.author_role || 'معمار نرم‌افزار',
    },
    excerpt,
    contentParagraphs,
    tags,
    featuredImage,
    rawHtmlContent,
  };
}

/**
 * Fetches Projects from the WordPress API.
 * Accepts the verified `{ items: [...], total, total_pages, page }` structure
 * and falls back gracefully to `{ success: true, projects: [...] }`.
 */
export async function fetchWordPressProjects(
  endpoint: string,
  options: { timeoutMs?: number; authHeader?: string } = {}
): Promise<{ projects: Project[]; total: number; totalPages: number } | null> {
  const cleanUrl = normalizeEndpointUrl(endpoint);
  if (!cleanUrl) return null;

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (options.authHeader) {
    headers['Authorization'] = options.authHeader;
  }

  try {
    const res = await fetchWithTimeout(
      `${cleanUrl}/wp-json/wispaar/v1/projects`,
      { method: 'GET', headers },
      options.timeoutMs || DEFAULT_TIMEOUT_MS
    );

    if (!res.ok) {
      console.warn(`[Wispaar API] Projects endpoint returned status ${res.status}`);
      return null;
    }

    const data: WPPaginatedResponse<WPRawProjectItem> = await res.json();

    // 1. Primary verified contract: data.items
    if (Array.isArray(data.items)) {
      const projects = data.items.map((item, idx) => normalizeProjectItem(item, idx));
      return {
        projects,
        total: data.total ?? projects.length,
        totalPages: data.total_pages ?? 1,
      };
    }

    // 2. Backward compatibility contract: data.projects
    if (Array.isArray(data.projects)) {
      const projects = data.projects.map((item, idx) => normalizeProjectItem(item, idx));
      return {
        projects,
        total: data.count ?? projects.length,
        totalPages: 1,
      };
    }

    // 3. Fallback: direct array
    if (Array.isArray(data)) {
      const projects = (data as WPRawProjectItem[]).map((item, idx) => normalizeProjectItem(item, idx));
      return {
        projects,
        total: projects.length,
        totalPages: 1,
      };
    }

    console.warn('[Wispaar API] Malformed projects response contract:', data);
    return null;
  } catch (err) {
    console.warn('[Wispaar API] Network exception fetching projects:', err);
    return null;
  }
}

/**
 * Fetches Articles from the WordPress API.
 * Accepts the verified `{ items: [...], total, total_pages, page }` structure
 * and falls back gracefully to `{ success: true, articles: [...] }`.
 */
export async function fetchWordPressArticles(
  endpoint: string,
  options: { timeoutMs?: number } = {}
): Promise<{ articles: Article[]; total: number; totalPages: number } | null> {
  const cleanUrl = normalizeEndpointUrl(endpoint);
  if (!cleanUrl) return null;

  try {
    const res = await fetchWithTimeout(
      `${cleanUrl}/wp-json/wispaar/v1/articles`,
      { method: 'GET', headers: { Accept: 'application/json' } },
      options.timeoutMs || DEFAULT_TIMEOUT_MS
    );

    if (!res.ok) {
      console.warn(`[Wispaar API] Articles endpoint returned status ${res.status}`);
      return null;
    }

    const data: WPPaginatedResponse<WPRawArticleItem> = await res.json();

    // 1. Primary verified contract: data.items
    if (Array.isArray(data.items)) {
      const articles = data.items.map((item, idx) => normalizeArticleItem(item, idx));
      return {
        articles,
        total: data.total ?? articles.length,
        totalPages: data.total_pages ?? 1,
      };
    }

    // 2. Backward compatibility contract: data.articles
    if (Array.isArray(data.articles)) {
      const articles = data.articles.map((item, idx) => normalizeArticleItem(item, idx));
      return {
        articles,
        total: data.count ?? articles.length,
        totalPages: 1,
      };
    }

    return null;
  } catch (err) {
    console.warn('[Wispaar API] Network exception fetching articles:', err);
    return null;
  }
}

/**
 * Fetches Leads / Brief submissions from the WordPress API (Protected Endpoint).
 */
export async function fetchWordPressLeads(
  endpoint: string,
  authHeader?: string
): Promise<{ leads: WordPressLead[]; authorized: boolean; error?: string } | null> {
  const cleanUrl = normalizeEndpointUrl(endpoint);
  if (!cleanUrl) return null;

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  try {
    const res = await fetchWithTimeout(
      `${cleanUrl}/wp-json/wispaar/v1/leads`,
      { method: 'GET', headers },
      DEFAULT_TIMEOUT_MS
    );

    if (res.status === 401 || res.status === 403) {
      return {
        leads: [],
        authorized: false,
        error: 'برای مشاهده بریف‌ها و سرنخ‌های ثبت‌شده نیاز به مجوز دسترسی مدیریت وردپرس است.',
      };
    }

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const rawLeads = data.items || data.leads || (Array.isArray(data) ? data : []);

    const leads: WordPressLead[] = rawLeads.map((item: any, idx: number) => ({
      id: String(item.id || `wp-lead-${idx}`),
      name: cleanHtmlText(item.name || item.title || 'کارفرمای محترم'),
      phone: item.phone || '',
      email: item.email || '',
      services: Array.isArray(item.services) ? item.services : ['مشاوره تخصصی'],
      goals: Array.isArray(item.goals) ? item.goals : [],
      platform: item.platform || '',
      website: item.website || '',
      budget: item.budget || 'برآورد نشده',
      timeline: item.timeline || 'استاندارد',
      description: cleanHtmlText(item.description || item.content),
      status: (item.status === 'reviewed' || item.status === 'contacted') ? item.status : 'new',
      createdAt: item.created_at || item.date ? new Date(item.date).toLocaleDateString('fa-IR') : 'به‌تازگی',
    }));

    return { leads, authorized: true };
  } catch {
    return null;
  }
}

/**
 * Creates a project in WordPress via POST /wp-json/wispaar/v1/projects.
 * Requires appropriate authorization in production.
 */
export async function createWordPressProject(
  endpoint: string,
  projectData: WPProjectCreatePayload,
  authHeader?: string
): Promise<WPProjectCreateResponse> {
  const cleanUrl = normalizeEndpointUrl(endpoint);
  if (!cleanUrl) {
    return { success: false, message: 'آدرس سرور وردپرس تنظیم نشده است.' };
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  try {
    const res = await fetchWithTimeout(
      `${cleanUrl}/wp-json/wispaar/v1/projects`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(projectData),
      },
      8000
    );

    if (res.status === 401 || res.status === 403) {
      return {
        success: false,
        message: 'ثبت پروژه نیازمند دسترسی مدیریت در وردپرس است (Unauthorized).',
      };
    }

    const data = await res.json();
    if (res.ok && data.success) {
      const normalized = data.project ? normalizeProjectItem(data.project) : undefined;
      return {
        success: true,
        project: normalized,
        id: data.id,
        message: data.message || 'پروژه با موفقیت در وردپرس ثبت گردید.',
      };
    }

    return {
      success: false,
      message: data.message || `خطا در ثبت پروژه (کد ${res.status}).`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'عدم برقراری ارتباط با وردپرس: ' + (err?.message || 'خطای شبکه'),
    };
  }
}

/**
 * Submits a client brief to WordPress via POST /wp-json/wispaar/v1/brief.
 * This is an intentional public route allowing prospective clients to reach the studio.
 */
export async function submitWordPressBrief(
  endpoint: string,
  briefData: WPBriefPayload
): Promise<WPBriefResponse> {
  const cleanUrl = normalizeEndpointUrl(endpoint);
  if (!cleanUrl) {
    return { success: false, message: 'آدرس اندپوینت وردپرس موجود نیست.' };
  }

  // Validate required fields
  if (!briefData.name || !briefData.phone || !briefData.email) {
    return { success: false, message: 'لطفاً نام، شماره تماس و ایمیل خود را تکمیل نمایید.' };
  }

  try {
    const res = await fetchWithTimeout(
      `${cleanUrl}/wp-json/wispaar/v1/brief`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(briefData),
      },
      7000
    );

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      return {
        success: false,
        message: `پاسخ سرور با فرمت معتبر JSON دریافت نشد (کد وضعیت HTTP: ${res.status}).`,
      };
    }

    if (res.ok && data?.success) {
      return {
        success: true,
        lead_id: data.lead_id || data.id,
        lead: data.lead,
        message: data.message || 'بریف پروژه شما با موفقیت در پیشخوان وردپرس ثبت شد.',
      };
    }

    return {
      success: false,
      message: data?.message || `خطا در ارسال بریف (کد وضعیت: ${res.status}).`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'عدم پاسخگویی سرور وردپرس: ' + (err?.message || 'خطای شبکه'),
    };
  }
}

/**
 * Submits a direct contact message to WordPress via POST /wp-json/wispaar/v1/contact.
 * Stored distinctly in the dedicated Contact Messages inbox in WordPress.
 */
export async function submitWordPressContact(
  endpoint: string,
  contactData: WPContactPayload
): Promise<WPContactResponse> {
  const cleanUrl = normalizeEndpointUrl(endpoint);
  if (!cleanUrl) {
    return { success: false, message: 'آدرس اندپوینت وردپرس موجود نیست.' };
  }

  if (!contactData.name || !contactData.email || !contactData.message) {
    return { success: false, message: 'لطفاً نام، آدرس ایمیل و متن پیام خود را وارد نمایید.' };
  }

  try {
    const res = await fetchWithTimeout(
      `${cleanUrl}/wp-json/wispaar/v1/contact`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(contactData),
      },
      7000
    );

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      return {
        success: false,
        message: `پاسخ سرور با فرمت معتبر JSON دریافت نشد (کد وضعیت: ${res.status}).`,
      };
    }

    if (res.ok && data?.success) {
      return {
        success: true,
        contact_id: data.contact_id || data.id,
        message: data.message || 'پیام شما با موفقیت دریافت شد. تیم ویسپار به زودی با شما تماس خواهد گرفت.',
      };
    }

    return {
      success: false,
      message: data?.message || `خطا در ارسال پیام (کد وضعیت: ${res.status}).`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'عدم پاسخگویی سرور وردپرس: ' + (err?.message || 'خطای شبکه'),
    };
  }
}

/**
 * Triggers one-click database seeding via POST /wp-json/wispaar/v1/seed (Idempotent).
 */
export async function seedWordPressDatabase(
  endpoint: string,
  authHeader?: string
): Promise<WPSeedResponse> {
  const cleanUrl = normalizeEndpointUrl(endpoint);
  if (!cleanUrl) {
    return { success: false, message: 'آدرس وردپرس تعیین نشده است.' };
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  try {
    const res = await fetchWithTimeout(
      `${cleanUrl}/wp-json/wispaar/v1/seed`,
      { method: 'POST', headers },
      10000
    );

    if (res.status === 401 || res.status === 403) {
      return {
        success: false,
        message: 'عملیات Seeding نیازمند دسترسی مدیریت است (Unauthorized).',
      };
    }

    const data = await res.json();
    if (res.ok && data.success) {
      return {
        success: true,
        message: data.message || 'داده‌های اولیه با موفقیت در دیتابیس وردپرس بارگذاری شدند.',
        seeded_count: data.seeded_count,
        skipped_count: data.skipped_count,
      };
    }

    return {
      success: false,
      message: data.message || 'خطا در درون‌ریزی داده‌ها در وردپرس.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'خطای ارتباط با سرور وردپرس: ' + (err?.message || 'خطای شبکه'),
    };
  }
}

/**
 * Controlled candidate endpoint discovery:
 * Probes candidate URLs sequentially with short timeouts.
 * Stops at the first valid, reachable candidate.
 */
export async function discoverReachableEndpoint(
  candidates: string[] = KNOWN_CANDIDATE_ENDPOINTS
): Promise<DiagnosticResult | null> {
  for (const candidate of candidates) {
    try {
      const diag = await runFullDiagnostic(candidate);
      if (diag.state === 'connected' || diag.state === 'partially_connected') {
        return diag;
      }
    } catch {
      // Continue to next candidate
    }
  }
  return null;
}
