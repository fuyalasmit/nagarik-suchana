import React, { useState } from "react";
import { ScrollView, TouchableOpacity, Alert } from "react-native";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  InputField,
  Button,
  ButtonText,
  Card,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { Search, Bell, FileText, MapPin, Calendar } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Palette } from "@/constants/theme";

// Mock data for notices
const mockNotices = [
  {
    id: "1",
    title: "Job Vacancy - Health Assistant",
    description:
      "Bharatpur Metropolitan City is seeking qualified candidates for Health Assistant positions.",
    category: "Job Vacancy",
    deadline: "2026-02-15",
    location: "Bharatpur Metropolitan",
    isRelevant: true,
  },
  {
    id: "2",
    title: "Road Maintenance Notice",
    description:
      "Scheduled road maintenance work will be conducted on Main Road from January 10-15.",
    category: "Infrastructure",
    deadline: "2026-01-15",
    location: "Ward 5",
    isRelevant: false,
  },
  {
    id: "3",
    title: "Water Supply Disruption",
    description:
      "Water supply will be temporarily disrupted for maintenance work.",
    category: "Public Service",
    deadline: "2026-01-08",
    location: "Ward 3, 4",
    isRelevant: true,
  },
];

const quickActions = [
  { id: "grievance", title: "Submit Grievance", icon: Bell, color: "#EF4444" },
  { id: "notices", title: "All Notices", icon: FileText, color: "#3B82F6" },
  { id: "profile", title: "Update Profile", icon: MapPin, color: "#10B981" },
];

export default function UserDashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const quickActions = [
    {
      id: "grievance",
      title: t("grievances.submitNew"),
      icon: Bell,
      color: "#EF4444",
    },
    {
      id: "notices",
      title: t("notices.title"),
      icon: FileText,
      color: "#3B82F6",
    },
    {
      id: "profile",
      title: t("profile.updateProfile"),
      icon: MapPin,
      color: "#10B981",
    },
  ];

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "grievance":
        router.push("/user/grievances");
        break;
      case "notices":
        router.push("/user/notices");
        break;
      case "profile":
        router.push("/user/profile");
        break;
    }
  };

  const filteredNotices = mockNotices.filter(
    (notice) =>
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F9FAFB" }}
      contentContainerStyle={{ padding: 20, paddingTop: 50, paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <VStack style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 14, color: "#6B7280", fontWeight: "600" }}>
          {t("user.welcome")}
        </Text>
        <Heading
          size="2xl"
          style={{ color: "#1F2937", fontWeight: "800", marginTop: 4 }}
        >
          {t("common.appNameNepali")}
        </Heading>
        <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>
          {t("common.tagline")}
        </Text>
      </VStack>

      {/* Search Bar */}
      <Box style={{ marginBottom: 24 }}>
        <Input
          variant="outline"
          size="lg"
          style={{
            borderColor: "#E5E7EB",
            borderWidth: 1,
            backgroundColor: "white",
            borderRadius: 12,
          }}
        >
          <InputField
            placeholder={t("notices.search")}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ fontSize: 16 }}
          />
        </Input>
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
          {t("user.quickActions")}
        </Text>
        <HStack space="md">
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              onPress={() => handleQuickAction(action.id)}
              style={{ flex: 1 }}
            >
              <Box
                style={{
                  backgroundColor: "white",
                  borderRadius: 12,
                  padding: 16,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#F3F4F6",
                }}
              >
                <Box
                  style={{
                    backgroundColor: `${action.color}15`,
                    borderRadius: 8,
                    padding: 8,
                    marginBottom: 8,
                  }}
                >
                  <action.icon size={20} color={action.color} />
                </Box>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#374151",
                    textAlign: "center",
                  }}
                >
                  {action.title}
                </Text>
              </Box>
            </TouchableOpacity>
          ))}
        </HStack>
      </Box>

      {/* Relevant Notices */}
      <Box style={{ marginBottom: 24 }}>
        <HStack
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#1F2937" }}>
            {t("user.relevantForYou")}
          </Text>
          <TouchableOpacity onPress={() => router.push("/user/notices")}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: Palette.primary,
              }}
            >
              {t("user.viewAll")}
            </Text>
          </TouchableOpacity>
        </HStack>
        <VStack space="sm">
          {filteredNotices
            .filter((notice) => notice.isRelevant)
            .slice(0, 2)
            .map((notice) => (
              <Card
                key={notice.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: 12,
                  padding: 16,
                  borderLeftWidth: 4,
                  borderLeftColor: Palette.primary,
                }}
              >
                <VStack space="xs">
                  <HStack
                    style={{
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: "#1F2937",
                        flex: 1,
                      }}
                    >
                      {notice.title}
                    </Text>
                    <Box
                      style={{
                        backgroundColor: "#EFF6FF",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 6,
                        marginLeft: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "600",
                          color: "#2563EB",
                        }}
                      >
                        {notice.category}
                      </Text>
                    </Box>
                  </HStack>
                  <Text
                    style={{ fontSize: 12, color: "#6B7280", lineHeight: 16 }}
                  >
                    {notice.description}
                  </Text>
                  <HStack
                    style={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <HStack space="xs" style={{ alignItems: "center" }}>
                      <MapPin size={12} color="#9CA3AF" />
                      <Text style={{ fontSize: 11, color: "#9CA3AF" }}>
                        {notice.location}
                      </Text>
                    </HStack>
                    <HStack space="xs" style={{ alignItems: "center" }}>
                      <Calendar size={12} color="#9CA3AF" />
                      <Text style={{ fontSize: 11, color: "#9CA3AF" }}>
                        Due: {notice.deadline}
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>
              </Card>
            ))}
        </VStack>
      </Box>

      {/* Recent Notices */}
      <Box>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#1F2937",
            marginBottom: 12,
          }}
        >
          {t("user.recentNotices")}
        </Text>
        <VStack space="sm">
          {filteredNotices.slice(0, 3).map((notice) => (
            <Card
              key={notice.id}
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <VStack space="xs">
                <HStack
                  style={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#1F2937",
                      flex: 1,
                    }}
                  >
                    {notice.title}
                  </Text>
                  <Box
                    style={{
                      backgroundColor: notice.isRelevant
                        ? "#DCFCE7"
                        : "#F3F4F6",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                      marginLeft: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "600",
                        color: notice.isRelevant ? "#16A34A" : "#6B7280",
                      }}
                    >
                      {notice.isRelevant ? t("user.relevant") : notice.category}
                    </Text>
                  </Box>
                </HStack>
                <Text
                  style={{ fontSize: 12, color: "#6B7280", lineHeight: 16 }}
                >
                  {notice.description.length > 80
                    ? `${notice.description.substring(0, 80)}...`
                    : notice.description}
                </Text>
                <HStack
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <HStack space="xs" style={{ alignItems: "center" }}>
                    <MapPin size={12} color="#9CA3AF" />
                    <Text style={{ fontSize: 11, color: "#9CA3AF" }}>
                      {notice.location}
                    </Text>
                  </HStack>
                  <TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "600",
                        color: Palette.primary,
                      }}
                    >
                      {t("user.readMore")}
                    </Text>
                  </TouchableOpacity>
                </HStack>
              </VStack>
            </Card>
          ))}
        </VStack>
      </Box>
    </ScrollView>
  );
}
