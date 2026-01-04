import React from 'react';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Home, Bell, PieChart, Settings } from 'lucide-react-native';

// Color scheme
const Colors = {
  primary: '#59AC77',
  primaryDark: '#3A6F43',
  accent: '#FDAAAA',
  accentLight: '#FFD5D5',
};

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.primaryDark,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused, color }) => (
            <Home size={22} color={focused ? Colors.primaryDark : '#9CA3AF'} />
          ),
        }}
      />
      <Tabs.Screen
        name="grievances"
        options={{
          title: 'Grievances',
          tabBarIcon: ({ focused, color }) => (
            <Bell size={22} color={focused ? Colors.primaryDark : '#9CA3AF'} />
          ),
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: 'Budget',
          tabBarIcon: ({ focused, color }) => (
            <PieChart size={22} color={focused ? Colors.primaryDark : '#9CA3AF'} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused, color }) => (
            <Settings size={22} color={focused ? Colors.primaryDark : '#9CA3AF'} />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          href: null,
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
