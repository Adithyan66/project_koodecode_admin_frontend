import axiosInstance from './axios';
import type {
	NotificationSubscribersResponse,
	NotificationSubscribersMeta,
	NotificationSubscriber,
} from '../types/notifications';
import type {
	SendUserNotificationResponse,
	SendUserNotificationPayload,
	SendBulkNotificationPayload,
	SendBulkNotificationResponse,
} from '../types/notifications';

export interface NotificationSubscribersQuery {
	page?: number;
	limit?: number;
	search?: string;
	os?: string;
}

export async function fetchNotificationSubscribers(
	params?: NotificationSubscribersQuery,
): Promise<{
	items: NotificationSubscriber[];
	meta: NotificationSubscribersMeta;
}> {
	const { data } = await axiosInstance.get<NotificationSubscribersResponse>(
		'/admin/notifications/subscribers',
		{ params },
	);

	return data.data;
}

export async function sendUserNotification(
	payload: SendUserNotificationPayload,
): Promise<SendUserNotificationResponse> {
	const { data } = await axiosInstance.post<SendUserNotificationResponse>(
		'/admin/notifications/send-user',
		payload,
	);
	return data;
}

export async function sendBulkNotification(
	payload: SendBulkNotificationPayload,
): Promise<SendBulkNotificationResponse> {
	const { data } = await axiosInstance.post<SendBulkNotificationResponse>(
		'/admin/notifications/send',
		payload,
	);
	return data;
}


