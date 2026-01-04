import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Heading, 
  Text, 
  Input, 
  InputField,
  InputSlot,
  InputIcon,
  Button,
  ButtonText,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Card,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
  Spinner,
} from '@gluestack-ui/themed';
import { Link as ExpoLink, useRouter } from 'expo-router';
import { Platform, ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { EyeIcon, EyeOffIcon, CheckIcon } from 'lucide-react-native';
import { Palette } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setMessage(null);
    setIsError(false);

    if (!email.trim() || !password.trim()) {
      setMessage('Please enter email and password');
      setIsError(true);
      return;
    }

    // Check for admin credentials
    if (email.trim().toLowerCase() === 'admin@gmail.com' && password === 'admin123') {
      setMessage('Admin login successful! Redirecting...');
      setIsError(false);
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1000);
      return;
    }

    setIsLoading(true);
    const payload = {
      email: email.trim().toLowerCase(),
      password,
    };

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.error || 'Login failed');
      }

      setMessage('Login successful! Redirecting...');
      setIsError(false);
      
      // Store user token and navigate to user dashboard
      // TODO: Store token in secure storage
      setTimeout(() => {
        router.push('/user/dashboard');
      }, 1000);
    } catch (err: any) {
      setMessage(err.message || 'Login failed');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: Palette.backgroundLight }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Box style={{ alignItems: 'center', marginBottom: 40 }}>
          <Heading 
            size="3xl" 
            style={{ 
              color: Palette.primary, 
              fontWeight: '800',
              textAlign: 'center',
              marginBottom: 8,
              letterSpacing: -0.5
            }}
          >
            नागरिक सूचना
          </Heading>
          <Text 
            size="lg" 
            style={{ 
              color: '#6B7280', 
              fontWeight: '500',
              textAlign: 'center' 
            }}
          >
            Welcome Back!
          </Text>
        </Box>

        {/* Login Form Card */}
        <Card 
          style={{ 
            maxWidth: 440,
            width: '100%',
            alignSelf: 'center',
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 32,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          <VStack space="xl">
            <Box>
              <Heading size="2xl" style={{ color: '#1F2937', fontWeight: '700', marginBottom: 4 }}>
                Sign In
              </Heading>
              <Text size="sm" style={{ color: '#6B7280' }}>
                Access your community dashboard
              </Text>
            </Box>

            {/* Email Field */}
            <FormControl isRequired>
              <FormControlLabel>
                <FormControlLabelText style={{ fontWeight: '600', color: '#374151' }}>
                  Email Address
                </FormControlLabelText>
              </FormControlLabel>
              <Input 
                variant="outline" 
                size="lg"
                style={{ borderColor: Palette.primary, borderWidth: 1.5 }}
              >
                <InputField
                  placeholder="your@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{ fontSize: 16 }}
                />
              </Input>
            </FormControl>

            {/* Password Field */}
            <FormControl isRequired>
              <HStack style={{ justifyContent: 'space-between', marginBottom: 8 }}>
                <FormControlLabel>
                  <FormControlLabelText style={{ fontWeight: '600', color: '#374151' }}>
                    Password
                  </FormControlLabelText>
                </FormControlLabel>
                <TouchableOpacity>
                  <Text size="sm" style={{ color: Palette.accentStrong, fontWeight: '600' }}>
                    Forgot?
                  </Text>
                </TouchableOpacity>
              </HStack>
              <Input 
                variant="outline" 
                size="lg"
                style={{ borderColor: Palette.primary, borderWidth: 1.5 }}
              >
                <InputField
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  type={showPassword ? 'text' : 'password'}
                  autoCapitalize="none"
                  style={{ fontSize: 16 }}
                />
                <InputSlot onPress={() => setShowPassword(!showPassword)} style={{ paddingRight: 12 }}>
                  <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} color={Palette.primary} />
                </InputSlot>
              </Input>
            </FormControl>

            {/* Remember Me */}
            <Checkbox 
              value="remember" 
              isChecked={rememberMe}
              onChange={setRememberMe}
              size="md"
            >
              <CheckboxIndicator style={{ borderColor: Palette.primary }}>
                <CheckboxIcon as={CheckIcon} color={Palette.primary} />
              </CheckboxIndicator>
              <CheckboxLabel style={{ color: '#4B5563', fontWeight: '500' }}>
                Remember me for 30 days
              </CheckboxLabel>
            </Checkbox>

            {/* Message Display */}
            {message && (
              <Box 
                style={{ 
                  padding: 12, 
                  borderRadius: 12, 
                  backgroundColor: isError ? '#FEE2E2' : '#D1FAE5',
                  borderWidth: 1,
                  borderColor: isError ? '#FCA5A5' : '#6EE7B7'
                }}
              >
                <Text style={{ color: isError ? '#991B1B' : '#065F46', fontWeight: '500' }}>
                  {message}
                </Text>
              </Box>
            )}

            {/* Login Button */}
            <Button 
              size="lg" 
              onPress={handleLogin}
              isDisabled={isLoading}
              style={{ 
                backgroundColor: Palette.primary,
                borderRadius: 12,
                height: 56,
                shadowColor: Palette.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              {isLoading ? (
                <Spinner color="white" />
              ) : (
                <ButtonText style={{ fontSize: 18, fontWeight: '700', color: '#1F2937' }}>
                  Sign In
                </ButtonText>
              )}
            </Button>

            {/* Divider */}
            <Box style={{ position: 'relative', height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 }}>
              <Text 
                size="sm" 
                style={{ 
                  position: 'absolute', 
                  top: -10, 
                  left: '50%', 
                  transform: [{ translateX: -15 }],
                  backgroundColor: 'white',
                  paddingHorizontal: 8,
                  color: '#9CA3AF'
                }}
              >
                OR
              </Text>
            </Box>

            {/* Social Login */}
            <VStack space="sm">
              <Button 
                variant="outline" 
                size="lg"
                style={{ 
                  borderColor: '#E5E7EB',
                  borderWidth: 1.5,
                  backgroundColor: 'white'
                }}
              >
                <ButtonText style={{ color: '#374151', fontWeight: '600' }}>
                  Continue with Google
                </ButtonText>
              </Button>
              <HStack space="sm">
                <Button 
                  variant="outline" 
                  size="lg"
                  style={{ 
                    flex: 1,
                    borderColor: '#E5E7EB',
                    borderWidth: 1.5,
                    backgroundColor: 'white'
                  }}
                >
                  <ButtonText style={{ color: '#374151', fontWeight: '600' }}>Facebook</ButtonText>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  style={{ 
                    flex: 1,
                    borderColor: '#E5E7EB',
                    borderWidth: 1.5,
                    backgroundColor: 'white'
                  }}
                >
                  <ButtonText style={{ color: '#374151', fontWeight: '600' }}>Apple</ButtonText>
                </Button>
              </HStack>
            </VStack>

            {/* Register Link */}
            <Box 
              style={{ 
                paddingTop: 16, 
                marginTop: 8,
                borderTopWidth: 1,
                borderTopColor: '#F3F4F6'
              }}
            >
              <HStack space="xs" style={{ justifyContent: 'center' }}>
                <Text size="md" style={{ color: '#6B7280' }}>
                  New to नागरिक सूचना?
                </Text>
                <TouchableOpacity>
                  <ExpoLink href="/">
                    <Text size="md" style={{ color: Palette.accentStrong, fontWeight: '700' }}>
                      Create Account
                    </Text>
                  </ExpoLink>
                </TouchableOpacity>
              </HStack>
            </Box>
          </VStack>
        </Card>

        {/* Footer */}
        <HStack space="sm" style={{ justifyContent: 'center', marginTop: 24, alignItems: 'center' }}>
          <TouchableOpacity>
            <ExpoLink href="/admin/dashboard">
              <Text size="sm" style={{ color: '#9CA3AF', fontWeight: '500' }}>Admin Portal</Text>
            </ExpoLink>
          </TouchableOpacity>
          <Text size="sm" style={{ color: '#D1D5DB' }}>•</Text>
          <Text size="sm" style={{ color: '#9CA3AF', fontWeight: '500' }}>Help & Support</Text>
        </HStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
