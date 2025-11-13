import { useCallback, useMemo } from 'react';
import {
	ResponsiveContainer,
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	AreaChart,
	Area,
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, Activity, ShieldCheck, RefreshCw } from 'lucide-react';
import { useDashboard } from '../hooks/data/useDashboard';
import { Card, CardContent, CardHeader } from '../components/Card';
import Button from '../components/Button';
import Table, { type TableColumn } from '../components/Table';
import type { DashboardUser } from '../types/dashboard';

const PROVIDER_COLORS = ['#6366F1', '#22C55E', '#0EA5E9', '#F97316', '#F43F5E', '#8B5CF6'];
const METHOD_COLORS = ['#0EA5E9', '#6366F1', '#22C55E', '#F97316', '#F43F5E'];
const LANGUAGE_COLORS = ['#6366F1', '#22C55E', '#0EA5E9', '#F97316', '#F43F5E'];
const OS_COLORS = ['#6366F1', '#22C55E', '#0EA5E9', '#F97316', '#F43F5E', '#8B5CF6'];

function formatMonthLabel(value: string) {
	const [yearPart, monthPart] = value.split('-');
	const date = new Date(Number(yearPart), Number(monthPart) - 1);
	return new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format(date);
}

function GrowthTag({ value }: { value: number | null }) {
	if (value === null) {
		return <span className="text-xs text-slate-500">N/A</span>;
	}

	const isPositive = value >= 0;
	const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
	const color = isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';

	return (
		<span className={`flex items-center gap-1 text-xs font-medium ${color}`}>
			<Icon className="h-4 w-4" />
			{Math.abs(value * 100).toFixed(1)}%
		</span>
	);
}

function UserAvatar({ user }: { user: DashboardUser }) {
	const initials = user.fullName
		.split(' ')
		.map((part) => part.charAt(0).toUpperCase())
		.slice(0, 2)
		.join('');

	if (user.profileImageUrl) {
		return <img src={user.profileImageUrl} alt={user.fullName} className="h-10 w-10 rounded-full object-cover" />;
	}

	return (
		<span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
			{initials}
		</span>
	);
}

