import { Platform } from 'react-native';
import { API_CONFIG } from '@/constants/api';

// Lazy load expo-notifications to avoid crashes in Expo Go
let Notifications: typeof import('expo-notifications') | null = null;
let Device: typeof import('expo-device') | null = null;
let Constants: typeof import('expo-constants').default | null = null;

// Flag to track if notifications are supported
let notificationsSupported = true;

// Try to load notification modules
async function loadNotificationModules() {
  try {
    Notifications = await import('expo-notifications');
    Device = await import('expo-device');
    const ConstantsModule = await import('expo-constants');
    Constants = ConstantsModule.default;

    // Configure notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    return true;
  } catch (error) {
    console.log('Push notifications not available:', error);
    notificationsSupported = false;
    return false;
  }
}

// Initialize on module load
const initPromise = loadNotificationModules();

/**
 * Check if notifications are supported
 */
export function areNotificationsSupported(): boolean {
  return notificationsSupported;
}

/**
 * Register for push notifications and get the Expo push token
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  await initPromise;

  if (!notificationsSupported || !Notifications || !Device || !Constants) {
    console.log('Push notifications not supported in this environment');
    return null;
  }

  // Check if running on a physical device
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  try {
    // Set up Android notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#59AC77',
      });
    }

    // Check existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permissions if not granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Push notification permission not granted');
      return null;
    }

    // Get projectId from various sources
    let projectId =
      Constants.expoConfig?.extra?.eas?.projectId ||
      (Constants as any).easConfig?.projectId ||
      '433dfe93-34e9-4d77-9898-50e0c82749b5'; // Fallback to hardcoded projectId

    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    console.log('Expo push token:', tokenData.data);
    return tokenData.data;
  } catch (error) {
    // This is expected in Expo Go - just log and continue
    console.log('Push token registration skipped (Expo Go or missing config)');
    return null;
  }
}

/**
 * Save push token to backend
 */
export async function savePushTokenToBackend(
  token: string,
  email: string,
  password: string
): Promise<boolean> {
  try {
    const credentials = btoa(`${email}:${password}`);

    const response = await fetch(API_CONFIG.auth.pushToken, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({ pushToken: token }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to save push token:', error);
      return false;
    }

    console.log('Push token saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving push token:', error);
    return false;
  }
}

/**
 * Add listener for notifications received while app is foregrounded
 */
export function addNotificationReceivedListener(
  callback: (notification: any) => void
): { remove: () => void } | null {
  if (!notificationsSupported || !Notifications) {
    return null;
  }
  return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Add listener for notification responses (when user taps notification)
 */
export function addNotificationResponseReceivedListener(
  callback: (response: any) => void
): { remove: () => void } | null {
  if (!notificationsSupported || !Notifications) {
    return null;
  }
  return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Remove notification subscription
 */
export function removeNotificationSubscription(
  subscription: { remove: () => void } | null
) {
  if (subscription) {
    subscription.remove();
  }
}

/**
 * Get notification data from response
 */
export function getNotificationData(response: any): {
  noticeId?: string;
  type?: string;
  screen?: string;
} {
  return response?.notification?.request?.content?.data || {};
}
