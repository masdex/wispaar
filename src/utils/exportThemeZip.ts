import JSZip from 'jszip';
import { wpThemeFiles } from '../data/wordpressThemeFiles';
import { wispaarHeadlessPluginCode } from '../data/wispaarPluginCode';

export async function downloadWordPressThemeZip(): Promise<void> {
  const zip = new JSZip();
  const themeFolder = zip.folder('wispaar-theme') || zip;

  for (const file of wpThemeFiles) {
    themeFolder.file(file.path, file.content);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'wispaar-theme.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

/**
 * Downloads the production-verified single-file headless.php plugin package as a ZIP.
 * Extracts into `wispaar-headless/headless.php`, matching `/wp-content/plugins/wispaar-headless/`.
 */
export async function downloadFixedHeadlessPluginZip(): Promise<void> {
  const zip = new JSZip();
  const pluginFolder = zip.folder('wispaar-headless') || zip;

  pluginFolder.file('headless.php', wispaarHeadlessPluginCode);
  pluginFolder.file(
    'README.md',
    `# افزونه وردپرس هدلس ویسپار (نسخه نهایی پروداکشن)
مسیر نصب در هاست: wp-content/plugins/wispaar-headless/headless.php

این افزونه تمامی مسیرهای REST API اختصاصی ویسپار را با سازگاری کامل CORS، امنیت احراز هویت و بدون خطای هدر فعال می‌کند.`
  );

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'wispaar-headless.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

/**
 * Directly downloads the standalone headless.php file so users can upload it
 * directly to /wp-content/plugins/wispaar-headless/ via cPanel File Manager without unzipping.
 */
export function downloadSingleHeadlessPhpFile(): void {
  const blob = new Blob([wispaarHeadlessPluginCode], { type: 'application/x-httpd-php;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'headless.php';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

export async function downloadWordPressPluginZip(): Promise<void> {
  await downloadFixedHeadlessPluginZip();
}

