import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Spinner,
} from '@gluestack-ui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_CONFIG } from '@/constants/api';
import { Notice } from '@/types/admin';
import { Palette } from '@/constants/theme';
import { getRelativeTime } from '@/data/admin/mockData';

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: '#FCD34D', text: '#92400E' },
  published: { bg: '#59AC77', text: '#FFFFFF' },
  archived: { bg: '#9CA3AF', text: '#FFFFFF' },
};

export default function UserNoticeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotice();
  }, [id]);

  const fetchNotice = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_CONFIG.admin.notices}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch notice');
      const data = await response.json();
      const noticeData = data.notice || data;
      setNotice({
        ...noticeData,
        processingStatus: noticeData.processingStatus || 'pending',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const isImageUrl = (url?: string) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url) || url.includes('image');
  };

  const isPdfUrl = (url?: string) => {
    if (!url) return false;
    return /\.pdf$/i.test(url) || url.includes('pdf');
  };

  if (isLoading) {
    return (
      <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <Spinner size="large" color={Palette.primary} />
      </Box>
    );
  }

  if (error || !notice) {
    return (
      <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 20 }}>
        <Text style={{ color: '#991B1B', marginBottom: 16 }}>{error || 'Notice not found'}</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ backgroundColor: Palette.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </Box>
    );
  }

  const statusStyle = statusColors[notice.status] || statusColors.draft;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F9FAFB' }}
      contentContainerStyle={{ padding: 20, paddingTop: 50, paddingBottom: 40 }}
    >
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
        <Text style={{ color: Palette.primary, fontWeight: '600', fontSize: 16 }}>Back</Text>
      </TouchableOpacity>

      {/* Header */}
      <Box style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 20 }}>
        <Heading size="xl" style={{ color: '#1F2937', fontWeight: '800', marginBottom: 8 }}>
          {notice.title}
        </Heading>
        <HStack space="sm" style={{ flexWrap: 'wrap', marginBottom: 8 }}>
          <Box style={{ backgroundColor: statusStyle.bg, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: statusStyle.text, textTransform: 'capitalize' }}>
              {notice.status}
            </Text>
          </Box>
        </HStack>
        <Text style={{ color: '#6B7280', fontSize: 13 }}>
          Published {getRelativeTime(notice.createdAt)}
        </Text>
      </Box>

      {/* Document Preview */}
      {notice.url && (
        <Box style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 }}>
            Attached Document
          </Text>
          
          {isImageUrl(notice.url) ? (
            <Image
              source={{ uri: notice.url }}
              style={{
                width: '100%',
                height: 300,
                borderRadius: 12,
                backgroundColor: '#F3F4F6',
              }}
              resizeMode="contain"
            />
          ) : isPdfUrl(notice.url) ? (
            <TouchableOpacity
              onPress={() => Linking.openURL(notice.url!)}
              style={{
                backgroundColor: '#FEE2E2',
                padding: 20,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontWeight: '700', color: '#991B1B', marginBottom: 4 }}>PDF Document</Text>
              <Text style={{ color: '#6B7280', fontSize: 13 }}>Tap to open</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => Linking.openURL(notice.url!)}
              style={{
                backgroundColor: '#E0E7FF',
                padding: 20,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontWeight: '700', color: '#3730A3' }}>View Document</Text>
            </TouchableOpacity>
          )}
        </Box>
      )}

      {/* Description */}
      {notice.description && (
        <Box style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 8 }}>
            Description
          </Text>
          <Text style={{ color: '#4B5563', lineHeight: 22 }}>{notice.description}</Text>
        </Box>
      )}

      {/* Tags */}
      {notice.tags && notice.tags.length > 0 && (
        <Box style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 }}>
            Tags
          </Text>
          <HStack space="sm" style={{ flexWrap: 'wrap' }}>
            {notice.tags.map((tag, index) => (
              <Box
                key={index}
                style={{
                  backgroundColor: Palette.accent,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: '#1F2937', fontSize: 13, fontWeight: '600' }}>{tag}</Text>
              </Box>
            ))}
          </HStack>
        </Box>
      )}

      {/* Important Dates */}
      {(notice.effectiveFrom || notice.deadline) && (
        <Box style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 }}>
            Important Dates
          </Text>
          <VStack space="sm">
            {notice.effectiveFrom && (
              <HStack style={{ justifyContent: 'space-between' }}>
                <Text style={{ color: '#6B7280', fontSize: 14 }}>Effective From</Text>
                <Text style={{ color: '#1F2937', fontWeight: '600', fontSize: 14 }}>
                  {new Date(notice.effectiveFrom).toLocaleDateString()}
                </Text>
              </HStack>
            )}
            {notice.deadline && (
              <HStack style={{ justifyContent: 'space-between' }}>
                <Text style={{ color: '#6B7280', fontSize: 14 }}>Deadline</Text>
                <Text style={{ color: '#EF4444', fontWeight: '600', fontSize: 14 }}>
                  {new Date(notice.deadline).toLocaleDateString()}
                </Text>
              </HStack>
            )}
          </VStack>
        </Box>
      )}
    </ScrollView>
  );
}
