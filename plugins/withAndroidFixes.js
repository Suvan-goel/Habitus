const { withGradleProperties, withProjectBuildGradle } = require("expo/config-plugins");

const JAVA_HOME = "/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home";

/**
 * Config plugin that applies two Android build fixes that must survive `expo prebuild`:
 *
 * 1. Sets org.gradle.java.home to JDK 17 in gradle.properties
 *    (JDK 25 breaks CMake native builds for react-native-screens / gesture-handler)
 *
 * 2. Adds the @react-native-async-storage local Maven repo to allprojects.repositories
 *    (the shared_storage artifact is shipped inside the npm package, not on Maven Central)
 */
function withAndroidFixes(config) {
  // --- Fix 1: JDK 17 in gradle.properties ---
  config = withGradleProperties(config, (cfg) => {
    const props = cfg.modResults;
    const existing = props.findIndex(
      (p) => p.type === "property" && p.key === "org.gradle.java.home"
    );
    const entry = { type: "property", key: "org.gradle.java.home", value: JAVA_HOME };
    if (existing >= 0) {
      props[existing] = entry;
    } else {
      props.push(entry);
    }
    return cfg;
  });

  // --- Fix 2: async-storage local_repo in build.gradle ---
  config = withProjectBuildGradle(config, (cfg) => {
    const localRepoLine =
      '    maven { url "$rootDir/../node_modules/@react-native-async-storage/async-storage/android/local_repo" }';

    if (!cfg.modResults.contents.includes("async-storage")) {
      // Insert the maven repo right after the jitpack line (or after mavenCentral if no jitpack)
      const anchor = cfg.modResults.contents.includes("jitpack")
        ? "maven { url 'https://www.jitpack.io' }"
        : "mavenCentral()";

      cfg.modResults.contents = cfg.modResults.contents.replace(
        anchor,
        `${anchor}\n${localRepoLine}`
      );
    }
    return cfg;
  });

  return config;
}

module.exports = withAndroidFixes;
