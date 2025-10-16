import ThemeToggle from './ThemeToggle';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

export default function Navbar() {
	const user = useSelector((s: RootState) => s.auth.user);
	return (
		<header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900">
			<div className="font-medium">Koodecode Admin</div>
			<div className="flex items-center gap-3">
				<div className="text-sm text-slate-600 dark:text-slate-300">
					{user ? `${user.name} • ${user.role}` : 'Guest'}
				</div>
				<ThemeToggle />
			</div>
		</header>
	);
}


