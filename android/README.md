# MFS Charge Calculator — Native Android Project

Production-ready Native Android application built with **Kotlin**, **Jetpack Compose**, **Material 3**, **Room Database**, and **DataStore Preferences**.

Designed specifically for small shops and businesses in Bangladesh that use personal MFS accounts (bKash, Nagad, Rocket, Upay) for business transactions.

---

## 📱 Project Specifications

| Specification | Value |
| :--- | :--- |
| **Application Name** | MFS Charge Calculator |
| **Package Name** | `com.mfs.chargecalculator` |
| **UI Toolkit** | Jetpack Compose + Material 3 |
| **Language** | Kotlin 2.0.21 |
| **Minimum SDK** | `minSdk = 24` (Android 7.0 Nougat and above — covers >95% devices) |
| **Target SDK** | `targetSdk = 34` (Android 14) |
| **Compile SDK** | `compileSdk = 34` |
| **Database** | Room SQLite Database (`calculation_history`, max 100 entries) |
| **Preferences** | Android Jetpack DataStore |
| **Architecture** | Clean Architecture (UI -> ViewModel -> Engine/Domain -> Repository -> Room/DataStore) |
| **Offline First** | 100% Offline — No remote server, no API, no analytics, no tracking |

---

## 🧮 Exact Business Charging Logic

For an input transaction `amount`:
1. `percentageCharge = amount × rate / 1000`
2. `netCharge = max(0, percentageCharge - sendMoneyFee)`
3. `totalCustomerPays = amount + netCharge`

### Default Provider Configurations
- **bKash**: Rate = ৳18.50 per 1000, Send Money Fee = ৳5.00
- **Nagad**: Rate = ৳13.00 per 1000, Send Money Fee = ৳5.00
- **Rocket**: Rate = ৳16.70 per 1000, Send Money Fee = ৳0.00
- **Upay**: Rate = ৳14.00 per 1000, Send Money Fee = ৳0.00

---

## 🛠️ How to Build the APK & AAB

### 1. Import into Android Studio
1. Launch **Android Studio** (Hedgehog, Iguana, Jellyfish, or newer).
2. Select **Open** and choose this `android/` directory.
3. Wait for Gradle sync to complete.

### 2. Build Debug APK via Command Line
Run inside the project root:
```bash
./gradlew assembleDebug
```
The output APK will be generated at:
```
app/build/outputs/apk/debug/app-debug.apk
```

### 3. Build Release APK
```bash
./gradlew assembleRelease
```
The output APK will be generated at:
```
app/build/outputs/apk/release/app-release.apk
```

### 4. Build Android App Bundle (AAB for Google Play)
```bash
./gradlew bundleRelease
```
The output bundle will be generated at:
```
app/build/outputs/bundle/release/app-release.aab
```

### 5. Run Unit Tests
```bash
./gradlew test
```
All unit test cases validating bKash (1000 -> 1013.50), Nagad (1000 -> 1008.00), Rocket (1000 -> 1016.70), and Upay (1000 -> 1014.00) will execute and verify the calculation engine.

---

## 📲 How to Install APK on an Android Device

### Via ADB (Developer Mode)
```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### Direct Sideloading
1. Transfer `app-debug.apk` or `app-release.apk` to your phone via USB cable, Google Drive, WhatsApp, or Bluetooth.
2. Tap the APK file in your phone's File Manager.
3. Allow "Install unknown apps" if prompted.
4. Tap **Install** and launch **MFS Charge Calculator**.

---

## 📂 Project Structure

```
android/
├── app/
│   ├── build.gradle.kts
│   ├── proguard-rules.pro
│   └── src/
│       ├── main/
│       │   ├── AndroidManifest.xml
│       │   ├── java/com/mfs/chargecalculator/
│       │   │   ├── MainActivity.kt
│       │   │   ├── MfsCalculatorApp.kt
│       │   │   ├── model/
│       │   │   │   ├── MfsProvider.kt
│       │   │   │   └── CalculationResult.kt
│       │   │   ├── engine/
│       │   │   │   └── MfsCalculationEngine.kt
│       │   │   ├── data/
│       │   │   │   ├── local/
│       │   │   │   │   ├── HistoryEntity.kt
│       │   │   │   │   ├── HistoryDao.kt
│       │   │   │   │   └── AppDatabase.kt
│       │   │   │   └── preferences/
│       │   │   │       ├── ThemeMode.kt
│       │   │   │       ├── AppLanguage.kt
│       │   │   │       └── UserPreferencesRepository.kt
│       │   │   ├── viewmodel/
│       │   │   │   ├── CalculatorViewModel.kt
│       │   │   │   └── CalculatorViewModelFactory.kt
│       │   │   └── ui/
│       │   │       ├── theme/ (Color.kt, Theme.kt, Type.kt)
│       │   │       ├── navigation/ (Screen.kt, AppNavHost.kt)
│       │   │       ├── components/ (TopAppBarWithMenu.kt, ResultCard.kt, MfsSelector.kt, AmountInputField.kt, QuickAddButtons.kt, NumericKeypad.kt, HistorySection.kt)
│       │   │       └── screens/ (MainCalculatorScreen.kt, SettingsScreen.kt, AboutDeveloperScreen.kt)
│       │   └── res/
│       │       ├── values/ (strings.xml, colors.xml, themes.xml)
│       │       ├── values-bn/ (strings.xml - Bengali বাংলা)
│       │       └── drawable/ & mipmap-anydpi-v26/ (Adaptive Icons)
│       └── test/java/com/mfs/chargecalculator/engine/
│           └── MfsCalculationEngineTest.kt
├── gradle/
│   ├── libs.versions.toml
│   └── wrapper/gradle-wrapper.properties
├── build.gradle.kts
├── settings.gradle.kts
└── gradle.properties
```

---

## 👨‍💻 Developer Notice
**Developed by Musabber Himel**
Offline-first MFS Charge Calculator for Bangladesh.
