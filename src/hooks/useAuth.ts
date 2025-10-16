import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export function useAuth() {
	const user = useSelector((s: RootState) => s.auth.user);
	const token = useSelector((s: RootState) => s.auth.token);
	return { user, token, isAuthenticated: Boolean(user && token) };
}


