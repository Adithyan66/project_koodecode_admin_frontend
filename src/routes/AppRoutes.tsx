import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import UserDetails from '../pages/UserDetails';
import Problems from '../pages/Problems';
import ProblemDetail from '../pages/ProblemDetail';
import ProblemCreate from '../pages/ProblemCreate';
import Contests from '../pages/Contests';
import Submissions from '../pages/Submissions';
import SubmissionDetail from '../pages/SubmissionDetail';
import CoinPurchases from '../pages/CoinPurchases';
import PaymentDetails from '../pages/PaymentDetails';
import RoomsList from '../pages/RoomsList';
import RoomDetail from '../pages/RoomDetail';
import StoreManagement from '../pages/StoreManagement';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';
import Login from '../pages/Login';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';

export default function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/dashboard" replace />} />
			<Route path="/login" element={<Login />} />
			<Route
				path="/"
				element={
					<ProtectedRoute>
						<MainLayout />
					</ProtectedRoute>
				}
			>
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/users" element={<Users />} />
				<Route path="/users/:userId" element={<UserDetails />} />
				<Route path="/problems" element={<Problems />} />
				<Route path="/problems/create" element={<ProblemCreate />} />
				<Route path="/problems/:slug" element={<ProblemDetail />} />
				<Route path="/contests" element={<Contests />} />
				<Route path="/submissions" element={<Submissions />} />
				<Route path="/rooms" element={<RoomsList />} />
				<Route path="/rooms/:roomId" element={<RoomDetail />} />
				<Route path="/submissions/:submissionId" element={<SubmissionDetail />} />
				<Route path="/store" element={<StoreManagement />} />
				<Route path="/payments" element={<CoinPurchases />} />
				<Route path="/payments/:id" element={<PaymentDetails />} />
				<Route
					path="/settings"
					element={
						<ProtectedRoute allowedRoles={[ 'superadmin' ]}>
							<Settings />
						</ProtectedRoute>
					}
				/>
			</Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
