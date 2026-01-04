import React from 'react';
import { Box, Text, VStack } from '@gluestack-ui/themed';
import { TouchableOpacity } from 'react-native';
import { FilePlus, List, Users, Settings } from 'lucide-react-native';
import { QuickActionButtonProps } from '@/types/admin';

const Colors = {
  primary: '#59AC77',
  primaryDark: '#3A6F43',
  accent: '#FDAAAA',
  accentLight: '#FFD5D5',
};

const getIcon = (iconName: string) => {
  const size = 24;
  const color = Colors.primaryDark;
  
  switch (iconName) {
    case 'new':
      return <FilePlus size={size} color={color} />;
    case 'list':
      return <List size={size} color={color} />;
    case 'users':
      return <Users size={size} color={color} />;
    case 'settings':
      return <Settings size={size} color={color} />;
    default:
      return <FilePlus size={size} color={color} />;
  }
};

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon,
  label,
  onPress,
  color = Colors.accentLight,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ flex: 1 }}>
      <VStack
        style={{
          backgroundColor: color,
          borderRadius: 16,
          padding: 16,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 90,
        }}
      >
        <Box style={{ marginBottom: 8 }}>
          {getIcon(icon)}
        </Box>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '700',
            color: '#1F2937',
            textAlign: 'center',
          }}
          numberOfLines={2}
        >
          {label}
        </Text>
      </VStack>
    </TouchableOpacity>
  );
};

export default QuickActionButton;
