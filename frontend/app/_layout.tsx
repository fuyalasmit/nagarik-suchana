import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useRef } from "react";
import { View, ActivityIndicator } from "react-native";
import "react-native-reanimated";
import "../global.css";
import "../config/i18n";

import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  initI18n,
  addLanguageChangeListener,
  getCurrentLanguage,
} from "@/config/i18n";
import { Palette } from "@/constants/theme";
import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  removeNotificationSubscription,
  getNotificationData,
} from "@/services/notificationService";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());
  const notificationListener = useRef<{ remove: () => void } | null>(null);
  const responseListener = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    const init = async () => {
      await initI18n();
      setCurrentLang(getCurrentLanguage());
      setIsI18nInitialized(true);
    };
    init();
  }, []);

  // Listen for language changes to force re-render
  useEffect(() => {
    const unsubscribe = addLanguageChangeListener((lang) => {
      setCurrentLang(lang);
    });
    return unsubscribe;
  }, []);

  // Set up notification listeners
  useEffect(() => {
    // Handle notifications received while app is foregrounded
    notificationListener.current = addNotificationReceivedListener((notification) => {
      console.log("Notification received:", notification);
    });

    // Handle notification taps
    responseListener.current = addNotificationResponseReceivedListener((response) => {
      const data = getNotificationData(response);
      console.log("Notification tapped:", data);

      // Navigate to notice detail if noticeId is present
      if (data.noticeId && data.type === "notice_published") {
        router.push(`/user/notice/${data.noticeId}`);
      }
    });

    return () => {
      removeNotificationSubscription(notificationListener.current);
      removeNotificationSubscription(responseListener.current);
    };
  }, [router]);

  if (!isI18nInitialized) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Palette.backgroundLight,
        }}
      >
        <ActivityIndicator size="large" color={Palette.primary} />
      </View>
    );
  }

  return (
    <GluestackUIProvider config={config} key={currentLang}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="language" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="admin" options={{ headerShown: false }} />
          <Stack.Screen name="user" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
