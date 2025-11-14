import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import type { RootState } from '../redux/store';

type Props = {
	children: ReactNode;
	allowedRoles?: Array<'superadmin' | 'admin'>;
};

export default function ProtectedRoute({ children, allowedRoles = ['superadmin', 'admin'] }: Props) {
	const location = useLocation();
	const user = useSelector((s: RootState) => s.auth.user);
	const role = user?.role;
	if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
	if (!allowedRoles.includes(role!)) return <Navigate to="/dashboard" replace />;
	return <>{children}</>;
}


