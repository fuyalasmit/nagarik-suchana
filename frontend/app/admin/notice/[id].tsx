import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Spinner,
  Input,
  InputField,
  Textarea,
  TextareaInput,
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

const processingColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#FCD34D', text: '#92400E' },
  processing: { bg: '#3B82F6', text: '#FFFFFF' },
  completed: { bg: '#10B981', text: '#FFFFFF' },
  failed: { bg: '#EF4444', text: '#FFFFFF' },
};

export default function NoticeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editStatus, setEditStatus] = useState('draft');

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
      const processedNotice = {
        ...noticeData,
        processingStatus: noticeData.processingStatus || 'pending',
      };
      setNotice(processedNotice);
      // Initialize edit form
      setEditTitle(processedNotice.title || '');
      setEditDescription(processedNotice.description || '');
      setEditTags(processedNotice.tags?.join(', ') || '');
      setEditStatus(processedNotice.status || 'draft');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editTitle.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    setIsSaving(true);
    try {
      // Send JSON - backend now supports both JSON and multipart
      const payload = {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        tags: editTags ? editTags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        status: editStatus,
      };

      const response = await fetch(`${API_CONFIG.admin.notices}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to update notice');

      const data = await response.json();
      const updatedNotice = data.notice || data;
      setNotice({
        ...updatedNotice,
        processingStatus: updatedNotice.processingStatus || 'pending',
      });
      setIsEditing(false);
      Alert.alert('Success', 'Notice updated successfully');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Notice',
      'Are you sure you want to delete this notice?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_CONFIG.admin.notices}/${id}`, {
                method: 'DELETE',
              });
              if (!response.ok) throw new Error('Failed to delete');
              router.back();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete notice');
            }
          },
        },
      ]
    );
  };

  const cancelEdit = () => {
    if (notice) {
      setEditTitle(notice.title || '');
      setEditDescription(notice.description || '');
      setEditTags(notice.tags?.join(', ') || '');
      setEditStatus(notice.status || 'draft');
    }
    setIsEditing(false);
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
  const processingStyle = processingColors[notice.processingStatus] || processingColors.pending;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F9FAFB' }}
      contentContainerStyle={{ padding: 20, paddingTop: 50, paddingBottom: 40 }}
    >
      {/* Header with Back and Actions */}
      <HStack style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: Palette.primary, fontWeight: '600', fontSize: 16 }}>Back</Text>
        </TouchableOpacity>
        <HStack space="sm">
          {isEditing ? (
            <>
              <TouchableOpacity
                onPress={cancelEdit}
                style={{ backgroundColor: '#E5E7EB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
              >
                <Text style={{ color: '#374151', fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                disabled={isSaving}
                style={{ backgroundColor: Palette.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>{isSaving ? 'Saving...' : 'Save'}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                style={{ backgroundColor: Palette.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                style={{ backgroundColor: '#EF4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>Delete</Text>
              </TouchableOpacity>
            </>
          )}
        </HStack>
      </HStack>

      {/* Title */}
      <Box style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 20 }}>
        {isEditing ? (
          <VStack space="md">
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>Title</Text>
            <Input variant="outline" size="lg" style={{ borderColor: '#E5E7EB' }}>
              <InputField
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Notice title"
              />
            </Input>
          </VStack>
        ) : (
          <>
            <Heading size="xl" style={{ color: '#1F2937', fontWeight: '800', marginBottom: 8 }}>
              {notice.title}
            </Heading>
            <HStack space="sm" style={{ flexWrap: 'wrap', marginBottom: 8 }}>
              <Box style={{ backgroundColor: statusStyle.bg, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: statusStyle.text, textTransform: 'capitalize' }}>
                  {notice.status}
                </Text>
              </Box>
              <Box style={{ backgroundColor: processingStyle.bg, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: processingStyle.text, textTransform: 'capitalize' }}>
                  OCR: {notice.processingStatus}
                </Text>
              </Box>
            </HStack>
            <Text style={{ color: '#6B7280', fontSize: 13 }}>
              Created {getRelativeTime(notice.createdAt)}
            </Text>
          </>
        )}
      </Box>

      {/* Status (Edit mode) */}
      {isEditing && (
        <Box style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 12 }}>Status</Text>
          <HStack space="sm">
            {['draft', 'published', 'archived'].map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setEditStatus(status)}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: editStatus === status ? Palette.primary : '#E5E7EB',
                  backgroundColor: editStatus === status ? Palette.accent : 'white',
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  textTransform: 'capitalize',
                  fontWeight: editStatus === status ? '700' : '500',
                  color: editStatus === status ? '#1F2937' : '#6B7280',
                }}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </HStack>
        </Box>
      )}

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
              <Text style={{ color: '#6B7280', fontSize: 13 }}>Tap to open in browser</Text>
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
      <Box style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 8 }}>
          Description
        </Text>
        {isEditing ? (
          <Textarea size="lg" style={{ borderColor: '#E5E7EB', minHeight: 100 }}>
            <TextareaInput
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="Enter description..."
            />
          </Textarea>
        ) : (
          <Text style={{ color: '#4B5563', lineHeight: 22 }}>
            {notice.description || 'No description'}
          </Text>
        )}
      </Box>

      {/* Tags */}
      <Box style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 }}>
          Tags
        </Text>
        {isEditing ? (
          <VStack>
            <Input variant="outline" size="lg" style={{ borderColor: '#E5E7EB' }}>
              <InputField
                value={editTags}
                onChangeText={setEditTags}
                placeholder="education, health, community"
              />
            </Input>
            <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>
              Separate tags with commas
            </Text>
          </VStack>
        ) : notice.tags && notice.tags.length > 0 ? (
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
        ) : (
          <Text style={{ color: '#9CA3AF' }}>No tags</Text>
        )}
      </Box>

      {/* OCR Extracted Text */}
      {notice.ocrText && (
        <Box style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <HStack style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937' }}>
              OCR Extracted Text
            </Text>
            {notice.ocrConfidence !== undefined && (
              <Box style={{ backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#065F46' }}>
                  {(notice.ocrConfidence * 100).toFixed(0)}% confidence
                </Text>
              </Box>
            )}
          </HStack>
          <Box
            style={{
              backgroundColor: '#F9FAFB',
              padding: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E5E7EB',
            }}
          >
            <Text style={{ color: '#374151', fontSize: 14, lineHeight: 20 }}>
              {notice.ocrText}
            </Text>
          </Box>
        </Box>
      )}

      {/* AI Extracted Fields */}
      {notice.extractedFields && Object.keys(notice.extractedFields).length > 0 && (
        <Box style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 }}>
            AI Extracted Fields
          </Text>
          <VStack space="sm">
            {Object.entries(notice.extractedFields).map(([key, value]) => (
              <HStack key={key} style={{ justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                <Text style={{ color: '#6B7280', fontSize: 14, textTransform: 'capitalize' }}>
                  {key.replace(/_/g, ' ')}
                </Text>
                <Text style={{ color: '#1F2937', fontWeight: '600', fontSize: 14, maxWidth: '60%', textAlign: 'right' }}>
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      )}

      {/* Location Info */}
      {(notice.province || notice.district || notice.municipality || notice.ward) && (
        <Box style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 }}>
            Location
          </Text>
          <VStack space="sm">
            {notice.province && (
              <HStack style={{ justifyContent: 'space-between' }}>
                <Text style={{ color: '#6B7280', fontSize: 14 }}>Province</Text>
                <Text style={{ color: '#1F2937', fontWeight: '600', fontSize: 14 }}>{notice.province}</Text>
              </HStack>
            )}
            {notice.district && (
              <HStack style={{ justifyContent: 'space-between' }}>
                <Text style={{ color: '#6B7280', fontSize: 14 }}>District</Text>
                <Text style={{ color: '#1F2937', fontWeight: '600', fontSize: 14 }}>{notice.district}</Text>
              </HStack>
            )}
            {notice.municipality && (
              <HStack style={{ justifyContent: 'space-between' }}>
                <Text style={{ color: '#6B7280', fontSize: 14 }}>Municipality</Text>
                <Text style={{ color: '#1F2937', fontWeight: '600', fontSize: 14 }}>{notice.municipality}</Text>
              </HStack>
            )}
            {notice.ward && (
              <HStack style={{ justifyContent: 'space-between' }}>
                <Text style={{ color: '#6B7280', fontSize: 14 }}>Ward</Text>
                <Text style={{ color: '#1F2937', fontWeight: '600', fontSize: 14 }}>{notice.ward}</Text>
              </HStack>
            )}
          </VStack>
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
