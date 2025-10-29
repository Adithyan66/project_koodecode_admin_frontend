import { useState, useEffect } from 'react';
import { fetchRoomDetail } from '../../api/rooms';
import type { Room } from '../../types/room';

interface UseRoomDetailResult {
	room: Room | null;
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
}

export function useRoomDetail(roomId: string | undefined): UseRoomDetailResult {
	const [room, setRoom] = useState<Room | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchRoomData = async () => {
		if (!roomId) {
			setError('Room ID is required');
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await fetchRoomDetail(roomId);
			setRoom(response.data.room);
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Failed to fetch room details');
			setRoom(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRoomData();
	}, [roomId]);

	return {
		room,
		loading,
		error,
		refetch: fetchRoomData,
	};
}

