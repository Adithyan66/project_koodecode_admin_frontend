import { useParams, useNavigate } from 'react-router-dom';
import { useUserDetail } from '../hooks/data/useUserDetail';
import { 
	UserProfile, 
	UserStats, 
	UserActions, 
	UserBadges, 
	ExtendedDataSections 
} from '../components/admin/userdetails';
import { Card, CardContent } from '../components/Card';
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';

export default function UserDetails() {
	const { userId } = useParams<{ userId: string }>();
	const navigate = useNavigate();

	const {
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
		financialPagination,
		roomPagination,
		
		// Actions
		refetchUser,
		refetchContestData,
		refetchSubmissionData,
		refetchFinancialData,
		refetchStoreData,
		refetchSocialData,
		refetchRoomData,
		refetchAchievementData,
		refetchAnalyticsData,
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
	} = useUserDetail(userId!);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center">
					<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
					<p className="text-gray-600 dark:text-gray-400">Loading user details...</p>
				</div>
			</div>
		);
	}

	if (error || !user) {
		return (
			<div className="flex items-center justify-center py-12">
				<Card className="max-w-md">
					<CardContent className="flex items-center gap-3 p-6 text-red-600">
						<AlertCircle className="h-6 w-6" />
						<div>
							<h3 className="font-semibold">Error Loading User</h3>
							<p className="text-sm">{error || 'User not found'}</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<button
						onClick={() => navigate('/users')}
						className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
					>
						<ArrowLeft className="h-5 w-5" />
						Back to Users
					</button>
					<div>
						<h1 className="text-2xl font-bold">User Details</h1>
						<p className="text-slate-600 dark:text-slate-300">
							Comprehensive view of user information and activity
						</p>
					</div>
				</div>
				
				<button
					onClick={refetchAllData}
					disabled={actionLoading}
					className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					<RefreshCw className={`h-4 w-4 ${actionLoading ? 'animate-spin' : ''}`} />
					Refresh All Data
				</button>
			</div>

			{/* Main Content - Responsive Layout */}
			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
				{/* Left Column - Profile & Stats */}
				<div className="space-y-6 xl:col-span-1">
					<UserProfile user={user} />
					<UserStats user={user} />
					<UserActions
						user={user}
						onBlockUser={handleBlockUser}
						onUnblockUser={handleUnblockUser}
						onResetPassword={handleResetPassword}
						onDeleteUser={handleDeleteUser}
						onSendNotification={handleSendNotification}
						onRefresh={refetchAllData}
						actionLoading={actionLoading}
						actionError={actionError}
					/>
				</div>

				{/* Right Column - Badges & Extended Data */}
				<div className="space-y-6 xl:col-span-2">
					{user.badges && user.badges.length > 0 && (
						<UserBadges badges={user.badges} />
					)}
					
					<ExtendedDataSections
						contestData={contestData}
						submissionData={submissionData}
						financialData={financialData}
						storeData={storeData}
						socialData={socialData}
						roomData={roomData}
						achievementData={achievementData}
						analyticsData={analyticsData}
						loadingContestData={loadingContestData}
						loadingSubmissionData={loadingSubmissionData}
						loadingFinancialData={loadingFinancialData}
						loadingStoreData={loadingStoreData}
						loadingSocialData={loadingSocialData}
						loadingRoomData={loadingRoomData}
						loadingAchievementData={loadingAchievementData}
						loadingAnalyticsData={loadingAnalyticsData}
						contestDataError={contestDataError}
						submissionDataError={submissionDataError}
						financialDataError={financialDataError}
						storeDataError={storeDataError}
						socialDataError={socialDataError}
						roomDataError={roomDataError}
						achievementDataError={achievementDataError}
						analyticsDataError={analyticsDataError}
						contestPagination={contestPagination}
						submissionPagination={submissionPagination}
						financialPagination={financialPagination}
						roomPagination={roomPagination}
						onLoadContestData={refetchContestData}
						onLoadSubmissionData={refetchSubmissionData}
						onLoadFinancialData={refetchFinancialData}
						onLoadStoreData={refetchStoreData}
						onLoadSocialData={refetchSocialData}
						onLoadRoomData={refetchRoomData}
						onLoadAchievementData={refetchAchievementData}
						onLoadAnalyticsData={refetchAnalyticsData}
					/>
				</div>
			</div>
		</div>
	);
}
