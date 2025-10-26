import { useState, useEffect } from 'react';
import {
	fetchUserDetail,
	fetchUserContestData,
	fetchUserSubmissionData,
	fetchUserFinancialData,
	fetchUserStoreData,
	fetchUserSocialData,
	fetchUserRoomData,
	fetchUserAchievementData,
	fetchUserAnalyticsData,
	blockUser,
	unblockUser,
	resetUserPassword,
	deleteUserAccount,
	sendUserNotification
} from '../../api/users';
import type {
	UserDetail,
	UserContestData,
	UserSubmissionData,
	UserFinancialData,
	UserStoreData,
	UserSocialData,
	UserRoomData,
	UserAchievementData,
	UserAnalyticsData
} from '../../types/user';
import { usePagination } from '../utils/usePagination';

interface UseUserDetailResult {
	// Main user data
	user: UserDetail | null;
	loading: boolean;
	error: string | null;
	
	// Extended data
	contestData: UserContestData | null;
	submissionData: UserSubmissionData | null;
	financialData: UserFinancialData | null;
	storeData: UserStoreData | null;
	socialData: UserSocialData | null;
	roomData: UserRoomData | null;
	achievementData: UserAchievementData | null;
	analyticsData: UserAnalyticsData | null;
	
	// Loading states for extended data
	loadingContestData: boolean;
	loadingSubmissionData: boolean;
	loadingFinancialData: boolean;
	loadingStoreData: boolean;
	loadingSocialData: boolean;
	loadingRoomData: boolean;
	loadingAchievementData: boolean;
	loadingAnalyticsData: boolean;
	
	// Error states for extended data
	contestDataError: string | null;
	submissionDataError: string | null;
	financialDataError: string | null;
	storeDataError: string | null;
	socialDataError: string | null;
	roomDataError: string | null;
	achievementDataError: string | null;
	analyticsDataError: string | null;
	
	// Pagination for extended data
	contestPagination: ReturnType<typeof usePagination>;
	submissionPagination: ReturnType<typeof usePagination>;
	financialPagination: {
		coin: ReturnType<typeof usePagination>;
		payment: ReturnType<typeof usePagination>;
	};
	roomPagination: ReturnType<typeof usePagination>;
	
	// Actions
	refetchUser: () => Promise<void>;
	refetchContestData: () => Promise<void>;
	refetchSubmissionData: () => Promise<void>;
	refetchFinancialData: () => Promise<void>;
	refetchStoreData: () => Promise<void>;
	refetchSocialData: () => Promise<void>;
	refetchRoomData: () => Promise<void>;
	refetchAchievementData: () => Promise<void>;
	refetchAnalyticsData: () => Promise<void>;
	refetchAllData: () => Promise<void>;
	
	// Admin actions
	handleBlockUser: () => Promise<void>;
	handleUnblockUser: () => Promise<void>;
	handleResetPassword: () => Promise<void>;
	handleDeleteUser: () => Promise<void>;
	handleSendNotification: (message: string) => Promise<void>;
	
	// Action states
	actionLoading: boolean;
	actionError: string | null;
}

