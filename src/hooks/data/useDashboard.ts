import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchDashboard } from '../../api/dashboard';
import { imageKitService } from '../../services/ImageKitService';
import type { DashboardResponse } from '../../types/dashboard';

interface DashboardCharts {
	userGrowth: Array<{
		period: string;
		value: number;
	}>;
	revenueTrend: Array<{
		month: string;
		revenue: number;
	}>;
	revenueStatus: Array<{
		name: string;
		value: number;
		count: number;
	}>;
	paymentMethods: Array<{
		name: string;
		value: number;
		count: number;
	}>;
	providerShare: Array<{
		name: string;
		value: number;
	}>;
	submissionTrend: Array<{
		date: string;
		accepted: number;
		rejected: number;
		pending: number;
	}>;
	languageShare: Array<{
		name: string;
		value: number;
		percentage: number;
	}>;
	osShare: Array<{
		name: string;
		value: number;
	}>;
}

interface DashboardComputed {
	revenueGrowth: number | null;
	newUsersGrowth: number | null;
	verificationRate: number;
}

interface UseDashboardResult {
	data: DashboardResponse | null;
	loading: boolean;
	error: string | null;
	refetch: () => Promise<void>;
	charts: DashboardCharts;
	computed: DashboardComputed;
}

const EMPTY_CHARTS: DashboardCharts = {
	userGrowth: [],
	revenueTrend: [],
	revenueStatus: [],
	paymentMethods: [],
	providerShare: [],
	submissionTrend: [],
	languageShare: [],
	osShare: [],
};

export function useDashboard(): UseDashboardResult {
	const [data, setData] = useState<DashboardResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadData = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetchDashboard();
			const recentSignups = (response.users.recentSignups ?? []).map((user) => ({
				...user,
				profileImageUrl:
					user.profileImageUrl ?? (user.profilePicKey ? imageKitService.getAvatarUrl(user.profilePicKey, 64) : undefined),
			}));

			setData({
				...response,
				users: {
					...response.users,
					recentSignups,
				},
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load dashboard');
			setData(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadData();
	}, [loadData]);

	const charts = useMemo<DashboardCharts>(() => {
		if (!data) {
			return EMPTY_CHARTS;
		}

		const userGrowth = [
			{
				period: data.revenue.previousMonth.month,
				value: data.users.newUsersLastMonth,
			},
			{
				period: data.revenue.currentMonth.month,
				value: data.users.newUsersThisMonth,
			},
		];

		const revenueTrend = data.revenue.monthlyTrend.map((item) => ({
			month: item.month,
			revenue: item.revenue,
		}));

		const revenueStatus = data.revenue.statusBreakdown.map((item) => ({
			name: item.status,
			value: item.amount,
			count: item.count,
		}));

		const paymentMethods = data.revenue.paymentMethods.map((item) => ({
			name: item.method,
			value: item.amount,
			count: item.count,
		}));

		const providerShare = data.users.providers.map((item) => ({
			name: item.provider,
			value: item.count,
		}));

		const submissionTrend = data.submissions.statusTrend.map((item) => ({
			date: item.date,
			accepted: item.accepted,
			rejected: item.rejected,
			pending: item.pending,
		}));

		const languageShare = data.submissions.languageDistribution.map((item) => ({
			name: item.language,
			value: item.count,
			percentage: item.percentage,
		}));

		const osShare = data.notifications.subscribers.osDistribution.map((item) => ({
			name: item.os,
			value: item.count,
		}));

		return {
			userGrowth,
			revenueTrend,
			revenueStatus,
			paymentMethods,
			providerShare,
			submissionTrend,
			languageShare,
			osShare,
		};
	}, [data]);

	const computed = useMemo<DashboardComputed>(() => {
		if (!data) {
			return {
				revenueGrowth: null,
				newUsersGrowth: null,
				verificationRate: 0,
			};
		}

		const { currentMonth, previousMonth } = data.revenue;
		const revenueGrowth =
			previousMonth.revenue > 0
				? (currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue
				: null;

		const newUsersGrowth =
			data.users.newUsersLastMonth > 0
				? (data.users.newUsersThisMonth - data.users.newUsersLastMonth) / data.users.newUsersLastMonth
				: null;

		return {
			revenueGrowth,
			newUsersGrowth,
			verificationRate: data.users.verificationRate,
		};
	}, [data]);

	return {
		data,
		loading,
		error,
		refetch: loadData,
		charts,
		computed,
	};
}

