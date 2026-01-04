import React, { useState, useMemo } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Box, VStack, HStack, Heading, Text } from '@gluestack-ui/themed';
import { GrievanceCard } from '@/components/admin/GrievanceCard';
import { grievances, AdminColors } from '@/data/admin/mockData';
import { GrievanceStatus } from '@/types/admin';

const Colors = AdminColors;

type FilterType = 'all' | GrievanceStatus;

export default function GrievancesScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'resolved', label: 'Resolved' },
  ];

  const filteredGrievances = useMemo(() => {
    if (activeFilter === 'all') return grievances;
    return grievances.filter((g) => g.status === activeFilter);
  }, [activeFilter]);

  const unreadCount = grievances.filter((g) => !g.isRead).length;

  const handleGrievancePress = (id: string) => {
    console.log('Grievance pressed:', id);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F9FAFB' }}
      contentContainerStyle={{ padding: 20, paddingTop: 50, paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <HStack style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <VStack>
          <Heading size="2xl" style={{ color: '#1F2937', fontWeight: '800' }}>
            Grievances
          </Heading>
          <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>
            Citizen complaints and requests
          </Text>
        </VStack>
        {unreadCount > 0 && (
          <Box
            style={{
              backgroundColor: Colors.accent,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: 'white' }}>
              {unreadCount} New
            </Text>
          </Box>
        )}
      </HStack>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 20 }}
        contentContainerStyle={{ paddingRight: 20 }}
      >
        <HStack space="sm">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            const count =
              filter.key === 'all'
                ? grievances.length
                : grievances.filter((g) => g.status === filter.key).length;

            return (
              <TouchableOpacity
                key={filter.key}
                onPress={() => setActiveFilter(filter.key)}
                activeOpacity={0.7}
              >
                <Box
                  style={{
                    backgroundColor: isActive ? Colors.primary : 'white',
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 20,
                  }}
                >
                  <HStack style={{ alignItems: 'center' }} space="xs">
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '700',
                        color: isActive ? 'white' : '#6B7280',
                      }}
                    >
                      {filter.label}
                    </Text>
                    <Box
                      style={{
                        backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : '#F3F4F6',
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: '700',
                          color: isActive ? 'white' : '#9CA3AF',
                        }}
                      >
                        {count}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              </TouchableOpacity>
            );
          })}
        </HStack>
      </ScrollView>

      {/* Grievance List */}
      {filteredGrievances.length > 0 ? (
        <VStack>
          {filteredGrievances.map((grievance) => (
            <GrievanceCard
              key={grievance.id}
              grievance={grievance}
              onPress={handleGrievancePress}
            />
          ))}
        </VStack>
      ) : (
        <Box
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 40,
            alignItems: 'center',
          }}
        >
          <Box
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: Colors.accentLight,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 24, color: Colors.primaryDark }}>0</Text>
          </Box>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 4 }}>
            No Grievances Found
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>
            There are no grievances matching the selected filter.
          </Text>
        </Box>
      )}
    </ScrollView>
  );
}
