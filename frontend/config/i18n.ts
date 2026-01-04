import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "../locales/en.json";
import ne from "../locales/ne.json";

const LANGUAGE_KEY = "@app_language";

const resources = {
  en: { translation: en },
  ne: { translation: ne },
};

// Language change listeners
type LanguageChangeListener = (lang: string) => void;
const languageChangeListeners: LanguageChangeListener[] = [];

export const addLanguageChangeListener = (listener: LanguageChangeListener) => {
  languageChangeListeners.push(listener);
  return () => {
    const index = languageChangeListeners.indexOf(listener);
    if (index > -1) {
      languageChangeListeners.splice(index, 1);
    }
  };
};

// Initialize i18n
const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);

  // If no saved language, check device locale but default to null (will show language selector)
  if (!savedLanguage) {
    const locales = getLocales();
    const deviceLocale = locales[0]?.languageCode || "en";
    // Only auto-set if device is clearly Nepali, otherwise let user choose
    if (deviceLocale === "ne") {
      savedLanguage = "ne";
    }
  }

  await i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage || "en", // Default to English but language selector will show
    fallbackLng: "en",
    compatibilityJSON: "v4",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

  return savedLanguage;
};

// Function to change language
export const changeLanguage = async (lang: "en" | "ne") => {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  await i18n.changeLanguage(lang);
  // Notify all listeners
  languageChangeListeners.forEach((listener) => listener(lang));
};

// Function to get saved language
export const getSavedLanguage = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(LANGUAGE_KEY);
};

// Function to check if language has been selected
export const hasSelectedLanguage = async (): Promise<boolean> => {
  const lang = await AsyncStorage.getItem(LANGUAGE_KEY);
  return lang !== null;
};

// Get current language synchronously
export const getCurrentLanguage = (): string => {
  return i18n.language || "en";
};

export { initI18n };
export default i18n;
