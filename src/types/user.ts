export interface User {
	id: string;
	fullName: string;
	userName: string;
	email: string;
	createdAt: string;
	updatedAt: string;
	provider: string;
	emailVerified: boolean;
	profilePicKey?: string;
}

export interface UsersPagination {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface UsersResponse {
	success: boolean;
	message: string;
	data: {
		users: User[];
		pagination: UsersPagination;
	};
}
