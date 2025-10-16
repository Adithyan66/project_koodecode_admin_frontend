import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { setTheme, toggleTheme } from '../redux/slices/themeSlice';

const THEME_KEY = 'kc-theme';

export default function ThemeToggle() {
	const dispatch = useDispatch();
	const mode = useSelector((s: RootState) => s.theme.mode);

	useEffect(() => {
		const saved = (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light';
		dispatch(setTheme(saved));
	}, [dispatch]);

	useEffect(() => {
		const root = document.documentElement;
		root.classList.toggle('dark', mode === 'dark');
		localStorage.setItem(THEME_KEY, mode);
	}, [mode]);

	return (
		<button
			className="rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
			onClick={() => dispatch(toggleTheme())}
		>
			{mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
		</button>
	);
}


