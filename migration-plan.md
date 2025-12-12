# Java 21 Migration Plan

Session ID: 34cbea85-5f53-4bdc-8cf0-288bc869c60d

Objective: Upgrade Android app Java runtime to Java 21 (LTS), verify build and tests, and finalize migration.

Steps:
1. Verify current Gradle and Android Gradle Plugin compatibility with Java 21.
2. Install or select JDK 21 on the developer machine / CI (requires admin/user action).
3. Update `compileOptions` / `javaVersion` and Gradle `toolchain` settings to Java 21 in `android/app/build.gradle` and root `build.gradle` as needed.
4. Update `gradle.properties` or AGP versions if required.
5. Run a full build: `./gradlew clean assembleDebug` (or via `npm run android`).
6. Fix any compile/runtime errors introduced by Java 21 (dependencies, language features, desugaring).
7. Run tests and fix failures.
8. Run CVE scan and address high/critical items.
9. Perform completeness validation and finalize changes.
10. Commit changes and produce migration summary.

Notes:
- I will prepare the `build.gradle` edits after you confirm I should modify files here. Installing JDK 21 on this machine requires your approval (I will provide exact commands).
- If you want, I can create a branch and apply incremental changes so you can review before merging.
