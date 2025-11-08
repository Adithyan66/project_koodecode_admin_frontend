import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	LayoutDashboard,
	Users,
	FileCode,
	Trophy,
	FileText,
	Video,
	ShoppingCart,
	CreditCard,
	Settings,
	Menu,
} from 'lucide-react';
import type { RootState } from '../redux/store';
import { toggleSidebar } from '../redux/slices/uiSlice';
import Button from './Button';
import axiosInstance from '../api/axios';
import { logout } from '../redux/slices/authSlice';

const navItemClass = ({ isActive }: { isActive: boolean }) =>
	`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 ${
		isActive ? 'bg-slate-100 dark:bg-slate-800' : ''
	}`;

export default function Sidebar() {
	const dispatch = useDispatch();
	const isSidebarOpen = useSelector((s: RootState) => s.ui.isSidebarOpen);
	const role = useSelector((s: RootState) => s.auth.user?.role);
	const navigate = useNavigate()
	

	async function handleLogout (){
		const res = await axiosInstance.post('auth/logout')
		dispatch(logout())
		navigate('/login')
	}

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
					<Menu className="h-5 w-5" />
				</button>
			</div>
			<nav className="mt-2 space-y-1 px-2">
				<NavLink to="/dashboard" className={navItemClass}>
					<LayoutDashboard className="h-5 w-5" />
					{isSidebarOpen && <span className="truncate">Dashboard</span>}
				</NavLink>
				<NavLink to="/users" className={navItemClass}>
					<Users className="h-5 w-5" />
					{isSidebarOpen && <span className="truncate">Users</span>}
				</NavLink>
				<NavLink to="/problems" className={navItemClass}>
					<FileCode className="h-5 w-5" />
					{isSidebarOpen && <span className="truncate">Problems</span>}
				</NavLink>
				<NavLink to="/contests" className={navItemClass}>
					<Trophy className="h-5 w-5" />
					{isSidebarOpen && <span className="truncate">Contests</span>}
				</NavLink>
				<NavLink to="/submissions" className={navItemClass}>
					<FileText className="h-5 w-5" />
					{isSidebarOpen && <span className="truncate">Submissions</span>}
				</NavLink>
				<NavLink to="/rooms" className={navItemClass}>
					<Video className="h-5 w-5" />
					{isSidebarOpen && <span className="truncate">Rooms</span>}
				</NavLink>
				<NavLink to="/store" className={navItemClass}>
					<ShoppingCart className="h-5 w-5" />
					{isSidebarOpen && <span className="truncate">Store</span>}
				</NavLink>
				<NavLink to="/payments" className={navItemClass}>
					<CreditCard className="h-5 w-5" />
					{isSidebarOpen && <span className="truncate">Payments</span>}
				</NavLink>
				<button
				onClick={()=> handleLogout()}
				>Click Me</button>
				{role === 'superadmin' && (
					<NavLink to="/settings" className={navItemClass}>
						<Settings className="h-5 w-5" />
						{isSidebarOpen && <span className="truncate">Settings</span>}
					</NavLink>
				)}
			</nav>
		</aside>
	);
}
