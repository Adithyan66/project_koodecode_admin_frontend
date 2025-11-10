import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Table, { type TableColumn } from '../components/Table';
import Pagination from '../components/Pagination';
import Input from '../components/Input';
import Toggle from '../components/Toggle';
import Button from '../components/Button';
import { Card, CardContent, CardHeader } from '../components/Card';
import { useBadgeDetail } from '../hooks/data/useBadgeDetail';
import type { BadgeCategory, BadgeRarity, BadgeType, BadgeHolder } from '../types/badge';
import { imageKitService } from '../services/ImageKitService';
import type { UpdateBadgePayload } from '../api/badges';

const badgeTypes: { value: BadgeType; label: string }[] = [
	{ value: 'problem_solver', label: 'Problem Solver' },
	{ value: 'streak_master', label: 'Streak Master' },
	{ value: 'contest_winner', label: 'Contest Winner' },
	{ value: 'language_expert', label: 'Language Expert' },
	{ value: 'daily_coder', label: 'Daily Coder' },
	{ value: 'difficulty_master', label: 'Difficulty Master' },
	{ value: 'speed_demon', label: 'Speed Demon' },
	{ value: 'consistency', label: 'Consistency' },
	{ value: 'milestone', label: 'Milestone' },
];

const badgeCategories: { value: BadgeCategory; label: string }[] = [
	{ value: 'achievement', label: 'Achievement' },
	{ value: 'progress', label: 'Progress' },
	{ value: 'milestone', label: 'Milestone' },
	{ value: 'special', label: 'Special' },
	{ value: 'seasonal', label: 'Seasonal' },
];

const badgeRarities: { value: BadgeRarity; label: string }[] = [
	{ value: 'common', label: 'Common' },
	{ value: 'rare', label: 'Rare' },
	{ value: 'epic', label: 'Epic' },
	{ value: 'legendary', label: 'Legendary' },
];

const getBadgeIconPreview = (iconKey?: string, size: number = 120) => {
	if (!iconKey) return '';
	if (iconKey.startsWith('http')) return iconKey;
	return imageKitService.getBadgeIconUrl(iconKey, size);
};

const textareaClass =
	'block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-500 outline-none transition-shadow focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400';

