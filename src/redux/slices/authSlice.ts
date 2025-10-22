import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'superadmin' | 'admin';

export interface AuthUser {
	id: string;
	name: string;
	email: string;
	role: UserRole;
}

export interface AuthState {
	token: any;
	user: AuthUser | null;
	accessToken: string | null;
	refreshToken: string | null;
}

const AUTH_KEY = 'kc-auth';

function readInitialState(): AuthState {
	try {
		const raw = localStorage.getItem(AUTH_KEY);
		if (raw) return JSON.parse(raw) as AuthState;
	} catch {
		// ignore
	}
	return { user: null, token: null, accessToken: null, refreshToken: null };
}

const initialState: AuthState = readInitialState();

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials(
			state,
			action: PayloadAction<{
				user: AuthUser;
				accessToken: string;
				refreshToken: string;
			}>,
		) {
			state.user = action.payload.user;
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
			try {
				localStorage.setItem(AUTH_KEY, JSON.stringify(state));
			} catch {}
		},
		updateTokens(
			state,
			action: PayloadAction<{
				accessToken: string;
				refreshToken: string;
			}>,
		) {
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken;
			try {
				localStorage.setItem(AUTH_KEY, JSON.stringify(state));
			} catch {}
		},
		logout(state) {
			state.user = null;
			state.token = null;
			state.accessToken = null;
			state.refreshToken = null;
			try {
				localStorage.removeItem(AUTH_KEY);
			} catch {}
		},
	},
});

export const { setCredentials, updateTokens, logout } = authSlice.actions;
export default authSlice.reducer;


