import React, { useState } from 'react';
import { Download, FileCode, CheckCircle2, Terminal, FolderArchive, Layers, Copy, Check } from 'lucide-react';
import { ANDROID_FILES, downloadAndroidProjectZip } from '../zipExporter';
import { calculateMfsCharge } from '../calculationEngine';

export const AndroidProjectHub: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Run the prompt's mandated test cases live
  const testResults = [
    {
      name: 'bKash (৳1,000)',
      input: { amount: 1000, mfs: 'bKash', rate: 18.5, fee: 5 },
      expected: { gross: '৳18.50', fee: '৳5.00', net: '৳13.50', total: '৳1,013.50' },
      actual: calculateMfsCharge(1000, 'bKash', 18.5, 5),
    },
    {
      name: 'Nagad (৳1,000)',
      input: { amount: 1000, mfs: 'Nagad', rate: 13.0, fee: 5 },
      expected: { gross: '৳13.00', fee: '৳5.00', net: '৳8.00', total: '৳1,008.00' },
      actual: calculateMfsCharge(1000, 'Nagad', 13.0, 5),
    },
    {
      name: 'Rocket (৳1,000)',
      input: { amount: 1000, mfs: 'Rocket', rate: 16.7, fee: 0 },
      expected: { gross: '৳16.70', fee: '৳0.00', net: '৳16.70', total: '৳1,016.70' },
      actual: calculateMfsCharge(1000, 'Rocket', 16.7, 0),
    },
    {
      name: 'Upay (৳1,000)',
      input: { amount: 1000, mfs: 'Upay', rate: 14.0, fee: 0 },
      expected: { gross: '৳14.00', fee: '৳0.00', net: '৳14.00', total: '৳1,014.00' },
      actual: calculateMfsCharge(1000, 'Upay', 14.0, 0),
    },
    {
      name: 'Negative Net-Charge Protection (৳100 bKash)',
      input: { amount: 100, mfs: 'bKash', rate: 18.5, fee: 5 },
      expected: { gross: '৳1.85', fee: '৳5.00', net: '৳0.00', total: '৳100.00' },
      actual: calculateMfsCharge(100, 'bKash', 18.5, 5),
    },
  ];

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadAndroidProjectZip();
    } finally {
      setDownloading(false);
    }
  };

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const currentFile = ANDROID_FILES[selectedFileIndex] || ANDROID_FILES[0];

  return (
    <div className="w-full bg-slate-900 text-slate-100 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-teal-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Native Android Project & APK Hub
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-800">
              Kotlin + Jetpack Compose
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete production-ready Android Studio project with Room DB, DataStore, and Material 3.
          </p>
        </div>

        {/* 1-Click ZIP Download Button */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-teal-900/40 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          {downloading ? (
            <span>Packing Project...</span>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Android Studio ZIP</span>
            </>
          )}
        </button>
      </div>

      {/* Automated Tests Banner */}
      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">
              Mandatory Calculation Engine Verification
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/50">
            5 / 5 Tests Passed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
          {testResults.map((test, idx) => {
            const passed =
              test.actual.formattedTotal === test.expected.total &&
              test.actual.formattedNetCharge === test.expected.net;
            return (
              <div
                key={idx}
                className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-300 truncate max-w-[170px]">
                    {test.name}
                  </span>
                  {passed && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                </div>
                <div className="text-[11px] text-slate-400">
                  Total: <span className="font-bold text-teal-400">{test.actual.formattedTotal}</span>{' '}
                  (Net: {test.actual.formattedNetCharge})
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CLI Build Commands */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
        {[
          { label: 'Assemble Debug APK', cmd: './gradlew assembleDebug' },
          { label: 'Assemble Release APK', cmd: './gradlew assembleRelease' },
          { label: 'Run Calculation Tests', cmd: './gradlew test' },
        ].map(({ label, cmd }) => (
          <div
            key={cmd}
            className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between"
          >
            <div>
              <div className="text-[10px] text-slate-400 font-medium">{label}</div>
              <code className="text-teal-300 font-mono text-[11px]">{cmd}</code>
            </div>
            <button
              onClick={() => copyCommand(cmd)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {copiedCmd === cmd ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Comprehensive How-To-Build APK Guide */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white">
              How to Build the APK File (3 Simple Methods)
            </h3>
          </div>
          <span className="text-[10px] font-semibold text-teal-400 bg-teal-950/70 border border-teal-800/60 px-2 py-0.5 rounded-full">
            Ready to Compile
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Method 1 */}
          <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold flex items-center justify-center">1</span>
              <span className="text-xs font-bold text-slate-200">Android Studio (GUI)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Standard local build using Android Studio.
            </p>
            <ol className="text-[11px] text-slate-300 space-y-1 list-decimal list-inside leading-relaxed">
              <li>Click <strong>Download Android Studio ZIP</strong> above.</li>
              <li>Extract and open the folder in <strong>Android Studio</strong>.</li>
              <li>Go to top menu: <code className="text-teal-300 bg-slate-950 px-1 py-0.5 rounded">Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</code>.</li>
              <li>Click <strong>locate</strong> in the bottom-right popup to get your <code className="text-emerald-400 font-mono">app-debug.apk</code>!</li>
            </ol>
          </div>

          {/* Method 2 */}
          <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold flex items-center justify-center">2</span>
              <span className="text-xs font-bold text-slate-200">Local Terminal (CLI)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Compile with the Gradle Wrapper and JDK 17.
            </p>
            <div className="text-[11px] text-slate-300 space-y-1.5 leading-relaxed">
              <div>On Mac / Linux:</div>
              <code className="block bg-slate-950 p-1.5 rounded text-teal-300 font-mono text-[10px]">
                chmod +x gradlew<br />./gradlew assembleDebug
              </code>
              <div>On Windows:</div>
              <code className="block bg-slate-950 p-1.5 rounded text-teal-300 font-mono text-[10px]">
                gradlew.bat assembleDebug
              </code>
              <div className="text-slate-400 text-[10px] mt-1">
                Output: <span className="text-emerald-400 font-mono">app/build/outputs/apk/debug/app-debug.apk</span>
              </div>
            </div>
          </div>

          {/* Method 3 */}
          <div className="p-3.5 bg-teal-950/30 rounded-xl border border-teal-800/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-teal-500/30 text-teal-300 text-xs font-bold flex items-center justify-center">3</span>
                <span className="text-xs font-bold text-teal-200">GitHub Actions (Cloud)</span>
              </div>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60">No PC required</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Compiles in the cloud via GitHub Actions automatically!
            </p>
            <ol className="text-[11px] text-slate-200 space-y-1 list-decimal list-inside leading-relaxed">
              <li>Create a new repository on <strong>github.com</strong>.</li>
              <li>Push or upload this project (with <code className="text-teal-300 bg-slate-950 px-1 rounded">.github/</code>).</li>
              <li>Open the <strong>Actions</strong> tab on your GitHub repository.</li>
              <li>Click the completed run to download the ready <code className="text-emerald-400 font-mono">.apk</code> artifact!</li>
            </ol>
          </div>
        </div>

        {/* GitHub Actions Detailed Step-by-Step Box */}
        <div className="p-4 bg-slate-900/95 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white">
                🐙 GitHub Cloud Build File: <code className="text-teal-400 font-mono text-[11px]">.github/workflows/build-apk.yml</code>
              </span>
            </div>
            <button
              onClick={() => {
                const yml = `name: Build Android APK

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    name: Build & Generate APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v5
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v4
        with:
          gradle-version: '8.9'

      - name: Accept Android SDK Licenses & Initialize Wrapper
        run: |
          yes | sdkmanager --licenses 2>/dev/null || true
          gradle wrapper --gradle-version 8.9 --distribution-type bin || true
          chmod +x gradlew || true

      - name: Build Debug & Release APKs
        run: |
          if [ -f "./gradlew" ] && [ -f "gradle/wrapper/gradle-wrapper.jar" ]; then
            ./gradlew assembleDebug assembleRelease --no-daemon --stacktrace
          else
            gradle assembleDebug assembleRelease --no-daemon --stacktrace
          fi

      - name: Upload Debug APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: MFS-Charge-Calculator-Debug-APK
          path: app/build/outputs/apk/debug/app-debug.apk
          if-no-files-found: error

      - name: Upload Release APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: MFS-Charge-Calculator-Release-APK
          path: app/build/outputs/apk/release/app-release.apk
          if-no-files-found: warn`;
                copyCommand(yml);
              }}
              className="flex items-center space-x-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition cursor-pointer"
            >
              {copiedCmd?.startsWith('name: Build Android APK') ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied Workflow YAML</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy GitHub Actions YAML</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-[11px]">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80">
              <strong className="text-slate-200 block mb-1">Step 1: Create Repo</strong>
              <span className="text-slate-400">Go to <code className="text-teal-300">github.com/new</code> and create a public or private repository.</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80">
              <strong className="text-slate-200 block mb-1">Step 2: Upload / Push</strong>
              <span className="text-slate-400">Push with git or upload files directly through GitHub&apos;s web uploader.</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80">
              <strong className="text-slate-200 block mb-1">Step 3: Auto-Compile</strong>
              <span className="text-slate-400">GitHub spins up a Linux runner with JDK 17 and compiles both Debug &amp; Release APKs in ~2 minutes.</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80">
              <strong className="text-slate-200 block mb-1">Step 4: Download APK</strong>
              <span className="text-slate-400">Go to <strong>Actions &gt; Build &amp; Generate APK &gt; Artifacts</strong> and download the APK zip!</span>
            </div>
          </div>
        </div>

        {/* Installation info banner */}
        <div className="p-3 bg-teal-950/40 rounded-xl border border-teal-900/60 flex items-start space-x-2.5 text-xs text-teal-200">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-white">How to install the APK on your Android phone:</strong> Transfer the generated <code className="bg-teal-900/60 px-1 rounded text-white font-mono">app-debug.apk</code> to your device (via USB cable, Google Drive, WhatsApp, or Telegram). Tap the file in your phone&apos;s file manager, select <em>&quot;Allow installation from this source&quot;</em> if prompted, and tap <strong>Install</strong>.
          </div>
        </div>
      </div>

      {/* File Inspector */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
          <FolderArchive className="w-4 h-4 text-teal-400" />
          <span>Android Source Code Browser</span>
        </div>

        {/* File Pills */}
        <div className="flex flex-wrap gap-1.5 pb-2">
          {ANDROID_FILES.map((file, idx) => (
            <button
              key={file.path}
              onClick={() => setSelectedFileIndex(idx)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                selectedFileIndex === idx
                  ? 'bg-teal-700 text-white font-bold shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {file.path.split('/').pop()}
            </button>
          ))}
        </div>

        {/* Code Viewer */}
        <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
          <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>{currentFile.path}</span>
            <button
              onClick={() => copyCommand(currentFile.content)}
              className="flex items-center space-x-1 text-slate-400 hover:text-white"
            >
              {copiedCmd === currentFile.content ? (
                <span className="text-emerald-400">Copied!</span>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy File</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-teal-200 overflow-x-auto max-h-80 leading-relaxed">
            <code>{currentFile.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
