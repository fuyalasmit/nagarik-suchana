import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, HStack, Text, VStack } from '@gluestack-ui/themed';
import { NoticeCardProps } from '@/types/admin';
import { getRelativeTime } from '@/data/admin/mockData';

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: '#FCD34D', text: '#92400E' },
  published: { bg: '#59AC77', text: '#FFFFFF' },
  archived: { bg: '#9CA3AF', text: '#FFFFFF' },
};

const processingColors: Record<string, string> = {
  pending: '#F59E0B',
  processing: '#3B82F6',
  completed: '#10B981',
  failed: '#EF4444',
};

export function NoticeCard({ notice, onPress }: NoticeCardProps) {
  const statusStyle = statusColors[notice.status] || statusColors.draft;
  const processingColor = processingColors[notice.processingStatus] || '#9CA3AF';

  return (
    <TouchableOpacity
      onPress={() => onPress(notice.id)}
      activeOpacity={0.7}
      style={{
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
      }}
    >
      <HStack style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <VStack style={{ flex: 1, marginRight: 12 }}>
          <HStack style={{ alignItems: 'center', marginBottom: 4 }}>
            {notice.url && (
              <Box
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#3B82F6',
                  marginRight: 8,
                }}
              />
            )}
            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                color: '#1F2937',
                flex: 1,
              }}
              numberOfLines={1}
            >
              {notice.title}
            </Text>
          </HStack>
          <HStack style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>
              {getRelativeTime(notice.createdAt)}
            </Text>
            {notice.processingStatus && (
              <Box
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: processingColor,
                  marginLeft: 8,
                }}
              />
            )}
          </HStack>
        </VStack>

        <Box
          style={{
            backgroundColor: statusStyle.bg,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: '700',
              color: statusStyle.text,
              textTransform: 'capitalize',
            }}
          >
            {notice.status}
          </Text>
        </Box>
      </HStack>
    </TouchableOpacity>
  );
}
