import JSZip from 'jszip';
import { wpThemeFiles } from '../data/wordpressThemeFiles';

export async function downloadWordPressThemeZip(): Promise<void> {
  const zip = new JSZip();
  const themeFolder = zip.folder('wispaar-theme') || zip;

  // Add all theme files
  for (const file of wpThemeFiles) {
    themeFolder.file(file.path, file.content);
  }

  // Generate zip blob
  const content = await zip.generateAsync({ type: 'blob' });

  // Trigger download
  const downloadUrl = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'wispaar-theme.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
