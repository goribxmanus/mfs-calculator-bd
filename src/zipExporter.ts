import JSZip from 'jszip';

export interface ProjectFile {
  path: string;
  content: string;
  category: 'build' | 'kotlin' | 'res' | 'test' | 'docs';
}

export const ANDROID_FILES: ProjectFile[] = [
  {
    path: 'README.md',
    category: 'docs',
    content: `# MFS Charge Calculator — Native Android Project

Production-ready Native Android application built with **Kotlin**, **Jetpack Compose**, **Material 3**, **Room Database**, and **DataStore Preferences**.

### Build Commands:
- \`./gradlew assembleDebug\` (Generates Debug APK)
- \`./gradlew assembleRelease\` (Generates Signed Release APK)
- \`./gradlew bundleRelease\` (Generates AAB for Google Play)
- \`./gradlew test\` (Executes calculation unit tests)

**Developed by Musabber Himel**`
  },
  {
    path: 'settings.gradle.kts',
    category: 'build',
    content: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "MFS Charge Calculator"
include(":app")`
  },
  {
    path: 'build.gradle.kts',
    category: 'build',
    content: `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.ksp) apply false
}`
  },
  {
    path: 'gradle/wrapper/gradle-wrapper.properties',
    category: 'build',
    content: `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.9-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists`
  },
  {
    path: 'gradlew',
    category: 'build',
    content: `#!/bin/sh
# Gradle start up script for POSIX
app_path=$0
while [ -h "$app_path" ]; do
    ls=\`ls -ld "$app_path"\`
    link=\`expr "$ls" : '.*-> \\(.*\\)$'\`
    if expr "$link" : '/.*' > /dev/null; then
        app_path="$link"
    else
        app_path=\`dirname "$app_path"\`"/$link"
    fi
done
APP_BASE_NAME=\`basename "$0"\`
APP_HOME=\`cd "\`dirname \"$app_path\"\`" > /dev/null && pwd\`
DEFAULT_JVM_OPTS='"-Xmx64m" "-Xms64m"'
CLASSPATH=$APP_HOME/gradle/wrapper/gradle-wrapper.jar
if [ -n "$JAVA_HOME" ] ; then
    JAVACMD=$JAVA_HOME/bin/java
else
    JAVACMD=java
fi
eval set -- "$DEFAULT_JVM_OPTS" "$JAVA_OPTS" "$GRADLE_OPTS" "\\"-Dorg.gradle.appname=$APP_BASE_NAME\\"" -classpath "\\"\\$CLASSPATH\\"" org.gradle.wrapper.GradleWrapperMain "$@"
exec "$JAVACMD" "$@"`
  },
  {
    path: 'gradlew.bat',
    category: 'build',
    content: `@rem Gradle startup script for Windows
@if "%DEBUG%"=="" @echo off
if "%OS%"=="Windows_NT" setlocal
set DIRNAME=%~dp0
if "%DIRNAME%"=="" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%
set DEFAULT_JVM_OPTS="-Xmx64m" "-Xms64m"
if defined JAVA_HOME goto findJavaFromJavaHome
set JAVA_EXE=java.exe
goto execute
:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%/bin/java.exe
:execute
set CLASSPATH=%APP_HOME%\\gradle\\wrapper\\gradle-wrapper.jar
"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %GRADLE_OPTS% "-Dorg.gradle.appname=%APP_BASE_NAME%" -classpath "%CLASSPATH%" org.gradle.wrapper.GradleWrapperMain %*
:end
if "%OS%"=="Windows_NT" endlocal`
  },
  {
    path: '.github/workflows/build-apk.yml',
    category: 'build',
    content: `name: Build Android APK

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
          if-no-files-found: warn`
  },
  {
    path: 'gradle/libs.versions.toml',
    category: 'build',
    content: `[versions]
agp = "8.7.2"
kotlin = "2.0.21"
coreKtx = "1.13.1"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.9.3"
composeBom = "2024.10.01"
navigationCompose = "2.8.3"
room = "2.6.1"
ksp = "2.0.21-1.0.27"
datastore = "1.1.1"
junit = "4.13.2"
junitVersion = "1.2.1"
espressoCore = "3.6.1"
coroutines = "1.9.0"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
androidx-room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
androidx-room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "room" }
androidx-room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "room" }
androidx-datastore-preferences = { group = "androidx.datastore", name = "datastore-preferences", version.ref = "datastore" }
kotlinx-coroutines-android = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-android", version.ref = "coroutines" }
junit = { group = "junit", name = "junit", version.ref = "junit" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }`
  },
  {
    path: 'app/build.gradle.kts',
    category: 'build',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.mfs.chargecalculator"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.mfs.chargecalculator"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.material.icons.extended)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)
    implementation(libs.androidx.datastore.preferences)
    implementation(libs.kotlinx.coroutines.android)
    testImplementation(libs.junit)
}`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    category: 'build',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <application
        android:name=".MfsCalculatorApp"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MfsChargeCalculator">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
  },
  {
    path: 'app/src/main/java/com/mfs/chargecalculator/MainActivity.kt',
    category: 'kotlin',
    content: `package com.mfs.chargecalculator

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.mfs.chargecalculator.ui.navigation.AppNavHost
import com.mfs.chargecalculator.ui.theme.MfsChargeCalculatorTheme
import com.mfs.chargecalculator.viewmodel.CalculatorViewModel
import com.mfs.chargecalculator.viewmodel.CalculatorViewModelFactory

