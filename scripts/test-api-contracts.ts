/**
 * Comprehensive Automated Test Suite for WISPAAR Headless WordPress Integration
 * Validates API Contracts, Normalizers, Error Categorization, and Endpoint Precedence.
 * Run via: npm test
 */

import {
  cleanHtmlText,
  normalizeEndpointUrl,
  normalizeProjectItem,
  normalizeArticleItem,
  parseHealthData,
  parseCollectionData,
  categorizeFetchError,
  CANONICAL_WP_ENDPOINT,
} from '../src/services/headlessApi';
import { getWordPressEndpoint } from '../src/utils/wordpressStore';
import { WPRawProjectItem, WPRawArticleItem } from '../src/types/wordpress';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
  }
}

console.log('\n============================================================');
console.log('WISPAAR Headless API Contract & Normalization Test Suite');
console.log('============================================================\n');

// -----------------------------------------------------------------------------
// 1. URL Normalization Tests
// -----------------------------------------------------------------------------
console.log('1. URL Normalization Tests:');
assert(
  normalizeEndpointUrl('https://wispaar.ir/') === 'https://wispaar.ir',
  'Strips trailing slashes'
);
assert(
  normalizeEndpointUrl('https://wispaar.ir/wp-json') === 'https://wispaar.ir',
  'Strips accidental trailing /wp-json'
);
assert(
  normalizeEndpointUrl('https://wispaar.ir/wp-json/') === 'https://wispaar.ir',
  'Strips accidental trailing /wp-json/'
);
assert(
  normalizeEndpointUrl('http://wispaar.ir') === 'https://wispaar.ir',
  'Enforces HTTPS for wispaar.ir'
);
assert(
  normalizeEndpointUrl('http://www.wispaar.ir') === 'https://wispaar.ir',
  'Enforces HTTPS and removes www for wispaar.ir'
);
assert(
  normalizeEndpointUrl('https://www.wispaar.ir') === 'https://wispaar.ir',
  'Normalizes https://www.wispaar.ir to canonical domain'
);
assert(
  normalizeEndpointUrl('wispaar.ir') === 'https://wispaar.ir',
  'Prepends https:// to naked wispaar.ir domain'
);
assert(
  normalizeEndpointUrl('http://demo.local:10004/') === 'http://demo.local:10004',
  'Preserves ports for local development URLs'
);
assert(
  normalizeEndpointUrl('') === '',
  'Handles empty string safely'
);

// -----------------------------------------------------------------------------
// 2. Health Response Parsing Tests
// -----------------------------------------------------------------------------
console.log('\n2. Health Response Parsing Tests:');
// Verified live server shape
const liveHealthResponse = {
  success: true,
  status: 'online',
  site: 'headless',
  wp: '7.1.3',
};
const parsedLiveHealth = parseHealthData(liveHealthResponse);
assert(
  parsedLiveHealth.isOnline === true,
  'Recognizes success: true and status: "online" as online'
);
assert(
  parsedLiveHealth.siteName === 'headless',
  'Extracts site field ("headless") correctly'
);
assert(
  parsedLiveHealth.wpVersion === '7.1.3',
  'Extracts wp field ("7.1.3") correctly'
);

// Backward-compatible alternative shape
const legacyHealthResponse = {
  success: true,
  site_name: 'WISPAAR Studio',
  wp_version: '6.7.1',
};
const parsedLegacyHealth = parseHealthData(legacyHealthResponse);
assert(
  parsedLegacyHealth.siteName === 'WISPAAR Studio',
  'Extracts legacy site_name field'
);
assert(
  parsedLegacyHealth.wpVersion === '6.7.1',
  'Extracts legacy wp_version field'
);

// Fallback when fields are missing
const emptyHealth = parseHealthData({});
assert(
  typeof emptyHealth.siteName === 'string' && emptyHealth.siteName.length > 0,
  'Provides fallback site name when health fields are empty'
);

// -----------------------------------------------------------------------------
// 3. Collection Response Parsing Tests
// -----------------------------------------------------------------------------
console.log('\n3. Collection Response Parsing Tests:');
// Verified live empty collection
const verifiedEmptyProjects = {
  items: [],
  total: 0,
  total_pages: 0,
  page: 1,
};
const parsedEmpty = parseCollectionData(verifiedEmptyProjects);
assert(
  Array.isArray(parsedEmpty.items) && parsedEmpty.items.length === 0,
  'Parsed items is an empty array'
);
assert(
  parsedEmpty.total === 0,
  'Preserves total count as 0'
);
assert(
  parsedEmpty.isMalformed === false,
  'Marks verified empty collection as non-malformed'
);

// Verified populated collection
const populatedCollection = {
  items: [
    { id: 40, title: 'سیناپس کلود', slug: 'synapse-cloud' },
    { id: 41, title: 'آریا کاپیتال', slug: 'arya-capital' },
  ],
  total: 2,
  total_pages: 1,
  page: 1,
};
const parsedPopulated = parseCollectionData(populatedCollection);
assert(
  parsedPopulated.items.length === 2,
  'Extracts items array with correct length'
);
assert(
  parsedPopulated.total === 2,
  'Extracts total metadata correctly'
);

// Backward-compatible projects key
const legacyProjects = {
  success: true,
  projects: [{ id: 10, title: 'پروژه قدیمی' }],
  count: 1,
};
const parsedLegacyProjects = parseCollectionData(legacyProjects);
assert(
  parsedLegacyProjects.items.length === 1 && !parsedLegacyProjects.isMalformed,
  'Extracts legacy data.projects collection'
);

