import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

export default function MainLayout() {
	const isSidebarOpen = useSelector((s: RootState) => s.ui.isSidebarOpen);
	return (
		<div className="flex min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
			<Sidebar />
			<div className={`flex flex-1 flex-col transition-all duration-200 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
				<Navbar />
				<main className="container-page">
					<Outlet />
				</main>
			</div>
		</div>
	);
}


