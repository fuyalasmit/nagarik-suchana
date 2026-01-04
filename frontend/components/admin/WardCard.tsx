import React, { useState } from 'react';
import { Box, Text, HStack, VStack } from '@gluestack-ui/themed';
import { TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { WardCardProps } from '@/types/admin';
import { formatNepaliCurrency } from '@/data/admin/mockData';

const Colors = {
  primary: '#59AC77',
  primaryDark: '#3A6F43',
  accent: '#FDAAAA',
  accentLight: '#FFD5D5',
};

export const WardCard: React.FC<WardCardProps> = ({ ward, onPress }) => {
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    setExpanded(!expanded);
    onPress?.(ward.wardNumber);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Box
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
        }}
      >
        <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <HStack style={{ alignItems: 'center' }}>
            <Box
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: Colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '800', color: 'white' }}>
                {ward.wardNumber}
              </Text>
            </Box>
            <VStack>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#1F2937' }}>
                Ward {ward.wardNumber}
              </Text>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>{ward.name}</Text>
            </VStack>
          </HStack>
          <HStack style={{ alignItems: 'center' }}>
            <VStack style={{ alignItems: 'flex-end', marginRight: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1F2937' }}>
                {ward.population.toLocaleString()}
              </Text>
              <Text style={{ fontSize: 11, color: '#9CA3AF' }}>Population</Text>
            </VStack>
            {expanded ? (
              <ChevronUp size={18} color="#9CA3AF" />
            ) : (
              <ChevronDown size={18} color="#9CA3AF" />
            )}
          </HStack>
        </HStack>

        {expanded && (
          <VStack style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
            <HStack style={{ justifyContent: 'space-between' }}>
              <Box style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: Colors.accent }}>
                  {ward.grievanceCount}
                </Text>
                <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>Grievances</Text>
              </Box>
              <Box style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: Colors.primaryDark }}>
                  {ward.activeNotices}
                </Text>
                <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>Notices</Text>
              </Box>
              <Box style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: Colors.primary }}>
                  {formatNepaliCurrency(ward.budgetAllocated)}
                </Text>
                <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>Budget</Text>
              </Box>
            </HStack>
          </VStack>
        )}
      </Box>
    </TouchableOpacity>
  );
};

export default WardCard;