export default function Dashboard() {
	const { data, loading, error, refetch, charts, computed } = useDashboard();

	const currencyFormatter = useMemo(
		() =>
			new Intl.NumberFormat('en-IN', {
				style: 'currency',
				currency: data?.revenue.currency ?? 'INR',
				maximumFractionDigits: 0,
			}),
		[data?.revenue.currency],
	);

	const numberFormatter = useMemo(() => new Intl.NumberFormat('en-IN'), []);
	const dateTimeFormatter = useMemo(
		() =>
			new Intl.DateTimeFormat('en-US', {
				dateStyle: 'medium',
				timeStyle: 'short',
			}),
		[],
	);
	const dateFormatter = useMemo(
		() =>
			new Intl.DateTimeFormat('en-US', {
				dateStyle: 'medium',
			}),
		[],
	);

	const formatCurrency = useCallback((value: number) => currencyFormatter.format(value), [currencyFormatter]);
	const formatNumber = useCallback((value: number) => numberFormatter.format(value), [numberFormatter]);
	const formatDateTime = useCallback((value: string) => dateTimeFormatter.format(new Date(value)), [dateTimeFormatter]);
	const formatDate = useCallback((value: string) => dateFormatter.format(new Date(value)), [dateFormatter]);

	const recentUsersColumns: TableColumn<DashboardUser>[] = [
		{
			key: 'fullName',
			label: 'User',
			render: (_, user) => (
				<div className="flex items-center gap-3">
					<UserAvatar user={user} />
					<div>
						<div className="font-medium text-slate-900 dark:text-slate-100">{user.fullName}</div>
						<div className="text-xs text-slate-500">@{user.userName}</div>
					</div>
				</div>
			),
		},
		{
			key: 'email',
			label: 'Email',
			render: (value) => <span className="text-sm text-slate-600 dark:text-slate-300">{value}</span>,
		},
		{
			key: 'provider',
			label: 'Provider',
			render: (value) => (
				<span className="rounded-full bg-slate-100 px-2 py-1 text-xs capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-200">
					{value}
				</span>
			),
		},
		{
			key: 'createdAt',
			label: 'Joined',
			render: (value) => <span className="text-sm text-slate-500">{formatDateTime(value)}</span>,
		},
	];

	if (loading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
					<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-500" />
					<span>Loading dashboard...</span>
				</div>
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
				<p className="text-lg font-semibold text-rose-600 dark:text-rose-400">{error ?? 'Dashboard unavailable'}</p>
				<Button onClick={() => refetch()} className="flex items-center gap-2">
					<RefreshCw className="h-4 w-4" />
					Retry
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Dashboard</h1>
					<p className="text-sm text-slate-600 dark:text-slate-300">Overview of Koodecode platform health and activity.</p>
				</div>
				<Button onClick={() => refetch()} variant="secondary" className="flex items-center gap-2">
					<RefreshCw className="h-4 w-4" />
					Refresh data
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<Card>
					<CardHeader className="flex items-center justify-between">
						<span className="text-sm text-slate-500">Total users</span>
						<Users className="h-5 w-5 text-slate-400" />
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="text-3xl font-semibold text-slate-900 dark:text-white">{formatNumber(data.users.total)}</div>
						<div className="text-xs text-slate-500">All registered accounts</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex items-center justify-between">
						<span className="text-sm text-slate-500">New users this month</span>
						<Activity className="h-5 w-5 text-slate-400" />
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="text-3xl font-semibold text-slate-900 dark:text-white">
							{formatNumber(data.users.newUsersThisMonth)}
						</div>
						<GrowthTag value={computed.newUsersGrowth} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex items-center justify-between">
						<span className="text-sm text-slate-500">Revenue this month</span>
						<DollarSign className="h-5 w-5 text-slate-400" />
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="text-3xl font-semibold text-slate-900 dark:text-white">
							{formatCurrency(data.revenue.currentMonth.revenue)}
						</div>
						<GrowthTag value={computed.revenueGrowth} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex items-center justify-between">
						<span className="text-sm text-slate-500">Verification rate</span>
						<ShieldCheck className="h-5 w-5 text-slate-400" />
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="text-3xl font-semibold text-slate-900 dark:text-white">
							{(computed.verificationRate * 100).toFixed(1)}%
						</div>
						<div className="text-xs text-slate-500">Of all registered users</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 xl:grid-cols-3">
				<Card className="xl:col-span-2">
					<CardHeader>Revenue trend</CardHeader>
					<CardContent className="h-80 p-0">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={charts.revenueTrend} margin={{ left: 24, right: 24, bottom: 16 }}>
								<CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
								<XAxis
									dataKey="month"
									tickFormatter={formatMonthLabel}
									className="text-xs text-slate-500"
									tickLine={false}
								/>
								<YAxis
									tickFormatter={(value: number) => formatCurrency(value).replace(/\.00$/, '')}
									className="text-xs text-slate-500"
									tickLine={false}
								/>
								<Tooltip
									formatter={(value: number) => formatCurrency(value)}
									labelFormatter={(label: string | number) => formatMonthLabel(String(label))}
								/>
								<Legend />
								<Line
									type="monotone"
									dataKey="revenue"
									name="Revenue"
									stroke="#6366F1"
									strokeWidth={3}
									activeDot={{ r: 6 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>User acquisition</CardHeader>
					<CardContent className="space-y-6">
						<div className="h-40">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={charts.userGrowth} margin={{ left: 12, right: 12, bottom: 8 }}>
									<CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
									<XAxis
										dataKey="period"
										tickFormatter={formatMonthLabel}
										className="text-xs text-slate-500"
										tickLine={false}
									/>
									<YAxis className="text-xs text-slate-500" tickLine={false} />
									<Tooltip
										formatter={(value: number) => formatNumber(value)}
										labelFormatter={(label: string | number) => formatMonthLabel(String(label))}
									/>
									<Bar dataKey="value" name="New users" fill="#22C55E" radius={[6, 6, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</div>
						<div className="h-48">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={charts.providerShare}
										dataKey="value"
										nameKey="name"
										innerRadius={40}
										outerRadius={80}
										paddingAngle={4}
									>
										{charts.providerShare.map((entry, index) => (
											<Cell key={entry.name} fill={PROVIDER_COLORS[index % PROVIDER_COLORS.length]} />
										))}
									</Pie>
									<Tooltip formatter={(value: number) => formatNumber(value)} />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 xl:grid-cols-3">
				<Card className="xl:col-span-2">
					<CardHeader>Submission performance</CardHeader>
					<CardContent className="space-y-6">
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={charts.submissionTrend} margin={{ left: 0, right: 24, bottom: 16 }}>
									<CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
									<XAxis dataKey="date" className="text-xs text-slate-500" tickLine={false} />
									<YAxis className="text-xs text-slate-500" tickLine={false} />
									<Tooltip
										formatter={(value: number, name: string) => [formatNumber(value), name]}
										labelFormatter={(label: string | number) => formatDate(String(label))}
									/>
									<Legend />
									<Area type="monotone" dataKey="accepted" name="Accepted" stroke="#22C55E" fill="#22C55E33" />
									<Area type="monotone" dataKey="rejected" name="Rejected" stroke="#EF4444" fill="#EF444433" />
									<Area type="monotone" dataKey="pending" name="Pending" stroke="#F97316" fill="#F9731633" />
								</AreaChart>
							</ResponsiveContainer>
						</div>
						<div className="h-52">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={charts.languageShare} margin={{ left: 0, right: 24, bottom: 12 }}>
									<CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
									<XAxis dataKey="name" className="text-xs text-slate-500" tickLine={false} />
									<YAxis className="text-xs text-slate-500" tickLine={false} />
									<Tooltip formatter={(value: number) => formatNumber(value)} />
									<Bar dataKey="value" name="Submissions" radius={[6, 6, 0, 0]}>
										{charts.languageShare.map((entry, index) => (
											<Cell key={entry.name} fill={LANGUAGE_COLORS[index % LANGUAGE_COLORS.length]} />
										))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>Platform reach</CardHeader>
					<CardContent className="space-y-6">
						<div>
							<div className="text-sm font-semibold text-slate-700 dark:text-slate-200">Notification OS split</div>
							<div className="mt-2 h-48">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={charts.osShare}
											dataKey="value"
											nameKey="name"
											outerRadius={80}
											paddingAngle={4}
										>
											{charts.osShare.map((entry, index) => (
												<Cell key={entry.name} fill={OS_COLORS[index % OS_COLORS.length]} />
											))}
										</Pie>
										<Tooltip formatter={(value: number) => formatNumber(value)} />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</div>
							<div className="mt-4 text-xs text-slate-500">
								Total subscribers: {formatNumber(data.notifications.subscribers.total)} • New this month:{' '}
								{formatNumber(data.notifications.subscribers.newThisMonth)}
							</div>
						</div>
						<div>
							<div className="text-sm font-semibold text-slate-700 dark:text-slate-200">Payment methods</div>
							<div className="mt-2 flex flex-col gap-2">
								{charts.paymentMethods.map((item, index) => (
									<div key={item.name} className="flex items-center justify-between rounded-lg bg-slate-50 p-2 dark:bg-slate-900">
										<div className="flex items-center gap-2">
											<span
												className="h-2 w-2 rounded-full"
												style={{ backgroundColor: METHOD_COLORS[index % METHOD_COLORS.length] }}
											/>
											<span className="capitalize text-sm text-slate-700 dark:text-slate-200">{item.name}</span>
										</div>
										<div className="text-sm font-medium text-slate-700 dark:text-slate-100">
											{formatCurrency(item.value)}
										</div>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4">
				<Card className="xl:col-span-2">
					<CardHeader className="flex items-center justify-between">
						<span>Recent users</span>
						<span className="text-xs text-slate-500">
							Last 10 registrations • {formatNumber(data.users.newUsersThisMonth)} this month
						</span>
					</CardHeader>
					<CardContent className="p-0">
						<Table data={data.users.recentSignups} columns={recentUsersColumns} rowKey="id" className="border-0" />
					</CardContent>
				</Card>
			</div>

		</div>
	);
}
