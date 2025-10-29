import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, XCircle } from 'lucide-react';
import { Card, CardContent } from '../components/Card';
import { useRoomDetail } from '../hooks';
import { RoomInfoCard, CreatorInfoCard, ParticipantStatsCard } from '../components/admin/roomdetails';

export default function RoomDetail() {
	const { roomId } = useParams<{ roomId: string }>();
	const navigate = useNavigate();
	const { room, loading, error, refetch } = useRoomDetail(roomId);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center">
					<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
					<p className="text-gray-600 dark:text-gray-400">Loading room details...</p>
				</div>
			</div>
		);
	}

	if (error || !room) {
		return (
			<div className="flex items-center justify-center py-12">
				<Card className="max-w-md">
					<CardContent className="flex items-center gap-3 p-6 text-red-600">
						<XCircle className="h-6 w-6" />
						<div>
							<h3 className="font-semibold">Error Loading Room</h3>
							<p className="text-sm">{error || 'Room not found'}</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button
						onClick={() => navigate('/rooms')}
						className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
					>
						<ArrowLeft className="h-5 w-5" />
						Back to Rooms
					</button>
					<div>
						<h1 className="text-2xl font-bold">Room Details</h1>
						<p className="text-slate-600 dark:text-slate-300">Room ID: {room.id}</p>
					</div>
				</div>

				<button
					onClick={refetch}
					disabled={loading}
					className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
				>
					<RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
					Refresh
				</button>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<RoomInfoCard room={room} />
				</div>
				<div>
					<CreatorInfoCard createdBy={room.createdBy} createdByUsername={room.createdByUsername} />
					<ParticipantStatsCard
						participantCount={room.participantCount}
						onlineParticipants={room.onlineParticipants}
					/>
				</div>
			</div>
		</div>
	);
}

