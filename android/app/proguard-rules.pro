# Add project specific ProGuard rules here.
-keepclassmembers class * extends androidx.room.RoomDatabase
-dontwarn androidx.room.paging.**
-keep class com.mfs.chargecalculator.data.local.** { *; }
