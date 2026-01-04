import React from "react";
import { Tabs } from "expo-router";
import { Home, Bell, FileText, User } from "lucide-react-native";
import { useTranslation } from "react-i18next";

// Color scheme
const Colors = {
  primary: "#59AC77",
  primaryDark: "#3A6F43",
  accent: "#FDAAAA",
  accentLight: "#FFD5D5",
};

export default function UserLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.primaryDark,
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: t("user.dashboard"),
          tabBarIcon: ({ focused, color }) => (
            <Home size={22} color={focused ? Colors.primaryDark : "#9CA3AF"} />
          ),
        }}
      />
      <Tabs.Screen
        name="notices"
        options={{
          title: t("user.notices"),
          tabBarIcon: ({ focused, color }) => (
            <FileText
              size={22}
              color={focused ? Colors.primaryDark : "#9CA3AF"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="grievances"
        options={{
          title: t("user.grievances"),
          tabBarIcon: ({ focused, color }) => (
            <Bell size={22} color={focused ? Colors.primaryDark : "#9CA3AF"} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("user.profile"),
          tabBarIcon: ({ focused, color }) => (
            <User size={22} color={focused ? Colors.primaryDark : "#9CA3AF"} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