export function useUserDetail(userId: string): UseUserDetailResult {
	// Main user data state
	const [user, setUser] = useState<UserDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	
	// Extended data states
	const [contestData, setContestData] = useState<UserContestData | null>(null);
	const [submissionData, setSubmissionData] = useState<UserSubmissionData | null>(null);
	const [financialData, setFinancialData] = useState<UserFinancialData | null>(null);
	const [storeData, setStoreData] = useState<UserStoreData | null>(null);
	const [socialData, setSocialData] = useState<UserSocialData | null>(null);
	const [roomData, setRoomData] = useState<UserRoomData | null>(null);
	const [achievementData, setAchievementData] = useState<UserAchievementData | null>(null);
	const [analyticsData, setAnalyticsData] = useState<UserAnalyticsData | null>(null);
	
	// Loading states for extended data
	const [loadingContestData, setLoadingContestData] = useState(false);
	const [loadingSubmissionData, setLoadingSubmissionData] = useState(false);
	const [loadingFinancialData, setLoadingFinancialData] = useState(false);
	const [loadingStoreData, setLoadingStoreData] = useState(false);
	const [loadingSocialData, setLoadingSocialData] = useState(false);
	const [loadingRoomData, setLoadingRoomData] = useState(false);
	const [loadingAchievementData, setLoadingAchievementData] = useState(false);
	const [loadingAnalyticsData, setLoadingAnalyticsData] = useState(false);
	
	// Error states for extended data
	const [contestDataError, setContestDataError] = useState<string | null>(null);
	const [submissionDataError, setSubmissionDataError] = useState<string | null>(null);
	const [financialDataError, setFinancialDataError] = useState<string | null>(null);
	const [storeDataError, setStoreDataError] = useState<string | null>(null);
	const [socialDataError, setSocialDataError] = useState<string | null>(null);
	const [roomDataError, setRoomDataError] = useState<string | null>(null);
	const [achievementDataError, setAchievementDataError] = useState<string | null>(null);
	const [analyticsDataError, setAnalyticsDataError] = useState<string | null>(null);
	
	// Action states
	const [actionLoading, setActionLoading] = useState(false);
	const [actionError, setActionError] = useState<string | null>(null);
	
	// Pagination hooks
	const contestPagination = usePagination({ initialPage: 1, initialLimit: 10 });
	const submissionPagination = usePagination({ initialPage: 1, initialLimit: 10 });
	const coinPagination = usePagination({ initialPage: 1, initialLimit: 10 });
	const paymentPagination = usePagination({ initialPage: 1, initialLimit: 10 });
	const roomPagination = usePagination({ initialPage: 1, initialLimit: 10 });
	
	// Fetch main user data
	const fetchUserData = async () => {
		setLoading(true);
		setError(null);
		
		try {
			const response = await fetchUserDetail(userId);
			setUser(response.data);
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Failed to fetch user details');
			setUser(null);
		} finally {
			setLoading(false);
		}
	};
	
	// Fetch extended data functions
	const fetchContestData = async () => {
		setLoadingContestData(true);
		setContestDataError(null);
		
		try {
			const response = await fetchUserContestData(userId, {
				page: contestPagination.state.page,
				limit: contestPagination.state.limit
			});
			setContestData(response.data);
		} catch (err: any) {
			setContestDataError(err?.response?.data?.message || 'Failed to fetch contest data');
		} finally {
			setLoadingContestData(false);
		}
	};
	
	const fetchSubmissionData = async () => {
		setLoadingSubmissionData(true);
		setSubmissionDataError(null);
		
		try {
			const response = await fetchUserSubmissionData(userId, {
				page: submissionPagination.state.page,
				limit: submissionPagination.state.limit
			});
			setSubmissionData(response.data);
		} catch (err: any) {
			setSubmissionDataError(err?.response?.data?.message || 'Failed to fetch submission data');
		} finally {
			setLoadingSubmissionData(false);
		}
	};
	
	const fetchFinancialData = async () => {
		setLoadingFinancialData(true);
		setFinancialDataError(null);
		
		try {
			const response = await fetchUserFinancialData(userId, {
				coinPage: coinPagination.state.page,
				coinLimit: coinPagination.state.limit,
				paymentPage: paymentPagination.state.page,
				paymentLimit: paymentPagination.state.limit
			});
			setFinancialData(response.data);
		} catch (err: any) {
			setFinancialDataError(err?.response?.data?.message || 'Failed to fetch financial data');
		} finally {
			setLoadingFinancialData(false);
		}
	};
	
	const fetchStoreData = async () => {
		setLoadingStoreData(true);
		setStoreDataError(null);
		
		try {
			const response = await fetchUserStoreData(userId);
			setStoreData(response.data);
		} catch (err: any) {
			setStoreDataError(err?.response?.data?.message || 'Failed to fetch store data');
		} finally {
			setLoadingStoreData(false);
		}
	};
	
	const fetchSocialData = async () => {
		setLoadingSocialData(true);
		setSocialDataError(null);
		
		try {
			const response = await fetchUserSocialData(userId);
			setSocialData(response.data);
		} catch (err: any) {
			setSocialDataError(err?.response?.data?.message || 'Failed to fetch social data');
		} finally {
			setLoadingSocialData(false);
		}
	};
	
	const fetchRoomData = async () => {
		setLoadingRoomData(true);
		setRoomDataError(null);
		
		try {
			const response = await fetchUserRoomData(userId, {
				page: roomPagination.state.page,
				limit: roomPagination.state.limit
			});
			setRoomData(response.data);
		} catch (err: any) {
			setRoomDataError(err?.response?.data?.message || 'Failed to fetch room data');
		} finally {
			setLoadingRoomData(false);
		}
	};
	
	const fetchAchievementData = async () => {
		setLoadingAchievementData(true);
		setAchievementDataError(null);
		
		try {
			const response = await fetchUserAchievementData(userId);
			setAchievementData(response.data);
		} catch (err: any) {
			setAchievementDataError(err?.response?.data?.message || 'Failed to fetch achievement data');
		} finally {
			setLoadingAchievementData(false);
		}
	};
	
	const fetchAnalyticsData = async () => {
		setLoadingAnalyticsData(true);
		setAnalyticsDataError(null);
		
		try {
			const response = await fetchUserAnalyticsData(userId);
			setAnalyticsData(response.data);
		} catch (err: any) {
			setAnalyticsDataError(err?.response?.data?.message || 'Failed to fetch analytics data');
		} finally {
			setLoadingAnalyticsData(false);
		}
	};
	
	// Admin action functions
	const handleBlockUser = async () => {
		setActionLoading(true);
		setActionError(null);
		
		try {
			await blockUser(userId );
			await fetchUserData(); 
		} catch (err: any) {
			setActionError(err?.response?.data?.message || 'Failed to block user');
		} finally {
			setActionLoading(false);
		}
	};
	
	const handleUnblockUser = async () => {
		setActionLoading(true);
		setActionError(null);
		
		try {
			await unblockUser(userId);
			await fetchUserData(); 
		} catch (err: any) {
			setActionError(err?.response?.data?.message || 'Failed to unblock user');
		} finally {
			setActionLoading(false);
		}
	};
	
	const handleResetPassword = async () => {
		setActionLoading(true);
		setActionError(null);
		
		try {
			await resetUserPassword(userId);
		} catch (err: any) {
			setActionError(err?.response?.data?.message || 'Failed to reset password');
		} finally {
			setActionLoading(false);
		}
	};
	
	const handleDeleteUser = async () => {
		setActionLoading(true);
		setActionError(null);
		
		try {
			await deleteUserAccount(userId);
		} catch (err: any) {
			setActionError(err?.response?.data?.message || 'Failed to delete user');
		} finally {
			setActionLoading(false);
		}
	};
	
	const handleSendNotification = async (message: string) => {
		setActionLoading(true);
		setActionError(null);
		
		try {
			await sendUserNotification(userId, message);
		} catch (err: any) {
			setActionError(err?.response?.data?.message || 'Failed to send notification');
		} finally {
			setActionLoading(false);
		}
	};
	
	// Refetch all data
	const refetchAllData = async () => {
		await Promise.all([
			fetchUserData(),
			fetchContestData(),
			fetchSubmissionData(),
			fetchFinancialData(),
			fetchStoreData(),
			fetchSocialData(),
			fetchRoomData(),
			fetchAchievementData(),
			fetchAnalyticsData()
		]);
	};
	
	// Load main user data on mount
	useEffect(() => {
		if (userId) {
			fetchUserData();
		}
	}, [userId]);
	
	// Refetch data when pagination changes
	useEffect(() => {
		if (contestData !== null) {
			fetchContestData();
		}
	}, [contestPagination.state.page, contestPagination.state.limit]);
	
	useEffect(() => {
		if (submissionData !== null) {
			fetchSubmissionData();
		}
	}, [submissionPagination.state.page, submissionPagination.state.limit]);
	
	useEffect(() => {
		if (financialData !== null) {
			fetchFinancialData();
		}
	}, [coinPagination.state.page, coinPagination.state.limit, paymentPagination.state.page, paymentPagination.state.limit]);
	
	useEffect(() => {
		if (roomData !== null) {
			fetchRoomData();
		}
	}, [roomPagination.state.page, roomPagination.state.limit]);
	
	return {
		// Main user data
		user,
		loading,
		error,
		
		// Extended data
		contestData,
		submissionData,
		financialData,
		storeData,
		socialData,
		roomData,
		achievementData,
		analyticsData,
		
		// Loading states
		loadingContestData,
		loadingSubmissionData,
		loadingFinancialData,
		loadingStoreData,
		loadingSocialData,
		loadingRoomData,
		loadingAchievementData,
		loadingAnalyticsData,
		
		// Error states
		contestDataError,
		submissionDataError,
		financialDataError,
		storeDataError,
		socialDataError,
		roomDataError,
		achievementDataError,
		analyticsDataError,
		
		// Pagination
		contestPagination,
		submissionPagination,
		financialPagination: {
			coin: coinPagination,
			payment: paymentPagination
		},
		roomPagination,
		
		// Actions
		refetchUser: fetchUserData,
		refetchContestData: fetchContestData,
		refetchSubmissionData: fetchSubmissionData,
		refetchFinancialData: fetchFinancialData,
		refetchStoreData: fetchStoreData,
		refetchSocialData: fetchSocialData,
		refetchRoomData: fetchRoomData,
		refetchAchievementData: fetchAchievementData,
		refetchAnalyticsData: fetchAnalyticsData,
		refetchAllData,
		
		// Admin actions
		handleBlockUser,
		handleUnblockUser,
		handleResetPassword,
		handleDeleteUser,
		handleSendNotification,
		
		// Action states
		actionLoading,
		actionError
	};
}
