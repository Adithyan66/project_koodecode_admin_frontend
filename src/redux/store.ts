import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/authSlice';
import theme from './slices/themeSlice';
import ui from './slices/uiSlice';

export const store = configureStore({
	reducer: { auth, theme, ui },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


