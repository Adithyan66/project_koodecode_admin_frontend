export const RoomStatus = {
	WAITING: 'waiting',
	ACTIVE: 'active',
	INACTIVE: 'inactive',
} as const;

export type RoomStatus = (typeof RoomStatus)[keyof typeof RoomStatus];

export interface Room {
	id: string;
	roomNumber: number;
	roomId: string;
	name: string;
	thumbnail: string;
	isPrivate: boolean;
	status: RoomStatus;
	lastActivity: string;
	createdAt: string;
	participantCount: number;
	onlineParticipants: number;
	createdByUsername: string;
	createdBy: string;
}

export interface RoomsPagination {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export interface RoomsResponse {
	success: boolean;
	message: string;
	data: {
		rooms: Room[];
		pagination: RoomsPagination;
	};
}

export interface RoomsQuery {
	page?: number;
	limit?: number;
	search?: string;
	isPrivate?: boolean;
	status?: RoomStatus;
	sortBy?: 'createdAt' | 'lastActivity' | 'roomNumber';
	sortOrder?: 'asc' | 'desc';
}

export interface RoomDetailResponse {
	success: boolean;
	message: string;
	data: {
		room: Room;
		creator?: {
			id: string;
			username: string;
			email: string;
			profilePicKey?: string;
		};
	};
}

