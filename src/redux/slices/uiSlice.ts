// import { createSlice } from '@reduxjs/toolkit';

// interface UiState {
// 	isSidebarOpen: boolean;
// }

// const initialState: UiState = {
// 	isSidebarOpen: true,
// };

// const uiSlice = createSlice({
// 	name: 'ui',
// 	initialState,
// 	reducers: {
// 		toggleSidebar(state) {
// 			state.isSidebarOpen = !state.isSidebarOpen;
// 		},
// 		setSidebar(state, { payload }: { payload: boolean }) {
// 			state.isSidebarOpen = payload;
// 		},
// 	},
// });

// export const { toggleSidebar, setSidebar } = uiSlice.actions;
// export default uiSlice.reducer;



// src/redux/slices/uiSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  isSidebarOpen: boolean;
  isLoading: boolean;
  loadingMessage?: string;
}

const initialState: UiState = {
  isSidebarOpen: true,
  isLoading: false,
  loadingMessage: undefined,
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
    setLoading(state, { payload }: { payload: { isLoading: boolean; message?: string } }) {
      state.isLoading = payload.isLoading;
      state.loadingMessage = payload.message;
    },
  },
});

export const { toggleSidebar, setSidebar, setLoading } = uiSlice.actions;
export default uiSlice.reducer;
