import { useNavigate } from 'react-router-dom';
import Table, { type TableColumn } from '../components/Table';
import Input from '../components/Input';
import Pagination from '../components/Pagination';
import { useRooms } from '../hooks';
import type { Room } from '../types/room';
import { RoomStatus } from '../types/room';
import { imageKitService } from '../services/ImageKitService';

export default function RoomsList() {
	const navigate = useNavigate();

	const {
		rooms,
		loading,
		error,
		pagination,
		paginationActions,
		sortBy,
		sortOrder,
		handleSort,
		searchQuery,
		setSearchQuery,
		isPrivateFilter,
		setIsPrivateFilter,
		statusFilter,
		setStatusFilter,
	} = useRooms();

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const getStatusBadge = (status: RoomStatus) => {
		const statusConfig = {
			[RoomStatus.WAITING]: {
				label: 'Waiting',
				className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
			},
			[RoomStatus.ACTIVE]: {
				label: 'Active',
				className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
			},
			[RoomStatus.INACTIVE]: {
				label: 'Inactive',
				className: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
			},
		};

		const config = statusConfig[status] || statusConfig[RoomStatus.INACTIVE];

		return (
			<span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${config.className}`}>
				{config.label}
			</span>
		);
	};

	const getThumbnailUrl = (thumbnail: string) => {
		if (!thumbnail) return null;
		return imageKitService.getRoomThumbnailUrl(thumbnail, 80, 60);
	};

	const handleRowClick = (room: Room) => {
		navigate(`/rooms/${room.id}`);
	};

	const columns: TableColumn<Room>[] = [
		{
			key: 'thumbnail',
			label: 'Thumbnail',
			render: (value) =>
				value ? (
					<img
						src={getThumbnailUrl(value as string) || ''}
						alt=""
						className="h-12 w-16 rounded object-cover"
					/>
				) : (
					<div className="flex h-12 w-16 items-center justify-center rounded bg-slate-200 dark:bg-slate-800">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6 text-slate-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
							/>
						</svg>
					</div>
				),
		},
		{
			key: 'roomNumber',
			label: 'Room Info',
			sortable: true,
			render: (_, room) => (
				<div>
					<div className="font-medium">#{room.roomNumber}</div>
					<div className="text-sm text-slate-600 dark:text-slate-400">{room.name}</div>
					<div className="font-mono text-xs text-slate-500">{room.roomId}</div>
				</div>
			),
		},
		{
			key: 'createdByUsername',
			label: 'Creator',
			render: (value) => <span>{value}</span>,
		},
		{
			key: 'status',
			label: 'Status',
			render: (value) => getStatusBadge(value as RoomStatus),
		},
		{
			key: 'participantCount',
			label: 'Participants',
			render: (value) => <span className="font-medium">{value}</span>,
		},
		{
			key: 'createdAt',
			label: 'Created At',
			sortable: true,
			render: (value) => formatDate(value as string),
		},
		{
			key: 'lastActivity',
			label: 'Last Activity',
			sortable: true,
			render: (value) => formatDate(value as string),
		},
	];

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h1 className="mb-2 text-2xl font-bold">Rooms</h1>
					<p className="text-slate-600 dark:text-slate-300">View and manage all rooms.</p>
				</div>
			</div>

			<div className="mb-4">
				<Input
					type="text"
					placeholder="Search by room name, room ID, creator username, room number..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="max-w-md"
				/>
			</div>

			<div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<select
						className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
						value={isPrivateFilter}
						onChange={(e) => setIsPrivateFilter(e.target.value)}
					>
						<option value="">All Rooms</option>
						<option value="false">Public</option>
						<option value="true">Private</option>
					</select>
				</div>
				<div>
					<select
						className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-900"
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
					>
						<option value="">All Status</option>
						<option value="waiting">Waiting</option>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
				</div>
			</div>

			<Table
				data={rooms}
				columns={columns}
				loading={loading}
				error={error}
				onSort={handleSort}
				sortBy={sortBy}
				sortOrder={sortOrder}
				rowKey="id"
				onRowClick={handleRowClick}
			/>

			{!loading && !error && rooms.length > 0 && (
				<Pagination pagination={pagination} paginationActions={paginationActions} />
			)}
		</div>
	);
}