export default function BadgeDetail() {
	const { badgeId } = useParams<{ badgeId: string }>();
	const navigate = useNavigate();

	const {
		badge,
		loading,
		error,
		saving,
		iconUploading,
		iconUploadProgress,
		updateBadgeDetails,
		toggleBadgeActive,
		uploadBadgeIcon,
		holders,
		holdersLoading,
		holdersError,
		holdersPagination,
		holdersPaginationActions,
	} = useBadgeDetail(badgeId || '');

	const [formState, setFormState] = useState({
		name: '',
		description: '',
		type: badgeTypes[0]?.value ?? 'problem_solver',
		category: badgeCategories[0]?.value ?? 'achievement',
		rarity: badgeRarities[0]?.value ?? 'common',
		criteriaType: '',
		criteriaThreshold: '',
		criteriaDescription: '',
		iconKey: '',
		iconPreview: '',
	});

	useEffect(() => {
		if (!badge) return;
		setFormState({
			name: badge.name,
			description: badge.description,
			type: badge.type,
			category: badge.category,
			rarity: badge.rarity,
			criteriaType: badge.criteria?.type || '',
			criteriaThreshold: badge.criteria?.threshold != null ? String(badge.criteria.threshold) : '',
			criteriaDescription: badge.criteria?.description || '',
			iconKey: badge.iconUrl,
			iconPreview: getBadgeIconPreview(badge.iconUrl),
		});
	}, [badge]);

	const isDirty = useMemo(() => {
		if (!badge) return false;
		if (formState.name !== badge.name) return true;
		if (formState.description !== badge.description) return true;
		if (formState.type !== badge.type) return true;
		if (formState.category !== badge.category) return true;
		if (formState.rarity !== badge.rarity) return true;
		if ((formState.iconKey || '') !== (badge.iconUrl || '')) return true;
		if ((formState.criteriaType || '') !== (badge.criteria?.type || '')) return true;
		if ((formState.criteriaDescription || '') !== (badge.criteria?.description || '')) return true;
		const thresholdNumber = formState.criteriaThreshold ? Number(formState.criteriaThreshold) : null;
		if (thresholdNumber !== (badge.criteria?.threshold ?? null)) return true;
		return false;
	}, [badge, formState]);

	const handleSave = async () => {
		if (!badge) return;
		const payload: UpdateBadgePayload = {};

		if (formState.name.trim() && formState.name !== badge.name) {
			payload.name = formState.name.trim();
		}
		if (formState.description.trim() && formState.description !== badge.description) {
			payload.description = formState.description.trim();
		}
		if (formState.type !== badge.type) {
			payload.type = formState.type as BadgeType;
		}
		if (formState.category !== badge.category) {
			payload.category = formState.category as BadgeCategory;
		}
		if (formState.rarity !== badge.rarity) {
			payload.rarity = formState.rarity as BadgeRarity;
		}
		if (formState.iconKey && formState.iconKey !== badge.iconUrl) {
			payload.iconUrl = formState.iconKey;
		}

		const criteriaPayload: UpdateBadgePayload['criteria'] = {};
		if ((formState.criteriaType || '') !== (badge.criteria?.type || '')) {
			criteriaPayload.type = formState.criteriaType;
		}
		const thresholdNumber = formState.criteriaThreshold ? Number(formState.criteriaThreshold) : undefined;
		if (!Number.isNaN(thresholdNumber || 0) && thresholdNumber !== undefined && thresholdNumber !== badge.criteria?.threshold) {
			criteriaPayload.threshold = thresholdNumber;
		}
		if ((formState.criteriaDescription || '') !== (badge.criteria?.description || '')) {
			criteriaPayload.description = formState.criteriaDescription;
		}
		if (criteriaPayload.type || criteriaPayload.threshold !== undefined || criteriaPayload.description) {
			payload.criteria = criteriaPayload;
		}

		if (Object.keys(payload).length === 0) {
			toast('No changes to save');
			return;
		}

		await updateBadgeDetails(payload);
	};

	const handleIconChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;
		try {
			const { iconKey, previewUrl } = await uploadBadgeIcon(file);
			setFormState((prev) => ({
				...prev,
				iconKey,
				iconPreview: previewUrl,
			}));
		} catch (err) {
			// errors handled in hook
		}
	};

	const holderColumns = useMemo<TableColumn<BadgeHolder>[]>(() => [
		{
			key: 'fullName',
			label: 'Name',
		},
		{
			key: 'userName',
			label: 'Username',
		},
		{
			key: 'email',
			label: 'Email',
		},
		{
			key: 'awardedAt',
			label: 'Awarded At',
			render: (value) =>
				new Date(value).toLocaleString(undefined, {
					year: 'numeric',
					month: 'short',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
				}),
		},
	], []);

	if (!badgeId) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-slate-600 dark:text-slate-300">Badge ID is missing.</p>
			</div>
		);
}

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center">
					<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
					<p className="text-gray-600 dark:text-gray-400">Loading badge details...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-full items-center justify-center">
				<Card className="max-w-md">
					<CardHeader>Error loading badge</CardHeader>
					<CardContent>{error}</CardContent>
				</Card>
			</div>
		);
	}

	if (!badge) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-slate-600 dark:text-slate-300">Badge not found.</p>
			</div>
		);
	}

	const handleHolderRowClick = (holder: BadgeHolder) => {
		navigate(`/users/${holder.userId}`);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">{badge.name}</h1>
					<p className="text-slate-600 dark:text-slate-300">Manage badge details and view holder history.</p>
				</div>
				<div className="flex items-center gap-3">
					<Button
						variant="secondary"
						onClick={() => navigate(-1)}
					>
						Back
					</Button>
					<Button
						onClick={handleSave}
						disabled={saving || !isDirty}
					>
						{saving ? 'Saving...' : 'Save Changes'}
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
				<Card className="xl:col-span-1">
					<CardHeader>Badge Overview</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center gap-4">
							<div className="relative h-24 w-24 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
								{formState.iconPreview ? (
									<img
										src={formState.iconPreview}
										alt={formState.name}
										className="h-full w-full rounded-lg object-cover"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
										No Icon
									</div>
								)}
							</div>
							<div>
								<label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
									Update Icon
								</label>
								<input
									type="file"
									accept="image/png,image/jpeg,image/webp"
									onChange={handleIconChange}
									disabled={iconUploading}
									className="text-sm text-slate-600 dark:text-slate-300"
								/>
								{iconUploading && (
									<p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
										Uploading... {iconUploadProgress}%
									</p>
								)}
							</div>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active</span>
							<Toggle
								checked={badge.isActive}
								onChange={(event) => toggleBadgeActive(event.target.checked)}
								aria-label="Toggle badge active status"
							/>
						</div>
						<div className="grid grid-cols-2 gap-3 text-sm">
							<div>
								<p className="text-slate-500 dark:text-slate-400">Created</p>
								<p className="font-medium text-slate-900 dark:text-slate-100">
									{new Date(badge.createdAt).toLocaleDateString()}
								</p>
							</div>
							<div>
								<p className="text-slate-500 dark:text-slate-400">Last Updated</p>
								<p className="font-medium text-slate-900 dark:text-slate-100">
									{new Date(badge.updatedAt).toLocaleDateString()}
								</p>
							</div>
						</div>
						<div className="text-sm">
							<p className="text-slate-500 dark:text-slate-400">Total Holders</p>
							<p className="font-semibold text-slate-900 dark:text-slate-100">{badge.holderCount ?? 0}</p>
						</div>
					</CardContent>
				</Card>

				<Card className="xl:col-span-2">
					<CardHeader>Edit Badge Information</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
									Name
								</label>
								<Input
									value={formState.name}
									onChange={(event) =>
										setFormState((prev) => ({
											...prev,
											name: event.target.value,
										}))
									}
								/>
							</div>
							<div>
								<label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
									Type
								</label>
								<select
									value={formState.type}
									onChange={(event) =>
										setFormState((prev) => ({
											...prev,
											type: event.target.value as BadgeType,
										}))
									}
									className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
								>
									{badgeTypes.map((type) => (
										<option key={type.value} value={type.value}>
											{type.label}
										</option>
									))}
								</select>
							</div>
						</div>
						<div>
							<label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
								Description
							</label>
							<textarea
								value={formState.description}
								onChange={(event) =>
									setFormState((prev) => ({
										...prev,
										description: event.target.value,
									}))
								}
								rows={4}
								className={textareaClass}
								placeholder="Describe the badge criteria and purpose..."
							/>
						</div>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							<div>
								<label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
									Category
								</label>
								<select
									value={formState.category}
									onChange={(event) =>
										setFormState((prev) => ({
											...prev,
											category: event.target.value as BadgeCategory,
										}))
									}
									className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
								>
									{badgeCategories.map((category) => (
										<option key={category.value} value={category.value}>
											{category.label}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
									Rarity
								</label>
								<select
									value={formState.rarity}
									onChange={(event) =>
										setFormState((prev) => ({
											...prev,
											rarity: event.target.value as BadgeRarity,
										}))
									}
									className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
								>
									{badgeRarities.map((rarity) => (
										<option key={rarity.value} value={rarity.value}>
											{rarity.label}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
									Criteria Threshold
								</label>
								<Input
									type="number"
									min={0}
									value={formState.criteriaThreshold}
									onChange={(event) =>
										setFormState((prev) => ({
											...prev,
											criteriaThreshold: event.target.value,
										}))
									}
								/>
							</div>
						</div>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
									Criteria Type
								</label>
								<Input
									value={formState.criteriaType}
									onChange={(event) =>
										setFormState((prev) => ({
											...prev,
											criteriaType: event.target.value,
										}))
									}
									placeholder="e.g., problems_solved"
								/>
							</div>
							<div>
								<label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
									Criteria Description
								</label>
								<textarea
									value={formState.criteriaDescription}
									onChange={(event) =>
										setFormState((prev) => ({
											...prev,
											criteriaDescription: event.target.value,
										}))
									}
									rows={3}
									className={textareaClass}
									placeholder="Describe what the user must accomplish"
								/>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>Badge Holders</CardHeader>
				<CardContent className="space-y-4">
					{holdersError && (
						<p className="text-sm text-red-600 dark:text-red-400">{holdersError}</p>
					)}
					<Table
						data={holders}
						columns={holderColumns}
						loading={holdersLoading}
						error={holdersError}
						rowKey="userId"
						onRowClick={handleHolderRowClick}
						emptyMessage="No users have earned this badge yet."
					/>
					{!holdersLoading && !holdersError && holders.length > 0 && (
						<Pagination pagination={holdersPagination} paginationActions={holdersPaginationActions} />
					)}
				</CardContent>
			</Card>
		</div>
	);
}

