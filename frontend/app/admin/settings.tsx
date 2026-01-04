import React from 'react';
import { ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Box, VStack, HStack, Heading, Text } from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import { 
  Building2, 
  Bell, 
  Globe, 
  Users, 
  FileText, 
  Lock, 
  Smartphone, 
  Info, 
  LogOut,
  ChevronRight,
  User
} from 'lucide-react-native';
import { municipalityInfo, AdminColors } from '@/data/admin/mockData';

const Colors = AdminColors;

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <HStack
      style={{
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        alignItems: 'center',
      }}
    >
      <Box
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: Colors.accentLight,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 14,
        }}
      >
        {icon}
      </Box>
      <VStack style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#1F2937' }}>{title}</Text>
        {subtitle && (
          <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{subtitle}</Text>
        )}
      </VStack>
      <ChevronRight size={18} color="#9CA3AF" />
    </HStack>
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const router = useRouter();

  const handleSettingPress = (setting: string) => {
    Alert.alert(setting, `${setting} settings will be available soon.`);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => router.replace('/') },
    ]);
  };

  const handleBackToApp = () => {
    router.replace('/');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F9FAFB' }}
      contentContainerStyle={{ padding: 20, paddingTop: 50, paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <VStack style={{ marginBottom: 24 }}>
        <Heading size="2xl" style={{ color: '#1F2937', fontWeight: '800' }}>
          Settings
        </Heading>
        <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>
          Admin configuration and preferences
        </Text>
      </VStack>

      {/* Admin Profile Card */}
      <Box
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <HStack style={{ alignItems: 'center' }}>
          <Box
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: Colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}
          >
            <User size={28} color="white" />
          </Box>
          <VStack style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#1F2937' }}>
              Admin User
            </Text>
            <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
              {municipalityInfo.name}
            </Text>
            <Text style={{ fontSize: 12, color: Colors.primaryDark, marginTop: 4, fontWeight: '600' }}>
              Super Administrator
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* General Settings */}
      <Text style={{ fontSize: 13, fontWeight: '700', color: '#6B7280', marginBottom: 12, marginLeft: 4 }}>
        GENERAL
      </Text>
      <VStack style={{ marginBottom: 24 }}>
        <SettingItem
          icon={<Building2 size={20} color={Colors.primaryDark} />}
          title="Municipality Profile"
          subtitle="Edit municipality information"
          onPress={() => handleSettingPress('Municipality Profile')}
        />
        <SettingItem
          icon={<Bell size={20} color={Colors.primaryDark} />}
          title="Notifications"
          subtitle="Configure alert preferences"
          onPress={() => handleSettingPress('Notifications')}
        />
        <SettingItem
          icon={<Globe size={20} color={Colors.primaryDark} />}
          title="Language"
          subtitle="English / नेपाली"
          onPress={() => handleSettingPress('Language')}
        />
      </VStack>

      {/* Admin Settings */}
      <Text style={{ fontSize: 13, fontWeight: '700', color: '#6B7280', marginBottom: 12, marginLeft: 4 }}>
        ADMINISTRATION
      </Text>
      <VStack style={{ marginBottom: 24 }}>
        <SettingItem
          icon={<Users size={20} color={Colors.primaryDark} />}
          title="User Management"
          subtitle="Manage admin users and roles"
          onPress={() => handleSettingPress('User Management')}
        />
        <SettingItem
          icon={<FileText size={20} color={Colors.primaryDark} />}
          title="Reports"
          subtitle="Generate and export reports"
          onPress={() => handleSettingPress('Reports')}
        />
        <SettingItem
          icon={<Lock size={20} color={Colors.primaryDark} />}
          title="Security"
          subtitle="Password and access settings"
          onPress={() => handleSettingPress('Security')}
        />
      </VStack>

      {/* App Settings */}
      <Text style={{ fontSize: 13, fontWeight: '700', color: '#6B7280', marginBottom: 12, marginLeft: 4 }}>
        APP
      </Text>
      <VStack style={{ marginBottom: 24 }}>
        <SettingItem
          icon={<Smartphone size={20} color={Colors.primaryDark} />}
          title="Back to Main App"
          subtitle="Return to citizen view"
          onPress={handleBackToApp}
        />
        <SettingItem
          icon={<Info size={20} color={Colors.primaryDark} />}
          title="About"
          subtitle="Version 1.0.0"
          onPress={() => handleSettingPress('About')}
        />
      </VStack>

      {/* Logout Button */}
      <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
        <Box
          style={{
            backgroundColor: Colors.accentLight,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
          }}
        >
          <HStack style={{ alignItems: 'center' }} space="sm">
            <LogOut size={20} color="#991B1B" />
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#991B1B' }}>
              Logout
            </Text>
          </HStack>
        </Box>
      </TouchableOpacity>
    </ScrollView>
  );
}
