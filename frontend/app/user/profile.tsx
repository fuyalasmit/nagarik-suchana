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
  Spinner,
} from '@gluestack-ui/themed';
import { User, Edit, Save, MapPin, Phone, Mail, Calendar, Briefcase } from 'lucide-react-native';
import { Palette } from '@/constants/theme';

// Mock user data
const mockUser = {
  id: 'user123',
  name: 'राम बहादुर श्रेष्ठ',
  email: 'ram.shrestha@email.com',
  phone: '+977-9841234567',
  address: 'Bharatpur-5, Chitwan',
  dob: '1990-05-15',
  gender: 'Male',
  ethnicity: 'Newar',
  profession: 'Teacher',
  qualification: 'Bachelor',
  province: 'Bagmati',
  district: 'Chitwan',
  municipality: 'Bharatpur Metropolitan',
  ward: '5',
};

const provinces = [
  'Province 1', 'Madhesh Province', 'Bagmati Province', 'Gandaki Province',
  'Lumbini Province', 'Karnali Province', 'Sudurpashchim Province'
];

const qualifications = [
  'SLC/SEE', '+2/Intermediate', 'Bachelor', 'Master', 'PhD'
];

const genders = ['Male', 'Female', 'Other'];

const ethnicities = [
  'Brahmin', 'Chhetri', 'Newar', 'Tamang', 'Magar', 'Tharu', 'Rai', 'Limbu', 'Gurung', 'Other'
];

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(mockUser);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = async () => {
    setErrors({});
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!userProfile.name.trim()) newErrors.name = 'Name is required';
    if (!userProfile.email.trim()) newErrors.email = 'Email is required';
    if (!userProfile.phone.trim()) newErrors.phone = 'Phone is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      // Here you would typically send to backend API
      // const response = await fetch('/api/auth/profile', { method: 'PUT', ... });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUserProfile(mockUser); // Reset to original data
    setErrors({});
    setIsEditing(false);
  };

  const updateField = (field: string, value: string) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
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
              My Profile
            </Heading>
            <Text style={{ fontSize: 14, color: '#6B7280' }}>
              Manage your personal information
            </Text>
          </VStack>
          <TouchableOpacity 
            onPress={() => isEditing ? handleCancel() : setIsEditing(true)}
            disabled={isLoading}
          >
            <Box
              style={{
                backgroundColor: isEditing ? '#EF4444' : Palette.primary,
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Edit size={20} color="white" />
            </Box>
          </TouchableOpacity>
        </HStack>
      </VStack>

      {/* Profile Card */}
      <Card
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <VStack space="lg">
          {/* Avatar and Basic Info */}
          <HStack space="md" style={{ alignItems: 'center' }}>
            <Box
              style={{
                backgroundColor: Palette.primary + '20',
                borderRadius: 50,
                padding: 20,
              }}
            >
              <User size={40} color={Palette.primary} />
            </Box>
            <VStack style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#1F2937' }}>
                {userProfile.name}
              </Text>
              <Text style={{ fontSize: 14, color: '#6B7280' }}>
                {userProfile.email}
              </Text>
              <HStack space="xs" style={{ alignItems: 'center', marginTop: 4 }}>
                <MapPin size={12} color="#9CA3AF" />
                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                  {userProfile.municipality}, Ward {userProfile.ward}
                </Text>
              </HStack>
            </VStack>
          </HStack>

          {/* Personal Information */}
          <VStack space="md">
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937' }}>
              Personal Information
            </Text>
            
            {/* Name */}
            <FormControl isInvalid={!!errors.name}>
              <FormControlLabel>
                <FormControlLabelText style={{ fontWeight: '600', color: '#374151' }}>
                  Full Name
                </FormControlLabelText>
              </FormControlLabel>
              <Input variant="outline" isDisabled={!isEditing}>
                <InputField
                  value={userProfile.name}
                  onChangeText={(text) => updateField('name', text)}
                  style={{ fontSize: 14 }}
                />
              </Input>
            </FormControl>

            {/* Email */}
            <FormControl isInvalid={!!errors.email}>
              <FormControlLabel>
                <FormControlLabelText style={{ fontWeight: '600', color: '#374151' }}>
                  Email Address
                </FormControlLabelText>
              </FormControlLabel>
              <Input variant="outline" isDisabled={!isEditing}>
                <InputField
                  value={userProfile.email}
                  onChangeText={(text) => updateField('email', text)}
                  keyboardType="email-address"
                  style={{ fontSize: 14 }}
                />
              </Input>
            </FormControl>

            {/* Phone */}
            <FormControl isInvalid={!!errors.phone}>
              <FormControlLabel>
                <FormControlLabelText style={{ fontWeight: '600', color: '#374151' }}>
                  Phone Number
                </FormControlLabelText>
              </FormControlLabel>
              <Input variant="outline" isDisabled={!isEditing}>
                <InputField
                  value={userProfile.phone}
                  onChangeText={(text) => updateField('phone', text)}
                  keyboardType="phone-pad"
                  style={{ fontSize: 14 }}
                />
              </Input>
            </FormControl>

            {/* Date of Birth */}
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText style={{ fontWeight: '600', color: '#374151' }}>
                  Date of Birth
                </FormControlLabelText>
              </FormControlLabel>
              <Input variant="outline" isDisabled={!isEditing}>
                <InputField
                  value={userProfile.dob}
                  onChangeText={(text) => updateField('dob', text)}
                  placeholder="YYYY-MM-DD"
                  style={{ fontSize: 14 }}
                />
              </Input>
            </FormControl>

            {/* Gender */}
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText style={{ fontWeight: '600', color: '#374151' }}>
                  Gender
                </FormControlLabelText>
              </FormControlLabel>
              {isEditing ? (
                <Select
                  selectedValue={userProfile.gender}
                  onValueChange={(value) => updateField('gender', value)}
                >
                  <SelectTrigger variant="outline">
                    <SelectInput />
                    <SelectIcon />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      {genders.map((gender) => (
                        <SelectItem key={gender} label={gender} value={gender} />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              ) : (
                <Input variant="outline" isDisabled>
                  <InputField value={userProfile.gender} style={{ fontSize: 14 }} />
                </Input>
              )}
            </FormControl>

            {/* Ethnicity */}
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText style={{ fontWeight: '600', color: '#374151' }}>
                  Ethnicity
                </FormControlLabelText>
              </FormControlLabel>
              {isEditing ? (
                <Select
                  selectedValue={userProfile.ethnicity}
                  onValueChange={(value) => updateField('ethnicity', value)}
                >
                  <SelectTrigger variant="outline">
                    <SelectInput />
                    <SelectIcon />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      {ethnicities.map((ethnicity) => (
                        <SelectItem key={ethnicity} label={ethnicity} value={ethnicity} />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              ) : (
                <Input variant="outline" isDisabled>
                  <InputField value={userProfile.ethnicity} style={{ fontSize: 14 }} />
                </Input>
              )}
            </FormControl>
          </VStack>

          {/* Professional Information */}
          <VStack space="md">
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937' }}>
              Professional Information
            </Text>
            
            {/* Profession */}
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText style={{ fontWeight: '600', color: '#374151' }}>
                  Profession
                </FormControlLabelText>
              </FormControlLabel>
              <Input variant="outline" isDisabled={!isEditing}>
                <InputField
                  value={userProfile.profession}
                  onChangeText={(text) => updateField('profession', text)}
                  style={{ fontSize: 14 }}
                />
              </Input>
            </FormControl>

            {/* Qualification */}
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText style={{ fontWeight: '600', color: '#374151' }}>
                  Qualification
                </FormControlLabelText>
              </FormControlLabel>
              {isEditing ? (
                <Select
                  selectedValue={userProfile.qualification}
                  onValueChange={(value) => updateField('qualification', value)}
                >
                  <SelectTrigger variant="outline">
                    <SelectInput />
                    <SelectIcon />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      {qualifications.map((qual) => (
                        <SelectItem key={qual} label={qual} value={qual} />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              ) : (
                <Input variant="outline" isDisabled>
                  <InputField value={userProfile.qualification} style={{ fontSize: 14 }} />
                </Input>
              )}
            </FormControl>
          </VStack>

          {/* Location Information */}
          <VStack space="md">
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1F2937' }}>
              Location Information
            </Text>
            
            {/* Address */}
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText style={{ fontWeight: '600', color: '#374151' }}>
                  Address
                </FormControlLabelText>
              </FormControlLabel>
              <Input variant="outline" isDisabled={!isEditing}>
                <InputField
                  value={userProfile.address}
                  onChangeText={(text) => updateField('address', text)}
                  style={{ fontSize: 14 }}
                />
              </Input>
            </FormControl>

            {/* Province */}
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText style={{ fontWeight: '600', color: '#374151' }}>
                  Province
                </FormControlLabelText>
              </FormControlLabel>
              {isEditing ? (
                <Select
                  selectedValue={userProfile.province}
                  onValueChange={(value) => updateField('province', value)}
                >
                  <SelectTrigger variant="outline">
                    <SelectInput />
                    <SelectIcon />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      {provinces.map((province) => (
                        <SelectItem key={province} label={province} value={province} />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              ) : (
                <Input variant="outline" isDisabled>
                  <InputField value={userProfile.province} style={{ fontSize: 14 }} />
                </Input>
              )}
            </FormControl>

            {/* District */}
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText style={{ fontWeight: '600', color: '#374151' }}>
                  District
                </FormControlLabelText>
              </FormControlLabel>
              <Input variant="outline" isDisabled={!isEditing}>
                <InputField
                  value={userProfile.district}
                  onChangeText={(text) => updateField('district', text)}
                  style={{ fontSize: 14 }}
                />
              </Input>
            </FormControl>

            {/* Municipality */}
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText style={{ fontWeight: '600', color: '#374151' }}>
                  Municipality
                </FormControlLabelText>
              </FormControlLabel>
              <Input variant="outline" isDisabled={!isEditing}>
                <InputField
                  value={userProfile.municipality}
                  onChangeText={(text) => updateField('municipality', text)}
                  style={{ fontSize: 14 }}
                />
              </Input>
            </FormControl>

            {/* Ward */}
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText style={{ fontWeight: '600', color: '#374151' }}>
                  Ward Number
                </FormControlLabelText>
              </FormControlLabel>
              <Input variant="outline" isDisabled={!isEditing}>
                <InputField
                  value={userProfile.ward}
                  onChangeText={(text) => updateField('ward', text)}
                  keyboardType="numeric"
                  style={{ fontSize: 14 }}
                />
              </Input>
            </FormControl>
          </VStack>

          {/* Save Button */}
          {isEditing && (
            <HStack space="md" style={{ marginTop: 16 }}>
              <Button
                variant="outline"
                onPress={handleCancel}
                style={{ flex: 1 }}
                isDisabled={isLoading}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                onPress={handleSave}
                style={{ flex: 1, backgroundColor: Palette.primary }}
                isDisabled={isLoading}
              >
                {isLoading ? (
                  <Spinner color="white" />
                ) : (
                  <ButtonText style={{ color: 'white' }}>Save Changes</ButtonText>
                )}
              </Button>
            </HStack>
          )}
        </VStack>
      </Card>
    </ScrollView>
  );
}