import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Palette } from "@/constants/theme";
import { changeLanguage } from "@/config/i18n";

export default function LanguageScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleLanguageSelect = async (lang: "en" | "ne") => {
    await changeLanguage(lang);
    router.replace("/register");
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Logo/Icon */}
        <View style={styles.logoWrapper}>
          <View style={styles.logoCircle}>
            <View style={styles.globeIcon}>
              <View style={styles.globeLine} />
              <View style={styles.globeLineHorizontal} />
              <View style={styles.globeLineVertical} />
            </View>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Choose Your Language</Text>
        <Text style={styles.titleNepali}>आफ्नो भाषा छान्नुहोस्</Text>
        <Text style={styles.subtitle}>Select your preferred language</Text>

        {/* Language Options */}
        <View style={styles.languageContainer}>
          {/* English Option */}
          <TouchableOpacity
            style={styles.languageCard}
            onPress={() => handleLanguageSelect("en")}
            activeOpacity={0.8}
          >
            <View style={styles.flagContainer}>
              <Text style={styles.flagText}>EN</Text>
            </View>
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>English</Text>
              <Text style={styles.languageNative}>English</Text>
            </View>
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>

          {/* Nepali Option */}
          <TouchableOpacity
            style={styles.languageCard}
            onPress={() => handleLanguageSelect("ne")}
            activeOpacity={0.8}
          >
            <View style={[styles.flagContainer, styles.flagNepali]}>
              <Text style={styles.flagText}>ने</Text>
            </View>
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>Nepali</Text>
              <Text style={styles.languageNative}>नेपाली</Text>
            </View>
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          You can change this later in settings
        </Text>
        <Text style={styles.footerTextNepali}>
          तपाईं यसलाई पछि सेटिङमा परिवर्तन गर्न सक्नुहुन्छ
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  logoWrapper: {
    marginBottom: 32,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Palette.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  globeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  globeLine: {
    position: "absolute",
    width: 50,
    height: 3,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  globeLineHorizontal: {
    position: "absolute",
    width: 3,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  globeLineVertical: {
    position: "absolute",
    width: 30,
    height: 50,
    borderWidth: 3,
    borderColor: "#fff",
    borderRadius: 15,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
    textAlign: "center",
  },
  titleNepali: {
    fontSize: 22,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 40,
    textAlign: "center",
  },
  languageContainer: {
    width: "100%",
    gap: 16,
    marginBottom: 32,
  },
  languageCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: "transparent",
  },
  flagContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Palette.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  flagNepali: {
    backgroundColor: Palette.accentStrong,
  },
  flagText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  languageNative: {
    fontSize: 16,
    color: "#6B7280",
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    fontSize: 20,
    color: Palette.primary,
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 4,
  },
  footerTextNepali: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
