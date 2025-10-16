export interface BackendUser {
	id: string;
	fullName: string;
	userName: string;
	email: string;
	isAdmin: boolean;
	accessToken: string;
	refreshToken: string;
}

export interface LoginResponse {
	success: boolean;
	message: string;
	data: {
		user: BackendUser;
	};
}


