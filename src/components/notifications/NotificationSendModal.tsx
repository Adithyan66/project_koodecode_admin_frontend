import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { X } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import { imageKitService } from '../../services/ImageKitService';
import { ImageUploadService } from '../../services/ImageUploadService';
import type { NotificationSubscriber } from '../../types/notifications';

export interface NotificationSendValues {
	type: string;
	title: string;
	body: string;
	icon?: string;
	data?: Record<string, any>;
}

interface NotificationSendModalProps {
	open: boolean;
	mode: 'single' | 'bulk';
	subscriber?: NotificationSubscriber | null;
	subscribers?: NotificationSubscriber[];
	onClose: () => void;
	onSubmit: (values: NotificationSendValues) => Promise<void>;
}

function getAvatarUrl(subscriber?: NotificationSubscriber | null, size: number = 64) {
	if (!subscriber) return '';
	if (subscriber.profilePicKey) return imageKitService.getAvatarUrl(subscriber.profilePicKey, size);
	if (subscriber.profilePicUrl) return subscriber.profilePicUrl;
	return '';
}

function getInitials(name?: string) {
	if (!name) return '?';
	const parts = name.trim().split(/\s+/).slice(0, 2);
	return parts.map((part) => part[0]?.toUpperCase() ?? '').join('') || '?';
}