class MainActivity : ComponentActivity() {
    private val viewModel: CalculatorViewModel by viewModels {
        val app = application as MfsCalculatorApp
        CalculatorViewModelFactory(
            historyDao = app.database.historyDao(),
            preferencesRepository = app.preferencesRepository
        )
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            val userPreferences by viewModel.userPreferences.collectAsState()
            val navController = rememberNavController()

            MfsChargeCalculatorTheme(themeMode = userPreferences.themeMode) {
                Surface(modifier = Modifier.fillMaxSize()) {
                    AppNavHost(navController = navController, viewModel = viewModel)
                }
            }
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/mfs/chargecalculator/engine/MfsCalculationEngine.kt',
    category: 'kotlin',
    content: `package com.mfs.chargecalculator.engine

import com.mfs.chargecalculator.model.CalculationResult
import java.math.BigDecimal
import java.math.RoundingMode

object MfsCalculationEngine {
    val MAX_SAFE_AMOUNT = BigDecimal("10000000.00")
    private val ONE_THOUSAND = BigDecimal("1000.00")

    fun calculate(
        amount: BigDecimal,
        mfsName: String,
        ratePer1000: BigDecimal,
        sendMoneyFee: BigDecimal
    ): CalculationResult {
        val safeAmount = when {
            amount <= BigDecimal.ZERO -> BigDecimal.ZERO
            amount > MAX_SAFE_AMOUNT -> MAX_SAFE_AMOUNT
            else -> amount.setScale(2, RoundingMode.HALF_UP)
        }

        if (safeAmount == BigDecimal.ZERO) {
            return CalculationResult(
                amount = BigDecimal.ZERO.setScale(2),
                mfsName = mfsName,
                grossPercentageCharge = BigDecimal.ZERO.setScale(2),
                sendMoneyFee = sendMoneyFee.setScale(2, RoundingMode.HALF_UP),
                netCharge = BigDecimal.ZERO.setScale(2),
                totalCustomerPays = BigDecimal.ZERO.setScale(2)
            )
        }

        // percentageCharge = amount * rate / 1000
        val grossCharge = safeAmount.multiply(ratePer1000).divide(ONE_THOUSAND, 2, RoundingMode.HALF_UP)

        // netCharge = max(0, percentageCharge - sendMoneyFee)
        val rawNetCharge = grossCharge.subtract(sendMoneyFee)
        val netCharge = if (rawNetCharge < BigDecimal.ZERO) BigDecimal.ZERO.setScale(2) else rawNetCharge.setScale(2, RoundingMode.HALF_UP)

        // total = amount + netCharge
        val totalCustomerPays = safeAmount.add(netCharge).setScale(2, RoundingMode.HALF_UP)

        return CalculationResult(
            amount = safeAmount,
            mfsName = mfsName,
            grossPercentageCharge = grossCharge,
            sendMoneyFee = sendMoneyFee.setScale(2, RoundingMode.HALF_UP),
            netCharge = netCharge,
            totalCustomerPays = totalCustomerPays
        )
    }
}`
  },
  {
    path: 'app/src/main/java/com/mfs/chargecalculator/model/MfsProvider.kt',
    category: 'kotlin',
    content: `package com.mfs.chargecalculator.model

enum class MfsId { BKASH, NAGAD, ROCKET, UPAY }

data class MfsProviderConfig(
    val id: MfsId,
    val displayName: String,
    val defaultRatePer1000: Double,
    val defaultSendMoneyFee: Double
) {
    companion object {
        val BKASH = MfsProviderConfig(MfsId.BKASH, "bKash", 18.50, 5.00)
        val NAGAD = MfsProviderConfig(MfsId.NAGAD, "Nagad", 13.00, 5.00)
        val ROCKET = MfsProviderConfig(MfsId.ROCKET, "Rocket", 16.70, 0.00)
        val UPAY = MfsProviderConfig(MfsId.UPAY, "Upay", 14.00, 0.00)
        val ALL = listOf(BKASH, NAGAD, ROCKET, UPAY)
    }
}`
  },
  {
    path: 'app/src/main/java/com/mfs/chargecalculator/data/local/HistoryEntity.kt',
    category: 'kotlin',
    content: `package com.mfs.chargecalculator.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "calculation_history")
data class HistoryEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val mfsName: String,
    val amount: Double,
    val grossPercentageCharge: Double,
    val sendMoneyFee: Double,
    val netCharge: Double,
    val totalCustomerPays: Double,
    val timestamp: Long = System.currentTimeMillis()
)`
  },
  {
    path: 'app/src/main/java/com/mfs/chargecalculator/ui/screens/AboutDeveloperScreen.kt',
    category: 'kotlin',
    content: `package com.mfs.chargecalculator.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mfs.chargecalculator.R

@Composable
fun AboutDeveloperScreen(onNavigateBack: () -> Unit) {
    // Prominently displays: "Developed by Musabber Himel"
    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("MFS Charge Calculator", fontWeight = FontWeight.Bold, fontSize = 22.sp)
        Spacer(Modifier.height(16.dp))
        Card {
            Text(
                text = "Developed by Musabber Himel",
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp,
                modifier = Modifier.padding(20.dp)
            )
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/mfs/chargecalculator/ui/screens/HistoryScreen.kt',
    category: 'kotlin',
    content: `package com.mfs.chargecalculator.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mfs.chargecalculator.R
import com.mfs.chargecalculator.viewmodel.CalculatorViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HistoryScreen(
    viewModel: CalculatorViewModel,
    onNavigateBack: () -> Unit
) {
    val historyList by viewModel.historyList.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(stringResource(R.string.calculation_history)) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    if (historyList.isNotEmpty()) {
                        IconButton(onClick = { viewModel.onClearHistory() }) {
                            Icon(Icons.Default.Delete, contentDescription = "Clear", tint = MaterialTheme.colorScheme.error)
                        }
                    }
                }
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(innerPadding).padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(historyList, key = { it.id }) { item ->
                Card(
                    onClick = {
                        viewModel.onRestoreHistory(item)
                        onNavigateBack()
                    },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("\${item.mfsName}  ৳\${item.amount}", fontWeight = FontWeight.Bold)
                            Text("৳\${item.totalCustomerPays}", fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.primary)
                        }
                    }
                }
            }
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/mfs/chargecalculator/ui/screens/MainCalculatorScreen.kt',
    category: 'kotlin',
    content: `package com.mfs.chargecalculator.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.mfs.chargecalculator.ui.components.*
import com.mfs.chargecalculator.viewmodel.CalculatorViewModel

@Composable
fun MainCalculatorScreen(
    viewModel: CalculatorViewModel,
    onNavigateToHistory: () -> Unit,
    onNavigateToSettings: () -> Unit,
    onNavigateToAboutDeveloper: () -> Unit
) {
    val rawAmount by viewModel.rawAmount.collectAsState()
    val selectedMfsId by viewModel.selectedMfsId.collectAsState()
    val calculationResult by viewModel.calculationResult.collectAsState()
    val userPreferences by viewModel.userPreferences.collectAsState()

    Scaffold(
        topBar = {
            TopAppBarWithMenu(
                currentLanguage = userPreferences.language,
                onNavigateToCalculator = {},
                onNavigateToHistory = onNavigateToHistory,
                onNavigateToAboutDeveloper = onNavigateToAboutDeveloper,
                onNavigateToSettings = onNavigateToSettings,
                onLanguageSelected = { viewModel.setLanguage(it) }
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier.fillMaxSize().padding(innerPadding).padding(horizontal = 16.dp, vertical = 6.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            ResultCard(result = calculationResult)
            MfsSelector(selectedMfsId = selectedMfsId, onSelectMfs = { viewModel.onSelectMfs(it) })
            AmountInputField(rawAmount = rawAmount, onClear = { viewModel.onClearAmount() })
            QuickAddButtons(onQuickAdd = { viewModel.onQuickAdd(it) }, onClear = { viewModel.onClearAmount() })
            NumericKeypad(onDigit = { viewModel.onDigit(it) }, onDecimal = { viewModel.onDecimal() }, onBackspace = { viewModel.onBackspace() })
            OutlinedButton(onClick = { viewModel.onReset() }, modifier = Modifier.fillMaxWidth().height(40.dp)) {
                Text("Reset")
            }
        }
    }
}`
  },
  {
    path: 'app/src/test/java/com/mfs/chargecalculator/engine/MfsCalculationEngineTest.kt',
    category: 'test',
    content: `package com.mfs.chargecalculator.engine

import org.junit.Assert.assertEquals
import org.junit.Test
import java.math.BigDecimal

class MfsCalculationEngineTest {
    @Test
    fun testBkash1000() {
        val res = MfsCalculationEngine.calculate(BigDecimal("1000.00"), "bKash", BigDecimal("18.50"), BigDecimal("5.00"))
        assertEquals("৳1,013.50", res.formattedTotal)
    }

    @Test
    fun testNagad1000() {
        val res = MfsCalculationEngine.calculate(BigDecimal("1000.00"), "Nagad", BigDecimal("13.00"), BigDecimal("5.00"))
        assertEquals("৳1,008.00", res.formattedTotal)
    }

    @Test
    fun testRocket1000() {
        val res = MfsCalculationEngine.calculate(BigDecimal("1000.00"), "Rocket", BigDecimal("16.70"), BigDecimal("0.00"))
        assertEquals("৳1,016.70", res.formattedTotal)
    }

    @Test
    fun testUpay1000() {
        val res = MfsCalculationEngine.calculate(BigDecimal("1000.00"), "Upay", BigDecimal("14.00"), BigDecimal("0.00"))
        assertEquals("৳1,014.00", res.formattedTotal)
    }
}`
  }
];

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
