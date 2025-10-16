import type { UserRole } from '../redux/slices/authSlice';

export function canAccess(path: string, role: UserRole): boolean {
	if (role === 'superadmin') return true;
	const adminAllowed = ['/dashboard', '/users', '/problems', '/contests'];
	return adminAllowed.includes(path);
}


