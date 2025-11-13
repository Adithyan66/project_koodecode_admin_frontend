export interface NotificationSubscriber {
	subscriptionId: string;
	userId: string;
	userName: string;
	email: string;
	profilePicKey?: string;
	profilePicUrl?: string;
	keys: Record<string, string>;
	userAgent: string;
	os: string;
	subscribedAt: string;
}

export interface NotificationSubscribersMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface NotificationSubscribersResponse {
	success: boolean;
	message: string;
	data: {
		items: NotificationSubscriber[];
		meta: NotificationSubscribersMeta;
	};
}

export interface SendUserNotificationPayload {
	targetUserId: string;
	type: string;
	title: string;
	body: string;
	icon?: string;
	data?: Record<string, any>;
}

export interface SendUserNotificationResponse {
	success: boolean;
	message: string;
	data: {
		sentCount: number;
		failedCount: number;
	};
}

export interface SendBulkNotificationPayload {
	type: string;
	title: string;
	body: string;
	targetType: 'all';
	icon?: string;
	data?: Record<string, any>;
}

export interface SendBulkNotificationResponse {
	success: boolean;
	message: string;
	data: {
		sentCount: number;
		failedCount: number;
	};
}