// Malformed responses
const malformedString = parseCollectionData('<html>Error 500</html>');
assert(
  malformedString.isMalformed === true,
  'Flags non-JSON/string responses as malformed'
);
const malformedEmptyObj = parseCollectionData({});
assert(
  malformedEmptyObj.isMalformed === true,
  'Flags empty object without items/projects/articles as malformed'
);

// -----------------------------------------------------------------------------
// 4. HTML Text Sanitization Tests
// -----------------------------------------------------------------------------
console.log('\n4. HTML Text Sanitization Tests:');
assert(
  cleanHtmlText('<p>Hello <strong>World</strong></p>') === 'Hello World',
  'Strips HTML tags cleanly'
);
assert(
  cleanHtmlText('سیناپس &amp; کلود &quot;ابری&#039; &lt;&gt;') === "سیناپس & کلود \"ابری' <>",
  'Decodes HTML entities'
);
assert(
  cleanHtmlText({ rendered: 'نوشته تستی با <em>گوتنبرگ</em>' }) === 'نوشته تستی با گوتنبرگ',
  'Handles rendered object envelope'
);
assert(
  cleanHtmlText(null) === '',
  'Handles null value safely'
);
assert(
  cleanHtmlText(undefined) === '',
  'Handles undefined value safely'
);

// -----------------------------------------------------------------------------
// 5. Project Item Normalization Tests
// -----------------------------------------------------------------------------
console.log('\n5. Project Item Normalization Tests:');
const sampleRawProject: WPRawProjectItem = {
  id: 40,
  title: 'سیناپس کلود',
  slug: 'synapse-cloud',
  content: '<p>توضیحات مفصل پروژه ابری</p>',
  excerpt: 'چکیده پروژه ابری',
  link: 'https://wispaar.ir/projects/synapse-cloud/',
  date: '2026-10-14T15:22:22+00:00',
  featured_image: null, // Critical: verify null image does NOT crash
  client: 'شرکت سیناپس',
  industry: 'زیرساخت ابری',
  year: '۱۴۰۴',
};

const normalizedProject = normalizeProjectItem(sampleRawProject, 0);
assert(
  normalizedProject.id === '40',
  'Project ID mapped as string'
);
assert(
  normalizedProject.title === 'سیناپس کلود',
  'Project title cleaned and preserved'
);
assert(
  normalizedProject.slug === 'synapse-cloud',
  'Project slug preserved'
);
assert(
  typeof normalizedProject.coverImage === 'string' && normalizedProject.coverImage.length > 0,
  'Null featured_image converted to safe non-empty fallback image'
);
assert(
  Array.isArray(normalizedProject.services) && normalizedProject.services.length > 0,
  'Project services normalized to non-empty array'
);
assert(
  Array.isArray(normalizedProject.results) && normalizedProject.results.length === 2,
  'Project KPI metrics populated with safe defaults'
);

// -----------------------------------------------------------------------------
// 6. Article Item Normalization Tests
// -----------------------------------------------------------------------------
console.log('\n6. Article Item Normalization Tests:');
const sampleRawArticle: WPRawArticleItem = {
  id: 1,
  title: 'Hello world!',
  slug: 'hello-world',
  excerpt: 'Welcome to WordPress.',
  content: '<p>Welcome to WordPress. This is your first post. Edit or delete it, then start writing!</p>',
  link: 'https://wispaar.ir/hello-world/',
  date: '2026-10-06T17:45:13+00:00',
};

const normalizedArticle = normalizeArticleItem(sampleRawArticle, 0);
assert(
  normalizedArticle.id === '1',
  'Article ID mapped as string'
);
assert(
  normalizedArticle.title === 'Hello world!',
  'Article title cleaned'
);
assert(
  normalizedArticle.slug === 'hello-world',
  'Article slug mapped'
);
assert(
  Array.isArray(normalizedArticle.contentParagraphs) && normalizedArticle.contentParagraphs.length > 0,
  'Article content paragraphs constructed safely'
);

// -----------------------------------------------------------------------------
// 7. Error Categorization Tests
// -----------------------------------------------------------------------------
console.log('\n7. Error Categorization Tests:');
const abortError = new Error('The operation was aborted');
abortError.name = 'AbortError';
assert(
  categorizeFetchError(abortError, 'https://wispaar.ir').category === 'timeout',
  'Categorizes AbortError as timeout'
);

const networkError = new Error('Failed to fetch');
assert(
  categorizeFetchError(networkError, 'https://wispaar.ir').category === 'cors_error',
  'Categorizes "Failed to fetch" as cors_error'
);

const genericError = new Error('Connection reset by peer');
assert(
  categorizeFetchError(genericError, 'https://wispaar.ir').category === 'inaccessible_host',
  'Categorizes unknown network reset as inaccessible_host'
);

// -----------------------------------------------------------------------------
// 8. Endpoint Precedence Tests
// -----------------------------------------------------------------------------
console.log('\n8. Endpoint Configuration Precedence Tests:');
assert(
  CANONICAL_WP_ENDPOINT === 'https://wispaar.ir',
  'CANONICAL_WP_ENDPOINT is https://wispaar.ir'
);
assert(
  getWordPressEndpoint() === 'https://wispaar.ir',
  'Default getWordPressEndpoint returns https://wispaar.ir'
);

console.log('\n============================================================');
console.log(`Test Execution Summary: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('============================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
