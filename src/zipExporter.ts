import JSZip from 'jszip';
import { ANDROID_FILES, type ProjectFile } from './androidFilesData';

export type { ProjectFile };
export { ANDROID_FILES };

export async function downloadAndroidProjectZip(): Promise<void> {
  const zip = new JSZip();
  const rootFolder = zip.folder('MFS-Charge-Calculator-Android') || zip;

  ANDROID_FILES.forEach((file) => {
    rootFolder.file(file.path, file.content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'MFS_Charge_Calculator_Android_Project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
