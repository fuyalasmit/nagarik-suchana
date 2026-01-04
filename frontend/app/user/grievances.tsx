import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Alert } from 'react-native';
import { 
  Box, 
  VStack, 
  HStack, 
  Heading, 
  Text, 
  Input,
  InputField,
  Button,
  ButtonText,
  Card,
  Textarea,
  TextareaInput,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@gluestack-ui/themed';
import { Plus, Search, MapPin, Calendar, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react-native';
import { Palette } from '@/constants/theme';

// Mock grievances data
const mockGrievances = [
  {
    id: 'g1',
    title: 'Street Light Not Working',
    description: 'The street light near my house has been broken for 2 weeks. It creates safety issues during night time.',
    category: 'infrastructure',
    priority: 'medium',
    status: 'in-progress',
    submittedDate: '2026-01-01',
    wardNumber: 5,
    location: 'Main Road, Ward 5',
    response: 'Maintenance team has been notified. Work will be completed within 3 days.',
  },
  {
    id: 'g2',
    title: 'Garbage Collection Issue',
    description: 'Garbage has not been collected from our area for the past week. The smell is becoming unbearable.',
    category: 'sanitation',
    priority: 'high',
    status: 'pending',
    submittedDate: '2026-01-03',
    wardNumber: 3,
    location: 'Residential Area, Ward 3',
  },
  {
    id: 'g3',
    title: 'Water Supply Problem',
    description: 'No water supply for the past 3 days in our locality. Need immediate attention.',
    category: 'utilities',
    priority: 'high',
    status: 'resolved',
    submittedDate: '2025-12-28',
    wardNumber: 7,
    location: 'Housing Colony, Ward 7',
    response: 'Pipeline repair completed. Water supply restored.',
    resolvedDate: '2026-01-02',
  },
];

const categories = [
  { label: 'Infrastructure', value: 'infrastructure' },
  { label: 'Sanitation', value: 'sanitation' },
  { label: 'Utilities', value: 'utilities' },
  { label: 'Transportation', value: 'transportation' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Other', value: 'other' },
];

const priorities = [
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

export default function GrievancesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newGrievance, setNewGrievance] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    location: '',
    wardNumber: '',
  });

  const filteredGrievances = mockGrievances.filter(grievance =>
    grievance.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    grievance.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'in-progress': return '#3B82F6';
      case 'resolved': return '#10B981';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return AlertCircle;
      case 'in-progress': return Clock;
      case 'resolved': return CheckCircle;
      case 'rejected': return XCircle;
      default: return AlertCircle;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const handleSubmitGrievance = async () => {
    if (!newGrievance.title || !newGrievance.description || !newGrievance.category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/grievances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add authorization header with user token
        },
        body: JSON.stringify({
          title: newGrievance.title,
          description: newGrievance.description,
          category: newGrievance.category,
          priority: newGrievance.priority,
          location: newGrievance.location,
          wardNumber: newGrievance.wardNumber ? parseInt(newGrievance.wardNumber) : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit grievance');
      }

      Alert.alert('Success', 'Your grievance has been submitted successfully!');
      setShowModal(false);
      setNewGrievance({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        location: '',
        wardNumber: '',
      });
      
      // TODO: Refresh grievances list
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to submit grievance');
    }
  };

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: '#F9FAFB' }}
        contentContainerStyle={{ padding: 20, paddingTop: 50, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <VStack style={{ marginBottom: 24 }}>
          <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <VStack>
              <Heading
                size="2xl"
                style={{ color: '#1F2937', fontWeight: '800' }}
              >
                My Grievances
              </Heading>
              <Text style={{ fontSize: 14, color: '#6B7280' }}>
                Track and manage your submitted grievances
              </Text>
            </VStack>
            <TouchableOpacity onPress={() => setShowModal(true)}>
              <Box
                style={{
                  backgroundColor: Palette.primary,
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <Plus size={20} color="white" />
              </Box>
            </TouchableOpacity>
          </HStack>
        </VStack>

        {/* Search Bar */}
        <Box style={{ marginBottom: 24 }}>
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
              placeholder="Search grievances..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ fontSize: 16 }}
            />
          </Input>
        </Box>

        {/* Stats */}
        <HStack style={{ marginBottom: 24 }} space="md">
          <Box style={{ flex: 1, backgroundColor: 'white', borderRadius: 12, padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#F59E0B' }}>
              {mockGrievances.filter(g => g.status === 'pending').length}
            </Text>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>Pending</Text>
          </Box>
          <Box style={{ flex: 1, backgroundColor: 'white', borderRadius: 12, padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#3B82F6' }}>
              {mockGrievances.filter(g => g.status === 'in-progress').length}
            </Text>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>In Progress</Text>
          </Box>
          <Box style={{ flex: 1, backgroundColor: 'white', borderRadius: 12, padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#10B981' }}>
              {mockGrievances.filter(g => g.status === 'resolved').length}
            </Text>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>Resolved</Text>
          </Box>
        </HStack>

        {/* Grievances List */}
        <VStack space="md">
          {filteredGrievances.map((grievance) => {
            const StatusIcon = getStatusIcon(grievance.status);
            return (
              <Card
                key={grievance.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 12,
                  padding: 16,
                  borderLeftWidth: 4,
                  borderLeftColor: getStatusColor(grievance.status),
                }}
              >
                <VStack space="sm">
                  {/* Header */}
                  <HStack style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <VStack style={{ flex: 1, marginRight: 12 }}>
                      <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937' }}>
                        {grievance.title}
                      </Text>
                      <HStack space="xs" style={{ alignItems: 'center', marginTop: 4 }}>
                        <Box
                          style={{
                            backgroundColor: `${getPriorityColor(grievance.priority)}15`,
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 4,
                          }}
                        >
                          <Text style={{ 
                            fontSize: 10, 
                            fontWeight: '600', 
                            color: getPriorityColor(grievance.priority)
                          }}>
                            {grievance.priority.toUpperCase()}
                          </Text>
                        </Box>
                        <Text style={{ fontSize: 10, color: '#9CA3AF' }}>•</Text>
                        <Text style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'capitalize' }}>
                          {grievance.category}
                        </Text>
                      </HStack>
                    </VStack>
                    <HStack space="xs" style={{ alignItems: 'center' }}>
                      <StatusIcon size={16} color={getStatusColor(grievance.status)} />
                      <Text style={{ 
                        fontSize: 12, 
                        fontWeight: '600', 
                        color: getStatusColor(grievance.status),
                        textTransform: 'capitalize'
                      }}>
                        {grievance.status.replace('-', ' ')}
                      </Text>
                    </HStack>
                  </HStack>

                  {/* Description */}
                  <Text style={{ fontSize: 13, color: '#6B7280', lineHeight: 18 }}>
                    {grievance.description}
                  </Text>

                  {/* Response (if any) */}
                  {grievance.response && (
                    <Box
                      style={{
                        backgroundColor: '#F0F9FF',
                        padding: 12,
                        borderRadius: 8,
                        borderLeftWidth: 3,
                        borderLeftColor: '#3B82F6',
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '600', color: '#1E40AF', marginBottom: 4 }}>
                        Official Response:
                      </Text>
                      <Text style={{ fontSize: 12, color: '#1E40AF' }}>
                        {grievance.response}
                      </Text>
                    </Box>
                  )}

                  {/* Footer Info */}
                  <VStack space="xs" style={{ marginTop: 8 }}>
                    <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <HStack space="xs" style={{ alignItems: 'center' }}>
                        <MapPin size={12} color="#9CA3AF" />
                        <Text style={{ fontSize: 11, color: '#9CA3AF' }}>
                          {grievance.location}
                        </Text>
                      </HStack>
                      <HStack space="xs" style={{ alignItems: 'center' }}>
                        <Calendar size={12} color="#9CA3AF" />
                        <Text style={{ fontSize: 11, color: '#9CA3AF' }}>
                          Submitted: {grievance.submittedDate}
                        </Text>
                      </HStack>
                    </HStack>
                    {grievance.resolvedDate && (
                      <HStack style={{ justifyContent: 'flex-end' }}>
                        <HStack space="xs" style={{ alignItems: 'center' }}>
                          <CheckCircle size={12} color="#10B981" />
                          <Text style={{ fontSize: 11, color: '#10B981', fontWeight: '600' }}>
                            Resolved: {grievance.resolvedDate}
                          </Text>
                        </HStack>
                      </HStack>
                    )}
                  </VStack>
                </VStack>
              </Card>
            );
          })}
        </VStack>

        {filteredGrievances.length === 0 && (
          <Box style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ fontSize: 16, color: '#6B7280', textAlign: 'center' }}>
              No grievances found
            </Text>
            <Text style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginTop: 4 }}>
              Submit your first grievance using the + button
            </Text>
          </Box>
        )}
      </ScrollView>

      {/* Submit Grievance Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalBackdrop />
        <ModalContent style={{ maxWidth: '90%', width: 400 }}>
          <ModalHeader>
            <Heading size="lg" style={{ color: '#1F2937' }}>Submit Grievance</Heading>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <FormControl isRequired>
                <FormControlLabel>
                  <FormControlLabelText style={{ fontWeight: '600', color: '#374151' }}>
                    Title
                  </FormControlLabelText>
                </FormControlLabel>
                <Input variant="outline">
                  <InputField
                    placeholder="Brief title of your grievance"
                    value={newGrievance.title}
                    onChangeText={(text) => setNewGrievance({...newGrievance, title: text})}
                  />
                </Input>
              </FormControl>

              <FormControl isRequired>
                <FormControlLabel>
                  <FormControlLabelText style={{ fontWeight: '600', color: '#374151' }}>
                    Category
                  </FormControlLabelText>
                </FormControlLabel>
                <Select
                  selectedValue={newGrievance.category}
                  onValueChange={(value) => setNewGrievance({...newGrievance, category: value})}
                >
                  <SelectTrigger variant="outline">
                    <SelectInput placeholder="Select category" />
                    <SelectIcon />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      {categories.map((category) => (
                        <SelectItem key={category.value} label={category.label} value={category.value} />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormControlLabel>
                  <FormControlLabelText style={{ fontWeight: '600', color: '#374151' }}>
                    Priority
                  </FormControlLabelText>
                </FormControlLabel>
                <Select
                  selectedValue={newGrievance.priority}
                  onValueChange={(value) => setNewGrievance({...newGrievance, priority: value})}
                >
                  <SelectTrigger variant="outline">
                    <SelectInput placeholder="Select priority" />
                    <SelectIcon />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} label={priority.label} value={priority.value} />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </FormControl>

              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText style={{ fontWeight: '600', color: '#374151' }}>
                    Location
                  </FormControlLabelText>
                </FormControlLabel>
                <Input variant="outline">
                  <InputField
                    placeholder="Specific location (optional)"
                    value={newGrievance.location}
                    onChangeText={(text) => setNewGrievance({...newGrievance, location: text})}
                  />
                </Input>
              </FormControl>

              <FormControl isRequired>
                <FormControlLabel>
                  <FormControlLabelText style={{ fontWeight: '600', color: '#374151' }}>
                    Description
                  </FormControlLabelText>
                </FormControlLabel>
                <Textarea>
                  <TextareaInput
                    placeholder="Describe your grievance in detail..."
                    value={newGrievance.description}
                    onChangeText={(text) => setNewGrievance({...newGrievance, description: text})}
                    style={{ minHeight: 80 }}
                  />
                </Textarea>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack space="md" style={{ width: '100%' }}>
              <Button
                variant="outline"
                onPress={() => setShowModal(false)}
                style={{ flex: 1 }}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                onPress={handleSubmitGrievance}
                style={{ flex: 1, backgroundColor: Palette.primary }}
              >
                <ButtonText style={{ color: 'white' }}>Submit</ButtonText>
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}