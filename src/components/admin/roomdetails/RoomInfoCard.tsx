import { Card, CardContent } from '../../Card';
import { imageKitService } from '../../../services/ImageKitService';
import type { Room } from '../../../types/room';
import { RoomStatus } from '../../../types/room';

interface RoomInfoCardProps {
	room: Room;
}

export function RoomInfoCard({ room }: RoomInfoCardProps) {
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

	const getThumbnailUrl = () => {
		if (!room.thumbnail) {
			return null;
		}
		return imageKitService.getRoomThumbnailUrl(room.thumbnail, 300, 200);
	};

	return (
		<Card>
			<CardContent className="p-6">
				<div className="flex gap-6">
					<div className="flex-shrink-0">
						{room.thumbnail ? (
							<img
								src={getThumbnailUrl() || ''}
								alt={room.name}
								className="h-32 w-48 rounded-lg object-cover"
							/>
						) : (
							<div className="flex h-32 w-48 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-12 w-12 text-slate-400"
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
						)}
					</div>
					<div className="flex-1">
						<div className="mb-4">
							<h2 className="text-2xl font-bold">{room.name}</h2>
							<p className="text-sm text-slate-600 dark:text-slate-400">Room #{room.roomNumber}</p>
						</div>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span className="font-medium text-slate-600 dark:text-slate-400">Room ID:</span>
								<p className="font-mono text-sm">{room.roomId}</p>
							</div>
							<div>
								<span className="font-medium text-slate-600 dark:text-slate-400">Status:</span>
								<div className="mt-1">{getStatusBadge(room.status)}</div>
							</div>
							<div>
								<span className="font-medium text-slate-600 dark:text-slate-400">Privacy:</span>
								<p className="capitalize">{room.isPrivate ? 'Private' : 'Public'}</p>
							</div>
							<div>
								<span className="font-medium text-slate-600 dark:text-slate-400">Participants:</span>
								<p>{room.participantCount}</p>
							</div>
							<div>
								<span className="font-medium text-slate-600 dark:text-slate-400">Created:</span>
								<p>{formatDate(room.createdAt)}</p>
							</div>
							<div>
								<span className="font-medium text-slate-600 dark:text-slate-400">Last Activity:</span>
								<p>{formatDate(room.lastActivity)}</p>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

