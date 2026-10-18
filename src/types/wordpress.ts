/**
 * WISPAAR Headless WordPress Type Definitions
 * Explicit contracts matching the real WordPress REST API and Wispaar Headless engine.
 */

import { Project, Article } from './index';

/**
 * Connection states for the Headless WordPress integration
 */
export type ConnectionState =
  | 'unconfigured'
  | 'connecting'
  | 'connected'
  | 'partially_connected'
  | 'disconnected'
  | 'unauthorized'
  | 'configuration_error';

/**
 * Diagnostic failure categories
 */
export type ConnectionFailureCategory =
  | 'none'
  | 'inaccessible_host'
  | 'mixed_content'
  | 'dns_failure'
  | 'cors_error'
  | 'timeout'
  | 'not_found'
  | 'server_error'
  | 'invalid_json'
  | 'malformed_response'
  | 'auth_required';

/**
 * Capability matrix verified against the active endpoint
 */
export interface EndpointCapabilities {
  wpRestRootReachable: boolean;
  wispaarNamespaceReachable: boolean;
  readProjectsAvailable: boolean;
  readArticlesAvailable: boolean;
  submitBriefAvailable: boolean;
  writeProjectsAuthorized: boolean;
  readLeadsAuthorized: boolean;
  seedDatabaseAuthorized: boolean;
}

/**
 * Backend Health Response (/wp-json/wispaar/v1/health)
 * Supports both verified real format and backward-compatible extended fields.
 */
export interface WPHealthResponse {
  success?: boolean;
  status?: string; // 'online' | 'ok'
  site?: string; // 'Demo'
  wp?: string; // '7.1.3' or '6.x'
  mode?: string;
  engine?: string;
  wp_version?: string;
  site_name?: string;
  site_url?: string;
  rest_url?: string;
  cors_enabled?: boolean;
  timestamp?: string;
  counts?: {
    projects?: number;
    articles?: number;
    leads?: number;
  };
  features?: Record<string, boolean>;
}

/**
 * Standard WordPress REST Root Schema (/wp-json/)
 */
export interface WPRootResponse {
  name?: string;
  description?: string;
  url?: string;
  home?: string;
  namespaces?: string[];
  routes?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Generic Paginated Collection Response from the verified WordPress API
 */
export interface WPPaginatedResponse<T> {
  items: T[];
  total: number;
  total_pages: number;
  page: number;
  // Legacy / alternative backend keys
  projects?: T[];
  articles?: T[];
  success?: boolean;
  count?: number;
}

/**
 * Raw Project item as returned by WordPress /wp-json/wispaar/v1/projects
 */
export interface WPRawProjectItem {
  id: number | string;
  title: string | { rendered: string };
  slug: string;
  content?: string | { rendered: string };
  excerpt?: string | { rendered: string };
  link?: string;
  date?: string;
  featured_image?: string | null;
  // Custom meta fields when available
  title_en?: string;
  client?: string;
  industry?: string;
  services?: string[] | string;
  technology?: string[] | string;
  year?: string;
  project_type?: string;
  challenge?: string;
  solution?: string;
  kpi1_label?: string;
  kpi1_value?: string;
  kpi2_label?: string;
  kpi2_value?: string;
  results?: Array<{ label: string; value: string; detail?: string }>;
  is_demo?: boolean;
  is_featured?: boolean;
  related_service?: string;
  demo_url?: string;
  quote?: string;
  [key: string]: unknown;
}

/**
 * Raw Article item as returned by WordPress /wp-json/wispaar/v1/articles
 */
export interface WPRawArticleItem {
  id: number | string;
  title: string | { rendered: string };
  slug: string;
  excerpt?: string | { rendered: string };
  content?: string | { rendered: string };
  link?: string;
  date?: string;
  featured_image?: string | null;
  category?: string;
  categories?: string[];
  author_name?: string;
  author_role?: string;
  read_time?: string;
  tags?: string[] | string;
  [key: string]: unknown;
}

/**
 * Lead / Brief submission payload to POST /wp-json/wispaar/v1/brief
 */
export interface WPBriefPayload {
  name: string;
  phone: string;
  email: string;
  services?: string[];
  goals?: string[];
  platform?: string;
  website?: string;
  budget?: string;
  timeline?: string;
  description?: string;
}

/**
 * Response from POST /wp-json/wispaar/v1/brief
 */
export interface WPBriefResponse {
  success: boolean;
  message: string;
  lead_id?: number | string;
  lead?: unknown;
}

/**
 * Contact Message submission payload to POST /wp-json/wispaar/v1/contact
 */
export interface WPContactPayload {
  name: string;
  phone?: string;
  email: string;
  service?: string;
  subject?: string;
  message: string;
}

/**
 * Response from POST /wp-json/wispaar/v1/contact
 */
export interface WPContactResponse {
  success: boolean;
  message: string;
  contact_id?: number | string;
}

/**
 * Project creation payload for POST /wp-json/wispaar/v1/projects
 */
export interface WPProjectCreatePayload {
  title: string;
  titleEn?: string;
  client?: string;
  industry?: string;
  year?: string;
  projectType?: string;
  challenge?: string;
  solution?: string;
  kpi1Label?: string;
  kpi1Value?: string;
  kpi2Label?: string;
  kpi2Value?: string;
  services?: string[];
  technology?: string[];
  isDemo?: boolean;
}

/**
 * Response from POST /wp-json/wispaar/v1/projects
 */
export interface WPProjectCreateResponse {
  success: boolean;
  message: string;
  project?: Project;
  id?: number | string;
}

/**
 * Response from POST /wp-json/wispaar/v1/seed
 */
export interface WPSeedResponse {
  success: boolean;
  message: string;
  seeded_count?: number;
  skipped_count?: number;
}

/**
 * Comprehensive Diagnostic Result
 */
export interface DiagnosticResult {
  endpoint: string;
  state: ConnectionState;
  failureCategory: ConnectionFailureCategory;
  httpStatus?: number;
  latencyMs: number;
  errorMessage?: string;
  diagnosticAdvice?: string;
  siteName?: string;
  wpVersion?: string;
  isWispaarEngine: boolean;
  capabilities: EndpointCapabilities;
}
