import React from 'react';
import { Box, Text, HStack, VStack } from '@gluestack-ui/themed';
import { Users, MapPin, Smartphone, Megaphone, TrendingUp, TrendingDown } from 'lucide-react-native';
import { StatCardProps } from '@/types/admin';

const Colors = {
  primary: '#59AC77',
  primaryDark: '#3A6F43',
  accent: '#FDAAAA',
  accentLight: '#FFD5D5',
};

const getIcon = (iconName: string, color: string) => {
  const size = 24;
  switch (iconName) {
    case 'users':
      return <Users size={size} color={color} />;
    case 'map':
      return <MapPin size={size} color={color} />;
    case 'phone':
      return <Smartphone size={size} color={color} />;
    case 'megaphone':
      return <Megaphone size={size} color={color} />;
    default:
      return <Users size={size} color={color} />;
  }
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = Colors.primary,
}) => {
  return (
    <Box
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        flex: 1,
        minWidth: 140,
      }}
    >
      <HStack style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: color + '20',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {getIcon(icon, color)}
        </Box>
        {trend && (
          <HStack
            style={{
              backgroundColor: trend.isPositive ? '#D1FAE5' : '#FFD5D5',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            {trend.isPositive ? (
              <TrendingUp size={12} color={Colors.primaryDark} />
            ) : (
              <TrendingDown size={12} color={Colors.accent} />
            )}
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                color: trend.isPositive ? Colors.primaryDark : '#991B1B',
                marginLeft: 4,
              }}
            >
              {Math.abs(trend.value)}%
            </Text>
          </HStack>
        )}
      </HStack>
      <VStack style={{ marginTop: 12 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: '800',
            color: '#1F2937',
          }}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: '#6B7280',
            marginTop: 2,
          }}
        >
          {title}
        </Text>
      </VStack>
    </Box>
  );
};

export default StatCard;
