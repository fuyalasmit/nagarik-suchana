import React from "react";
import { ScrollView, Alert, TouchableOpacity } from "react-native";
import { Box, VStack, HStack, Heading, Text, Spinner } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { StatCard } from "@/components/admin/StatCard";
import { QuickActionButton } from "@/components/admin/QuickActionButton";
import { ActivityItem } from "@/components/admin/ActivityItem";
import { NoticeCard } from "@/components/admin/NoticeCard";
import {
  municipalityInfo,
  dashboardStats,
  recentActivities,
  AdminColors,
} from "@/data/admin/mockData";
import { useTranslation } from "react-i18next";
import { useNotices } from "@/hooks/useNotices";

const Colors = AdminColors;

export default function DashboardScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { notices, isLoading, error, refetch } = useNotices(5);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "newNotice":
        router.push("/admin/upload");
        break;
      case "viewNotices":
        Alert.alert("View Notices", "This feature will show all notices");
        break;
      case "manageUsers":
        Alert.alert("Manage Users", "This feature will show user management");
        break;
      case "settings":
        router.push("/admin/settings");
        break;
    }
  };

  const handleNoticePress = (id: string) => {
    router.push(`/admin/notice/${id}`);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F9FAFB" }}
      contentContainerStyle={{ padding: 20, paddingTop: 50, paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <VStack style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 14, color: "#6B7280", fontWeight: "600" }}>
          {t("admin.dashboard")}
        </Text>
        <Heading
          size="2xl"
          style={{ color: "#1F2937", fontWeight: "800", marginTop: 4 }}
        >
          {municipalityInfo.nameNepali}
        </Heading>
        <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>
          {municipalityInfo.name}
        </Text>
      </VStack>

      {/* Stats Grid */}
      <VStack style={{ marginBottom: 24 }}>
        <HStack style={{ marginBottom: 12 }} space="md">
          <StatCard
            title="Population"
            value={dashboardStats.totalPopulation}
            icon="users"
            trend={{ value: 2.3, isPositive: true }}
            color={Colors.primary}
          />
          <StatCard
            title="Wards"
            value={dashboardStats.totalWards}
            icon="map"
            color={Colors.primaryDark}
          />
        </HStack>
        <HStack space="md">
          <StatCard
            title="Registered Users"
            value={dashboardStats.registeredUsers}
            icon="phone"
            trend={{ value: 12, isPositive: true }}
            color={Colors.primary}
          />
          <StatCard
            title="Active Notices"
            value={dashboardStats.activeNotices}
            icon="megaphone"
            color={Colors.accent}
          />
        </HStack>
      </VStack>

      {/* Municipality Info Card */}
      <Box
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#1F2937",
            marginBottom: 16,
          }}
        >
          Municipality Information
        </Text>
        <VStack space="sm">
          <HStack style={{ justifyContent: "space-between" }}>
            <Text style={{ color: "#6B7280", fontSize: 13 }}>Province</Text>
            <Text style={{ color: "#1F2937", fontWeight: "600", fontSize: 13 }}>
              {municipalityInfo.province}
            </Text>
          </HStack>
          <HStack style={{ justifyContent: "space-between" }}>
            <Text style={{ color: "#6B7280", fontSize: 13 }}>District</Text>
            <Text style={{ color: "#1F2937", fontWeight: "600", fontSize: 13 }}>
              {municipalityInfo.district}
            </Text>
          </HStack>
          <HStack style={{ justifyContent: "space-between" }}>
            <Text style={{ color: "#6B7280", fontSize: 13 }}>Area</Text>
            <Text style={{ color: "#1F2937", fontWeight: "600", fontSize: 13 }}>
              {municipalityInfo.area}
            </Text>
          </HStack>
          <HStack style={{ justifyContent: "space-between" }}>
            <Text style={{ color: "#6B7280", fontSize: 13 }}>Contact</Text>
            <Text style={{ color: "#1F2937", fontWeight: "600", fontSize: 13 }}>
              {municipalityInfo.contactPhone}
            </Text>
          </HStack>
        </VStack>
      </Box>

      {/* Quick Actions */}
      <Box style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#1F2937",
            marginBottom: 12,
          }}
        >
          Quick Actions
        </Text>
        <HStack space="md">
          <QuickActionButton
            icon="new"
            label="New Notice"
            onPress={() => handleQuickAction("newNotice")}
            color={Colors.accentLight}
          />
          <QuickActionButton
            icon="list"
            label="View All"
            onPress={() => handleQuickAction("viewNotices")}
            color={Colors.accentLight}
          />
          <QuickActionButton
            icon="users"
            label="Users"
            onPress={() => handleQuickAction("manageUsers")}
            color={Colors.accentLight}
          />
          <QuickActionButton
            icon="settings"
            label="Settings"
            onPress={() => handleQuickAction("settings")}
            color={Colors.accentLight}
          />
        </HStack>
      </Box>

      {/* Grievance Summary */}
      <Box
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <HStack
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#1F2937" }}>
            Grievance Summary
          </Text>
          <Box
            style={{
              backgroundColor: Colors.accentLight,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#991B1B" }}>
              {dashboardStats.pendingGrievances} Pending
            </Text>
          </Box>
        </HStack>
        <HStack style={{ justifyContent: "space-around" }}>
          <VStack style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 28, fontWeight: "800", color: "#F59E0B" }}>
              {dashboardStats.pendingGrievances}
            </Text>
            <Text style={{ fontSize: 12, color: "#6B7280" }}>Pending</Text>
          </VStack>
          <VStack style={{ alignItems: "center" }}>
            <Text
              style={{ fontSize: 28, fontWeight: "800", color: Colors.primary }}
            >
              {dashboardStats.resolvedGrievances}
            </Text>
            <Text style={{ fontSize: 12, color: "#6B7280" }}>Resolved</Text>
          </VStack>
          <VStack style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 28, fontWeight: "800", color: "#1F2937" }}>
              {dashboardStats.pendingGrievances +
                dashboardStats.resolvedGrievances}
            </Text>
            <Text style={{ fontSize: 12, color: "#6B7280" }}>Total</Text>
          </VStack>
        </HStack>
      </Box>

      {/* Recent Notices */}
      <Box
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <HStack
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#1F2937" }}>
            Recent Notices
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: Colors.primaryDark,
            }}
            onPress={() => handleQuickAction("viewNotices")}
          >
            View All
          </Text>
        </HStack>

        {isLoading ? (
          <Box style={{ alignItems: "center", paddingVertical: 20 }}>
            <Spinner color={Colors.primary} />
          </Box>
        ) : error ? (
          <Box
            style={{
              backgroundColor: "#FEE2E2",
              padding: 16,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#991B1B", marginBottom: 8 }}>{error}</Text>
            <TouchableOpacity
              onPress={refetch}
              style={{
                backgroundColor: Colors.primary,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Retry</Text>
            </TouchableOpacity>
          </Box>
        ) : notices.length === 0 ? (
          <Box style={{ alignItems: "center", paddingVertical: 20 }}>
            <Text style={{ color: "#6B7280", marginBottom: 12 }}>
              No notices created yet
            </Text>
            <TouchableOpacity
              onPress={() => handleQuickAction("newNotice")}
              style={{
                backgroundColor: Colors.primary,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                Create Notice
              </Text>
            </TouchableOpacity>
          </Box>
        ) : (
          <VStack>
            {notices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onPress={handleNoticePress}
              />
            ))}
          </VStack>
        )}
      </Box>

      {/* Recent Activity */}
      <Box
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          padding: 20,
        }}
      >
        <HStack
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#1F2937" }}>
            Recent Activity
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: Colors.primaryDark,
            }}
            onPress={() => Alert.alert("View All", "Show all activities")}
          >
            View All
          </Text>
        </HStack>
        <VStack>
          {recentActivities.slice(0, 5).map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </VStack>
      </Box>
    </ScrollView>
  );
}
