import React from 'react';
import { Box, Text, HStack, VStack } from '@gluestack-ui/themed';
import { 
  Megaphone, 
  CheckCircle, 
  User, 
  AlertTriangle, 
  DollarSign, 
  Edit, 
  Settings, 
  ClipboardList 
} from 'lucide-react-native';
import { ActivityItemProps } from '@/types/admin';
import { getRelativeTime } from '@/data/admin/mockData';

const Colors = {
  primary: '#59AC77',
  primaryDark: '#3A6F43',
  accent: '#FDAAAA',
  accentLight: '#FFD5D5',
};

const getActivityIcon = (iconType: string) => {
  const size = 18;
  const color = Colors.primaryDark;
  
  switch (iconType) {
    case 'notice':
      return <Megaphone size={size} color={color} />;
    case 'check':
      return <CheckCircle size={size} color={Colors.primary} />;
    case 'user':
      return <User size={size} color={color} />;
    case 'alert':
      return <AlertTriangle size={size} color={Colors.accent} />;
    case 'budget':
      return <DollarSign size={size} color={color} />;
    case 'edit':
      return <Edit size={size} color={color} />;
    case 'system':
      return <Settings size={size} color="#6B7280" />;
    case 'assign':
      return <ClipboardList size={size} color={color} />;
    default:
      return <Megaphone size={size} color={color} />;
  }
};

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  return (
    <HStack
      style={{
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        alignItems: 'flex-start',
      }}
    >
      <Box
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: Colors.accentLight,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}
      >
        {getActivityIcon(activity.icon)}
      </Box>
      <VStack style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#1F2937',
          }}
        >
          {activity.title}
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: '#6B7280',
            marginTop: 2,
          }}
          numberOfLines={2}
        >
          {activity.description}
        </Text>
      </VStack>
      <Text
        style={{
          fontSize: 12,
          color: '#9CA3AF',
          marginLeft: 8,
        }}
      >
        {getRelativeTime(activity.timestamp)}
      </Text>
    </HStack>
  );
};

export default ActivityItem;
