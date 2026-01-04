import React, { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { 
  Box, 
  VStack, 
  HStack, 
  Heading, 
  Text, 
  Input,
  InputField,
  Card,
  Button,
  ButtonText
} from '@gluestack-ui/themed';
import { Search, Filter, MapPin, Calendar, Clock } from 'lucide-react-native';
import { Palette } from '@/constants/theme';

// Mock notices data
const mockNotices = [
  {
    id: '1',
    title: 'Job Vacancy - Health Assistant',
    description: 'Bharatpur Metropolitan City is seeking qualified candidates for Health Assistant positions. Candidates must have completed Health Assistant training from recognized institutions.',
    category: 'Job Vacancy',
    deadline: '2026-02-15',
    location: 'Bharatpur Metropolitan',
    publishedDate: '2026-01-02',
    isRelevant: true,
    requirements: ['Health Assistant Certificate', 'Minimum 2 years experience', 'Age 21-35'],
  },
  {
    id: '2',
    title: 'Road Maintenance Notice',
    description: 'Scheduled road maintenance work will be conducted on Main Road from January 10-15. Traffic will be diverted during working hours.',
    category: 'Infrastructure',
    deadline: '2026-01-15',
    location: 'Ward 5',
    publishedDate: '2026-01-01',
    isRelevant: false,
  },
  {
    id: '3',
    title: 'Water Supply Disruption',
    description: 'Water supply will be temporarily disrupted for maintenance work on the main pipeline. Alternative arrangements have been made.',
    category: 'Public Service',
    deadline: '2026-01-08',
    location: 'Ward 3, 4',
    publishedDate: '2025-12-30',
    isRelevant: true,
  },
  {
    id: '4',
    title: 'Tax Collection Notice',
    description: 'Annual property tax collection has started. Citizens can pay online or visit the municipal office.',
    category: 'Tax & Revenue',
    deadline: '2026-03-31',
    location: 'All Wards',
    publishedDate: '2026-01-01',
    isRelevant: false,
  },
  {
    id: '5',
    title: 'Scholarship Program',
    description: 'Merit-based scholarship program for students from economically disadvantaged families.',
    category: 'Education',
    deadline: '2026-02-28',
    location: 'All Wards',
    publishedDate: '2025-12-28',
    isRelevant: true,
  },
];

const categories = ['All', 'Job Vacancy', 'Infrastructure', 'Public Service', 'Tax & Revenue', 'Education'];

export default function NoticesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showRelevantOnly, setShowRelevantOnly] = useState(false);

  const filteredNotices = mockNotices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notice.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || notice.category === selectedCategory;
    const matchesRelevance = !showRelevantOnly || notice.isRelevant;
    
    return matchesSearch && matchesCategory && matchesRelevance;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      'Job Vacancy': '#3B82F6',
      'Infrastructure': '#EF4444',
      'Public Service': '#10B981',
      'Tax & Revenue': '#F59E0B',
      'Education': '#8B5CF6',
    };
    return colors[category as keyof typeof colors] || '#6B7280';
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F9FAFB' }}
      contentContainerStyle={{ padding: 20, paddingTop: 50, paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <VStack style={{ marginBottom: 24 }}>
        <Heading
          size="2xl"
          style={{ color: '#1F2937', fontWeight: '800', marginBottom: 4 }}
        >
          All Notices
        </Heading>
        <Text style={{ fontSize: 14, color: '#6B7280' }}>
          Browse all community notices and announcements
        </Text>
      </VStack>

      {/* Search and Filters */}
      <VStack style={{ marginBottom: 24 }} space="md">
        {/* Search Bar */}
        <Input 
          variant="outline" 
          size="lg"
          style={{ 
            borderColor: '#E5E7EB', 
            borderWidth: 1,
            backgroundColor: 'white',
            borderRadius: 12
          }}
        >
          <InputField
            placeholder="Search notices..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ fontSize: 16 }}
          />
        </Input>

        {/* Filter Buttons */}
        <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant={showRelevantOnly ? 'solid' : 'outline'}
            size="sm"
            onPress={() => setShowRelevantOnly(!showRelevantOnly)}
            style={{
              backgroundColor: showRelevantOnly ? Palette.primary : 'white',
              borderColor: Palette.primary,
              borderRadius: 8,
            }}
          >
            <ButtonText style={{ 
              color: showRelevantOnly ? 'white' : Palette.primary,
              fontSize: 12,
              fontWeight: '600'
            }}>
              Relevant for Me
            </ButtonText>
          </Button>
          <Text style={{ fontSize: 12, color: '#6B7280' }}>
            {filteredNotices.length} notices found
          </Text>
        </HStack>

        {/* Category Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack space="xs">
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
              >
                <Box
                  style={{
                    backgroundColor: selectedCategory === category ? Palette.primary : 'white',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: selectedCategory === category ? Palette.primary : '#E5E7EB',
                  }}
                >
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: selectedCategory === category ? 'white' : '#6B7280',
                  }}>
                    {category}
                  </Text>
                </Box>
              </TouchableOpacity>
            ))}
          </HStack>
        </ScrollView>
      </VStack>

      {/* Notices List */}
      <VStack space="md">
        {filteredNotices.map((notice) => (
          <Card
            key={notice.id}
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 16,
              borderLeftWidth: 4,
              borderLeftColor: notice.isRelevant ? Palette.primary : '#E5E7EB',
            }}
          >
            <VStack space="sm">
              {/* Header */}
              <HStack style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <VStack style={{ flex: 1, marginRight: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937' }}>
                    {notice.title}
                  </Text>
                  {notice.isRelevant && (
                    <Box
                      style={{
                        backgroundColor: '#DCFCE7',
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 4,
                        alignSelf: 'flex-start',
                        marginTop: 4,
                      }}
                    >
                      <Text style={{ fontSize: 10, fontWeight: '600', color: '#16A34A' }}>
                        Relevant for You
                      </Text>
                    </Box>
                  )}
                </VStack>
                <Box
                  style={{
                    backgroundColor: `${getCategoryColor(notice.category)}15`,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ 
                    fontSize: 10, 
                    fontWeight: '600', 
                    color: getCategoryColor(notice.category)
                  }}>
                    {notice.category}
                  </Text>
                </Box>
              </HStack>

              {/* Description */}
              <Text style={{ fontSize: 13, color: '#6B7280', lineHeight: 18 }}>
                {notice.description}
              </Text>

              {/* Requirements (if any) */}
              {notice.requirements && (
                <VStack space="xs">
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151' }}>
                    Requirements:
                  </Text>
                  {notice.requirements.map((req, index) => (
                    <Text key={index} style={{ fontSize: 11, color: '#6B7280', marginLeft: 8 }}>
                      • {req}
                    </Text>
                  ))}
                </VStack>
              )}

              {/* Footer Info */}
              <VStack space="xs" style={{ marginTop: 8 }}>
                <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <HStack space="xs" style={{ alignItems: 'center' }}>
                    <MapPin size={12} color="#9CA3AF" />
                    <Text style={{ fontSize: 11, color: '#9CA3AF' }}>
                      {notice.location}
                    </Text>
                  </HStack>
                  <HStack space="xs" style={{ alignItems: 'center' }}>
                    <Clock size={12} color="#9CA3AF" />
                    <Text style={{ fontSize: 11, color: '#9CA3AF' }}>
                      Published: {notice.publishedDate}
                    </Text>
                  </HStack>
                </HStack>
                <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <HStack space="xs" style={{ alignItems: 'center' }}>
                    <Calendar size={12} color="#EF4444" />
                    <Text style={{ fontSize: 11, color: '#EF4444', fontWeight: '600' }}>
                      Deadline: {notice.deadline}
                    </Text>
                  </HStack>
                  <TouchableOpacity>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: Palette.primary }}>
                      View Details
                    </Text>
                  </TouchableOpacity>
                </HStack>
              </VStack>
            </VStack>
          </Card>
        ))}
      </VStack>

      {filteredNotices.length === 0 && (
        <Box style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ fontSize: 16, color: '#6B7280', textAlign: 'center' }}>
            No notices found matching your criteria
          </Text>
          <Text style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginTop: 4 }}>
            Try adjusting your search or filters
          </Text>
        </Box>
      )}
    </ScrollView>
  );
}