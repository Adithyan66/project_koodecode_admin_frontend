import { useMemo, useState, useCallback } from 'react';
import Table, { type TableColumn } from '../components/Table';
import Input from '../components/Input';
import Pagination from '../components/Pagination';
import Button from '../components/Button';
import { useNotificationSubscribers } from '../hooks/data/useNotificationSubscribers';
import type { NotificationSubscriber } from '../types/notifications';
import { imageKitService } from '../services/ImageKitService';
import { sendUserNotification, sendBulkNotification } from '../api/notifications';
import toast from 'react-hot-toast';
import NotificationSendModal, {
	type NotificationSendValues,
} from '../components/notifications/NotificationSendModal';

const OS_OPTIONS = [
	{ label: 'All OS', value: '' },
	{ label: 'Windows', value: 'windows' },
	{ label: 'macOS', value: 'macos' },
	{ label: 'iOS', value: 'ios' },
	{ label: 'Android', value: 'android' },
	{ label: 'Linux', value: 'linux' },
	{ label: 'ChromeOS', value: 'chromeos' },
	{ label: 'Other', value: 'other' },
];

function formatSubscribedAt(value: string) {
	return new Date(value).toLocaleString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	});
}

function getAvatarUrl(subscriber: NotificationSubscriber) {
	if (subscriber.profilePicKey) {
		return imageKitService.getAvatarUrl(subscriber.profilePicKey, 64);
	}

	if (subscriber.profilePicUrl) {
		return subscriber.profilePicUrl;
	}

	return '';
}

function getInitials(name: string) {
	if (!name) return '?';
	const parts = name.trim().split(/\s+/).slice(0, 2);
	return parts.map((part) => part[0]?.toUpperCase() ?? '').join('') || '?';
}

export default function Notifications() {
	const {
		subscribers,
		loading,
		error,
		refetch,
		pagination,
		paginationActions,
		searchQuery,
		setSearchQuery,
		osFilter,
		setOsFilter,
	} = useNotificationSubscribers();
	const [singleModalOpen, setSingleModalOpen] = useState(false);
	const [bulkModalOpen, setBulkModalOpen] = useState(false);
	const [selectedSubscriber, setSelectedSubscriber] = useState<NotificationSubscriber | null>(null);

	const columns: TableColumn<NotificationSubscriber>[] = useMemo(
		() => [
			{
				key: 'userName',
				label: 'Subscriber',
				render: (_, subscriber) => {
					const avatarUrl = getAvatarUrl(subscriber);

					return (
						<div className="flex items-center gap-3">
							{avatarUrl ? (
								<img
									src={avatarUrl}
									alt={subscriber.userName || subscriber.email}
									className="h-10 w-10 rounded-full object-cover"
								/>
							) : (
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
									{getInitials(subscriber.userName || subscriber.email)}
								</div>
							)}
							<div className="flex flex-col">
								<span className="font-medium text-slate-900 dark:text-slate-100">
									{subscriber.userName || subscriber.email}
								</span>
								<span className="text-sm text-slate-500 dark:text-slate-400">
									{subscriber.email}
								</span>
							</div>
						</div>
					);
				},
			},
			{
				key: 'os',
				label: 'OS',
				render: (value) => (
					<span className="capitalize text-slate-700 dark:text-slate-200">{value || 'Unknown'}</span>
				),
			},
			{
				key: 'userAgent',
				label: 'User Agent',
				className: 'max-w-xs truncate text-slate-600 dark:text-slate-300',
			},
			{
				key: 'subscribedAt',
				label: 'Subscribed',
				render: (value) => (
					<span className="text-sm text-slate-700 dark:text-slate-300">
						{formatSubscribedAt(value)}
					</span>
				),
			},
		],
		[],
	);

	const handleRowClick = useCallback(
		(subscriber: NotificationSubscriber) => {
			setSelectedSubscriber(subscriber);
			setSingleModalOpen(true);
		},
		[],
	);

	const handleCloseSingleModal = useCallback(() => {
		setSingleModalOpen(false);
		setSelectedSubscriber(null);
	}, []);

	const handleCloseBulkModal = useCallback(() => {
		setBulkModalOpen(false);
	}, []);

	const handleSendToSubscriber = useCallback(
		async (values: NotificationSendValues) => {
			if (!selectedSubscriber) return;
			try {
				const response = await sendUserNotification({
					targetUserId: selectedSubscriber.userId,
					...values,
				});
				toast.success(response.message || 'Notification sent');
				await refetch();
			} catch (err: any) {
				const message = err?.response?.data?.message || err?.message || 'Failed to send notification';
				toast.error(message);
				throw err;
			}
		},
		[selectedSubscriber, refetch],
	);

	const handleSendToAll = useCallback(
		async (values: NotificationSendValues) => {
			try {
				const response = await sendBulkNotification({
					targetType: 'all',
					...values,
				});
				toast.success(response.message || 'Notification sent');
				await refetch();
			} catch (err: any) {
				const message = err?.response?.data?.message || err?.message || 'Failed to send notification';
				toast.error(message);
				throw err;
			}
		},
		[refetch],
	);

	return (
		<div>
			<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold">Notifications Subscribers</h1>
					<p className="mt-2 text-slate-600 dark:text-slate-300">
						View users subscribed to push notifications.
					</p>
				</div>
				<Button className="w-full sm:w-auto" onClick={() => setBulkModalOpen(true)}>
					Send To All Users
				</Button>
			</div>

			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<Input
					type="text"
					placeholder="Search by username or email..."
					value={searchQuery}
					onChange={(event) => setSearchQuery(event.target.value)}
					className="max-w-sm"
				/>

				<select
					value={osFilter}
					onChange={(event) => setOsFilter(event.target.value)}
					className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:w-48"
				>
					{OS_OPTIONS.map((option) => (
						<option key={option.value || 'all'} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>

			<Table
				data={subscribers}
				columns={columns}
				loading={loading}
				error={error}
				rowKey="subscriptionId"
				emptyMessage="No subscribers found"
				onRowClick={handleRowClick}
			/>

			{!loading && !error && subscribers.length > 0 && (
				<Pagination pagination={pagination} paginationActions={paginationActions} />
			)}

			<NotificationSendModal
				open={singleModalOpen && !!selectedSubscriber}
				mode="single"
				subscriber={selectedSubscriber}
				onClose={handleCloseSingleModal}
				onSubmit={handleSendToSubscriber}
			/>
			<NotificationSendModal
				open={bulkModalOpen}
				mode="bulk"
				subscribers={subscribers}
				onClose={handleCloseBulkModal}
				onSubmit={handleSendToAll}
			/>
		</div>
	);
}


