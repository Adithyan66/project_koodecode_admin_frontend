import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Table, { type TableColumn } from '../components/Table';
import Pagination from '../components/Pagination';
import Input from '../components/Input';
import Toggle from '../components/Toggle';
import { useBadges } from '../hooks/data/useBadges';
import type { AdminBadge, BadgeCategory, BadgeRarity, BadgeType } from '../types/badge';
import { imageKitService } from '../services/ImageKitService';

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

const formatLabel = (value: string) =>
	value
		.split('_')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');

const getBadgeIconSrc = (iconKey?: string) => {
	if (!iconKey) return '';
	if (iconKey.startsWith('http')) return iconKey;
	return imageKitService.getBadgeIconUrl(iconKey, 48);
};

export default function Badges() {
	const navigate = useNavigate();
	const {
		badges,
		loading,
		error,
		pagination,
		paginationActions,
		sortBy,
		sortOrder,
		handleSort,
		filters,
		setFilters,
		toggleBadgeStatus,
	} = useBadges();

	const columns = useMemo<TableColumn<AdminBadge>[]>(() => [
		{
			key: 'iconUrl',
			label: 'Icon',
			render: (value) => (
				<div className="flex items-center">
					{value ? (
						<img
							src={getBadgeIconSrc(value)}
							alt="Badge icon"
							className="h-10 w-10 rounded-md border border-slate-200 object-cover dark:border-slate-800"
						/>
					) : (
						<div className="flex h-10 w-10 items-center justify-center rounded-md border border-dashed border-slate-300 text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500">
							No Icon
						</div>
					)}
				</div>
			),
			className: 'w-20',
		},
		{
			key: 'name',
			label: 'Name',
			sortable: true,
			render: (value, item) => (
				<div>
					<p className="font-semibold text-slate-900 dark:text-slate-100">{value}</p>
					<p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
				</div>
			),
		},
		{
			key: 'type',
			label: 'Type',
			render: (value) => <span className="capitalize">{formatLabel(value)}</span>,
		},
		{
			key: 'category',
			label: 'Category',
			render: (value) => <span className="capitalize">{formatLabel(value)}</span>,
		},
		{
			key: 'rarity',
			label: 'Rarity',
			render: (value) => {
				const rarityStyles: Record<BadgeRarity, string> = {
					common: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
					rare: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
					epic: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
					legendary: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
				};
				return (
					<span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${rarityStyles[value as BadgeRarity]}`}>
						{formatLabel(value)}
					</span>
				);
			},
		},
		{
			key: 'isActive',
			label: 'Active',
			render: (value, item) => (
				<div
					onClick={(event) => event.stopPropagation()}
					className="flex items-center justify-center"
				>
					<Toggle
						checked={Boolean(value)}
						onChange={(event) => toggleBadgeStatus(item.id, event.target.checked)}
						aria-label={`Toggle badge ${item.name} status`}
					/>
				</div>
			),
			className: 'w-32',
		},
	], [toggleBadgeStatus]);

	const handleRowClick = (badge: AdminBadge) => {
		navigate(`/badges/${badge.id}`);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Badges</h1>
					<p className="text-slate-600 dark:text-slate-300">Manage platform badges, status, and details.</p>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-5">
				<div className="md:col-span-2">
					<label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
						Search
					</label>
					<Input
						placeholder="Search by name or description..."
						value={filters.search}
						onChange={(event) =>
							setFilters((prev) => ({
								...prev,
								search: event.target.value,
							}))
						}
					/>
				</div>
				<div className="md:col-span-1">
					<label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
						Types
					</label>
					<select
						value={filters.type}
						onChange={(event) =>
							setFilters((prev) => ({
								...prev,
								type: event.target.value as BadgeType | '',
							}))
						}
						className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
					>
						<option value="">All Types</option>
						{badgeTypes.map((type) => (
							<option key={type.value} value={type.value}>
								{type.label}
							</option>
						))}
					</select>
				</div>
				<div className="md:col-span-1">
					<label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
						Categories
					</label>
					<select
						value={filters.category}
						onChange={(event) =>
							setFilters((prev) => ({
								...prev,
								category: event.target.value as BadgeCategory | '',
							}))
						}
						className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
					>
						<option value="">All Categories</option>
						{badgeCategories.map((category) => (
							<option key={category.value} value={category.value}>
								{category.label}
							</option>
						))}
					</select>
				</div>
				<div className="md:col-span-1">
					<label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
						Rarities
					</label>
					<select
						value={filters.rarity}
						onChange={(event) =>
							setFilters((prev) => ({
								...prev,
								rarity: event.target.value as BadgeRarity | '',
							}))
						}
						className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
					>
						<option value="">All Rarities</option>
						{badgeRarities.map((rarity) => (
							<option key={rarity.value} value={rarity.value}>
								{rarity.label}
							</option>
						))}
					</select>
				</div>
				<div className="md:col-span-1 flex items-end">
					<Toggle
						label="Include inactive badges"
						checked={filters.includeInactive}
						onChange={(event) =>
							setFilters((prev) => ({
								...prev,
								includeInactive: event.target.checked,
							}))
						}
					/>
				</div>
			</div>

			<Table
				data={badges}
				columns={columns}
				loading={loading}
				error={error}
				onRowClick={handleRowClick}
				onSort={handleSort}
				sortBy={sortBy}
				sortOrder={sortOrder}
				emptyMessage="No badges found"
				rowKey="id"
			/>

			{!loading && !error && badges.length > 0 && (
				<Pagination pagination={pagination} paginationActions={paginationActions} />
			)}
		</div>
	);
}

