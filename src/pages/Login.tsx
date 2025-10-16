import { useState } from 'react';
import type { FormEvent } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { loginRequest } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const res = await loginRequest(email, password);
			const u = res.data.user;
			if (!u.isAdmin) throw new Error('Not an admin account');
			dispatch(
				setCredentials({
					user: { id: u.id, name: u.fullName, email: u.email, role: 'admin' },
					accessToken: u.accessToken,
					refreshToken: u.refreshToken,
				}),
			);
			navigate('/dashboard', { replace: true });
		} catch (err: any) {
			setError(err?.response?.data?.message || err?.message || 'Login failed');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
			<form onSubmit={onSubmit} className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
				<h1 className="mb-4 text-xl font-semibold">Admin Login</h1>
				<div className="mb-3">
					<label className="mb-1 block text-sm">Email</label>
					<Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				</div>
				<div className="mb-4">
					<label className="mb-1 block text-sm">Password</label>
					<Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
				</div>
				{error && <div className="mb-3 rounded border border-red-300 bg-red-50 p-2 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">{error}</div>}
				<Button type="submit" disabled={loading} className="w-full">
					{loading ? 'Signing in...' : 'Sign In'}
				</Button>
			</form>
		</div>
	);
}


