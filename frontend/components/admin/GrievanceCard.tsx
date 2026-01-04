import React, { useState } from 'react';
import { Box, Text, HStack, VStack } from '@gluestack-ui/themed';
import { TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { GrievanceCardProps } from '@/types/admin';
import { getPriorityColor, getStatusColor, getRelativeTime } from '@/data/admin/mockData';

const Colors = {
  primary: '#59AC77',
  primaryDark: '#3A6F43',
  accent: '#FDAAAA',
  accentLight: '#FFD5D5',
};

export const GrievanceCard: React.FC<GrievanceCardProps> = ({
  grievance,
  onPress,
  isCompact = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    if (!isCompact) {
      setExpanded(!expanded);
    }
    onPress(grievance.id);
  };

  const priorityColor = getPriorityColor(grievance.priority);
  const statusColor = getStatusColor(grievance.status);

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Box
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 16,
          borderLeftWidth: 4,
          borderLeftColor: priorityColor,
          marginBottom: 12,
        }}
      >
        <HStack style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <VStack style={{ flex: 1, marginRight: 12 }}>
            <HStack style={{ alignItems: 'center', marginBottom: 4 }}>
              {!grievance.isRead && (
                <Box
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: Colors.accent,
                    marginRight: 8,
                  }}
                />
              )}
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '700',
                  color: '#1F2937',
                  flex: 1,
                }}
                numberOfLines={isCompact ? 1 : undefined}
              >
                {grievance.title}
              </Text>
            </HStack>
            <HStack style={{ alignItems: 'center', marginTop: 4 }}>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>
                Ward {grievance.wardNumber}
              </Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginHorizontal: 8 }}>•</Text>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>
                {getRelativeTime(grievance.submittedAt)}
              </Text>
            </HStack>
          </VStack>
          <VStack style={{ alignItems: 'flex-end' }}>
            <Box
              style={{
                backgroundColor: statusColor,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: grievance.status === 'pending' ? '#92400E' : 'white',
                  textTransform: 'capitalize',
                }}
              >
                {grievance.status.replace('-', ' ')}
              </Text>
            </Box>
            <Box
              style={{
                marginTop: 6,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 8,
                backgroundColor: priorityColor + '30',
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '600',
                  color: '#1F2937',
                  textTransform: 'uppercase',
                }}
              >
                {grievance.priority}
              </Text>
            </Box>
          </VStack>
        </HStack>

        {expanded && !isCompact && (
          <VStack style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
            <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 20 }}>
              {grievance.description}
            </Text>
            <HStack style={{ marginTop: 12, flexWrap: 'wrap' }}>
              <Box style={{ marginRight: 16, marginBottom: 8 }}>
                <Text style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>Category</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', textTransform: 'capitalize' }}>
                  {grievance.category}
                </Text>
              </Box>
              <Box style={{ marginRight: 16, marginBottom: 8 }}>
                <Text style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>Submitted By</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151' }}>
                  {grievance.submittedBy}
                </Text>
              </Box>
              <Box style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>Last Updated</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151' }}>
                  {getRelativeTime(grievance.updatedAt)}
                </Text>
              </Box>
            </HStack>
          </VStack>
        )}

        {!isCompact && (
          <HStack style={{ justifyContent: 'center', marginTop: 8 }}>
            {expanded ? (
              <ChevronUp size={16} color="#9CA3AF" />
            ) : (
              <ChevronDown size={16} color="#9CA3AF" />
            )}
          </HStack>
        )}
      </Box>
    </TouchableOpacity>
  );
};

export default GrievanceCard;
