import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Palette } from "@/constants/theme";
import { hasSelectedLanguage } from "@/config/i18n";

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Main fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation animation for the rings
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Navigate after delay - check if language is already selected
    const timer = setTimeout(async () => {
      const languageSelected = await hasSelectedLanguage();
      if (languageSelected) {
        router.replace("/register");
      } else {
        router.replace("/language");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, router, rotateAnim, pulseAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const rotateReverse = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Animated Logo */}
        <View style={styles.logoWrapper}>
          {/* Outer rotating ring */}
          <Animated.View
            style={[
              styles.ring,
              styles.outerRing,
              {
                transform: [{ rotate }],
              },
            ]}
          />

          {/* Inner rotating ring */}
          <Animated.View
            style={[
              styles.ring,
              styles.innerRing,
              {
                transform: [{ rotate: rotateReverse }],
              },
            ]}
          />

          {/* Center pulsing circle */}
          <Animated.View
            style={[
              styles.centerCircle,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <View style={styles.buildingIcon}>
              <View style={styles.buildingTop} />
              <View style={styles.pillarsContainer}>
                <View style={styles.buildingPillar} />
                <View style={styles.buildingPillar} />
                <View style={styles.buildingPillar} />
              </View>
            </View>
          </Animated.View>
        </View>

        <Text style={styles.title}>नागरिक सूचना</Text>
        <Text style={styles.subtitle}>Nagarik Suchana</Text>
        <Text style={styles.tagline}>थाहा पाऊ, प्रश्न गर।</Text>
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
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  ring: {
    position: "absolute",
    borderWidth: 3,
    borderStyle: "solid",
    borderRadius: 100,
  },
  outerRing: {
    width: 140,
    height: 140,
    borderColor: Palette.primary,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
  },
  innerRing: {
    width: 100,
    height: 100,
    borderColor: Palette.accentStrong,
    borderBottomColor: "transparent",
    borderRightColor: "transparent",
  },
  centerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Palette.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  buildingIcon: {
    width: 44,
    height: 36,
    justifyContent: "space-between",
    alignItems: "center",
  },
  buildingTop: {
    width: 44,
    height: 6,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  pillarsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 44,
    height: 26,
  },
  buildingPillar: {
    width: 9,
    height: 26,
    backgroundColor: "#fff",
    borderRadius: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#11181C",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#687076",
    marginBottom: 16,
    textAlign: "center",
  },
  tagline: {
    fontSize: 14,
    color: "#9BA1A6",
    textAlign: "center",
    fontStyle: "italic",
  },
});
