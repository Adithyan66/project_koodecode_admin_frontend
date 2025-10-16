import { createSlice } from '@reduxjs/toolkit';

interface UiState {
	isSidebarOpen: boolean;
}

const initialState: UiState = {
	isSidebarOpen: true,
};

const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		toggleSidebar(state) {
			state.isSidebarOpen = !state.isSidebarOpen;
		},
		setSidebar(state, { payload }: { payload: boolean }) {
			state.isSidebarOpen = payload;
		},
	},
});

export const { toggleSidebar, setSidebar } = uiSlice.actions;
export default uiSlice.reducer;


