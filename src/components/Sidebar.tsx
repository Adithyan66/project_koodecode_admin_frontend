import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { toggleSidebar } from '../redux/slices/uiSlice';

const navItemClass = ({ isActive }: { isActive: boolean }) =>
	`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 ${
		isActive ? 'bg-slate-100 dark:bg-slate-800' : ''
	}`;

export default function Sidebar() {
	const dispatch = useDispatch();
	const isSidebarOpen = useSelector((s: RootState) => s.ui.isSidebarOpen);
	const role = useSelector((s: RootState) => s.auth.user?.role);

	return (
		<aside
			className={`fixed left-0 top-0 z-40 h-screen border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-all duration-200 ${
				isSidebarOpen ? 'w-64' : 'w-16'
			}`}
		>
			<div className="flex items-center justify-between px-3 py-4">
				<div className="text-lg font-semibold">KC</div>
				<button
					className="rounded p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
					onClick={() => dispatch(toggleSidebar())}
					aria-label="Toggle sidebar"
				>
					☰
				</button>
			</div>
			<nav className="mt-2 space-y-1 px-2">
				<NavLink to="/dashboard" className={navItemClass}>
					<span className="truncate">Dashboard</span>
				</NavLink>
				<NavLink to="/users" className={navItemClass}>
					<span className="truncate">Users</span>
				</NavLink>
				<NavLink to="/problems" className={navItemClass}>
					<span className="truncate">Problems</span>
				</NavLink>
				<NavLink to="/contests" className={navItemClass}>
					<span className="truncate">Contests</span>
				</NavLink>
				{role === 'superadmin' && (
					<NavLink to="/settings" className={navItemClass}>
						<span className="truncate">Settings</span>
					</NavLink>
				)}
			</nav>
		</aside>
	);
}


