import Expo, { ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const expo = new Expo();

interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
}

/**
 * Validates if a push token is a valid Expo push token
 */
export function isValidExpoPushToken(token: string): boolean {
  return Expo.isExpoPushToken(token);
}

/**
 * Send notification to a single user by userId
 */
export async function sendNotificationToUser(
  userId: string,
  payload: NotificationPayload
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { pushToken: true },
    });

    if (!user?.pushToken || !isValidExpoPushToken(user.pushToken)) {
      console.log(`No valid push token for user ${userId}`);
      return false;
    }

    const message: ExpoPushMessage = {
      to: user.pushToken,
      sound: 'default',
      title: payload.title,
      body: payload.body,
      data: payload.data || {},
    };

    const tickets = await expo.sendPushNotificationsAsync([message]);
    console.log('Notification sent to user:', userId, tickets);
    return true;
  } catch (error) {
    console.error('Error sending notification to user:', error);
    return false;
  }
}

/**
 * Send notification to all users with valid push tokens
 */
export async function sendNotificationToAllUsers(
  payload: NotificationPayload
): Promise<{ sent: number; failed: number }> {
  try {
    const users = await prisma.user.findMany({
      where: {
        pushToken: { not: null },
      },
      select: { id: true, pushToken: true },
    });

    const validTokens = users
      .filter((u) => u.pushToken && isValidExpoPushToken(u.pushToken))
      .map((u) => u.pushToken as string);

    if (validTokens.length === 0) {
      console.log('No valid push tokens found');
      return { sent: 0, failed: 0 };
    }

    const messages: ExpoPushMessage[] = validTokens.map((token) => ({
      to: token,
      sound: 'default' as const,
      title: payload.title,
      body: payload.body,
      data: payload.data || {},
    }));

    // Expo allows max 100 notifications per batch
    const chunks = expo.chunkPushNotifications(messages);
    let sent = 0;
    let failed = 0;

    for (const chunk of chunks) {
      try {
        const tickets = await expo.sendPushNotificationsAsync(chunk);
        tickets.forEach((ticket: ExpoPushTicket) => {
          if (ticket.status === 'ok') {
            sent++;
          } else {
            failed++;
            console.error('Notification error:', ticket.message);
          }
        });
      } catch (error) {
        console.error('Error sending notification chunk:', error);
        failed += chunk.length;
      }
    }

    console.log(`Notifications sent: ${sent}, failed: ${failed}`);
    return { sent, failed };
  } catch (error) {
    console.error('Error sending notifications to all users:', error);
    return { sent: 0, failed: 0 };
  }
}

/**
 * Send notification when a notice is published
 */
export async function notifyNoticePublished(notice: {
  id: string;
  title: string;
  description?: string | null;
}): Promise<void> {
  const payload: NotificationPayload = {
    title: 'New Notice Published',
    body: notice.title,
    data: {
      noticeId: notice.id,
      type: 'notice_published',
      screen: 'NoticeDetail',
    },
  };

  const result = await sendNotificationToAllUsers(payload);
  console.log(`Notice published notification: ${result.sent} sent, ${result.failed} failed`);
}