export default function NotificationSendModal({
	open,
	mode,
	subscriber,
	subscribers = [],
	onClose,
	onSubmit,
}: NotificationSendModalProps) {
	const [typeValue, setTypeValue] = useState('AdminNotification');
	const [titleValue, setTitleValue] = useState('');
	const [bodyValue, setBodyValue] = useState('');
	const [iconUrl, setIconUrl] = useState('');
	const [dataJson, setDataJson] = useState('');
	const [jsonError, setJsonError] = useState('');
	const [formError, setFormError] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [iconUploading, setIconUploading] = useState(false);
	const [iconUploadProgress, setIconUploadProgress] = useState(0);

	const stackedAvatars = useMemo(() => {
		if (mode !== 'bulk') return [];
		return subscribers.slice(0, 3).map((item) => ({
			url: getAvatarUrl(item, 48),
			initials: getInitials(item.userName || item.email),
			key: item.subscriptionId,
		}));
	}, [mode, subscribers]);

	const stackedOverflowCount = useMemo(() => {
		if (mode !== 'bulk') return 0;
		return Math.max(subscribers.length - 3, 0);
	}, [mode, subscribers]);

	const headerTitle = mode === 'single' ? 'Send Notification' : 'Send Notification To All Users';
	const headerSubtitle =
		mode === 'single'
			? subscriber?.userName || subscriber?.email || 'Unknown user'
			: 'This will notify all push subscribers.';

	const canInteract = !(submitting || iconUploading);

	useEffect(() => {
		if (open) {
			setTypeValue('AdminNotification');
			setTitleValue('');
			setBodyValue('');
			setIconUrl('');
			setDataJson('');
			setJsonError('');
			setFormError('');
			setSubmitting(false);
			setIconUploading(false);
			setIconUploadProgress(0);
		}
	}, [open]);

	const handleIconChange = useCallback(
		async (event: ChangeEvent<HTMLInputElement>) => {
			if (!event.target.files?.length) return;
			const file = event.target.files[0];
			setIconUploading(true);
			setIconUploadProgress(0);
			try {
				const key = await ImageUploadService.uploadImage(
					'notification-icon',
					file,
					(progress) => setIconUploadProgress(progress),
				);
				const preview = imageKitService.getAvatarUrl(key, 96);
				setIconUrl(preview);
			} catch (err) {
				setIconUrl('');
			} finally {
				setIconUploading(false);
				setIconUploadProgress(0);
				event.target.value = '';
			}
		},
		[],
	);

	const handleSubmit = useCallback(async () => {
		if (submitting || iconUploading) return;
		const trimmedTitle = titleValue.trim();
		const trimmedBody = bodyValue.trim();
		const trimmedType = typeValue.trim() || 'AdminNotification';
		if (!trimmedTitle || !trimmedBody) {
			setFormError(!trimmedTitle ? 'Title is required' : 'Body is required');
			return;
		}
		let parsedData: Record<string, any> | undefined;
		if (dataJson.trim()) {
			try {
				parsedData = JSON.parse(dataJson);
				setJsonError('');
			} catch {
				setJsonError('Data must be valid JSON');
				return;
			}
		} else {
			setJsonError('');
		}
		setFormError('');
		setSubmitting(true);
		try {
			await onSubmit({
				type: trimmedType,
				title: trimmedTitle,
				body: trimmedBody,
				...(iconUrl && { icon: iconUrl }),
				...(parsedData && { data: parsedData }),
			});
			onClose();
		} catch {
			setSubmitting(false);
		}
	}, [submitting, iconUploading, titleValue, bodyValue, typeValue, dataJson, iconUrl, onSubmit, onClose]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black/60"
				onClick={() => {
					if (canInteract) onClose();
				}}
			/>
			<div className="relative z-10 mx-4 w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl dark:bg-slate-900">
				<div className="flex items-start justify-between">
					<div>
						<h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{headerTitle}</h2>
						<p className="text-sm text-slate-500 dark:text-slate-400">{headerSubtitle}</p>
					</div>
					<button
						type="button"
						onClick={() => {
							if (canInteract) onClose();
						}}
						disabled={!canInteract}
						className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-slate-800 dark:text-slate-300"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				{mode === 'single' && subscriber && (
					<div className="mt-4 flex items-center gap-4 rounded-md border border-slate-200 p-4 dark:border-slate-700">
						{(() => {
							const avatar = getAvatarUrl(subscriber, 72);
							if (avatar) {
								return (
									<div className="h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-700">
										<img src={avatar} alt={subscriber.userName || subscriber.email} className="h-full w-full object-cover" />
									</div>
								);
							}
							return (
								<div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-slate-200 text-lg font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
									{getInitials(subscriber.userName || subscriber.email)}
								</div>
							);
						})()}
						<div className="flex flex-col">
							<span className="text-sm font-medium text-slate-700 dark:text-slate-200">
								{subscriber.userName || subscriber.email}
							</span>
							<span className="text-sm text-slate-500 dark:text-slate-400">{subscriber.email}</span>
							<span className="text-xs text-slate-400 dark:text-slate-500 capitalize">{subscriber.os || 'unknown'}</span>
						</div>
					</div>
				)}

				{mode === 'bulk' && (
					<div className="mt-4 flex items-center justify-between rounded-md border border-slate-200 p-4 dark:border-slate-700">
						<div className="flex items-center">
							<div className="flex items-center">
								{stackedAvatars.map((item, index) =>
									item.url ? (
										<div
											key={item.key}
											className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate-100 text-sm font-semibold text-slate-600 dark:border-slate-900 dark:bg-slate-800 dark:text-slate-200 ${index > 0 ? '-ml-3' : ''}`}
										>
											<img src={item.url} alt="Subscriber" className="h-full w-full object-cover" />
										</div>
									) : (
										<div
											key={item.key}
											className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-sm font-semibold text-slate-600 dark:border-slate-900 dark:bg-slate-800 dark:text-slate-200 ${index > 0 ? '-ml-3' : ''}`}
										>
											{item.initials}
										</div>
									),
								)}
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-slate-700 dark:text-slate-200">
									Notify all subscribers
								</p>
								<p className="text-xs text-slate-500 dark:text-slate-400">
									{stackedOverflowCount > 0
										? `Including ${stackedOverflowCount} more users`
										: subscribers.length
										? `Total ${subscribers.length} users`
										: 'No subscribers loaded'}
								</p>
							</div>
						</div>
					</div>
				)}

				<div className="mt-6 grid gap-6 md:grid-cols-2">
					<div className="space-y-4">
						<div>
							<label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Type</label>
							<Input
								value={typeValue}
								onChange={(event) => {
									setTypeValue(event.target.value);
									setFormError('');
								}}
								disabled={!canInteract}
							/>
						</div>
						<div>
							<label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Title</label>
							<Input
								value={titleValue}
								onChange={(event) => {
									setTitleValue(event.target.value);
									setFormError('');
								}}
								placeholder="Enter notification title"
								disabled={!canInteract}
							/>
						</div>
						<div>
							<label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Body</label>
							<textarea
								value={bodyValue}
								onChange={(event) => {
									setBodyValue(event.target.value);
									setFormError('');
								}}
								placeholder="Write the notification message..."
								className="min-h-[140px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-shadow focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
								disabled={!canInteract}
							/>
						</div>
					</div>
					<div className="space-y-4">
						<div>
							<label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Icon (optional)</label>
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
								<div className="flex flex-col items-center gap-2">
									{iconUrl ? (
										<div className="h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-700">
											<img src={iconUrl} alt="Notification icon" className="h-full w-full object-cover" />
										</div>
									) : (
										<div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-slate-200 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
											No icon
										</div>
									)}
									{iconUrl && (
										<Button
											variant="secondary"
											onClick={() => setIconUrl('')}
											disabled={!canInteract}
											className="px-3 py-1 text-xs"
										>
											Remove icon
										</Button>
									)}
								</div>
								<input
									type="file"
									accept="image/*"
									onChange={handleIconChange}
									disabled={!canInteract}
								/>
							</div>
							{iconUploading && (
								<p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Uploading... {iconUploadProgress}%</p>
							)}
						</div>
						<div>
							<label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Data (JSON, optional)</label>
							<textarea
								value={dataJson}
								onChange={(event) => {
									setDataJson(event.target.value);
									setJsonError('');
								}}
								placeholder='{"url":"/dashboard"}'
								className="min-h-[140px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-shadow focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
								disabled={!canInteract}
							/>
							{jsonError && <p className="mt-2 text-sm text-red-600">{jsonError}</p>}
						</div>
					</div>
				</div>

				{formError && <p className="mt-4 text-sm text-red-600">{formError}</p>}

				<div className="mt-6 flex justify-end gap-3">
					<Button variant="secondary" onClick={() => canInteract && onClose()} disabled={!canInteract}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={!canInteract}>
						{submitting ? 'Sending...' : 'Send Notification'}
					</Button>
				</div>
			</div>
		</div>
	);
}


