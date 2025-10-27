import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '../../Card';
import Pagination from '../../Pagination';
import {
	ChevronDown,
	ChevronRight,
	Trophy,
	Code,
	DollarSign,
	ShoppingBag,
	Users,
	Home,
	Award,
	BarChart3,
	Loader2,
	Calendar,
	Users as UsersIcon,
	Coins,
	X
} from 'lucide-react';
import { imageKitService } from '../../../services/ImageKitService';

interface CollapsibleSectionProps {
	title: string;
	icon: React.ComponentType<{ className?: string }>;
	children: React.ReactNode;
	isLoading?: boolean;
	error?: string | null;
	onToggle?: () => void;
}

function CollapsibleSection({
	title,
	icon: Icon,
	children,
	isLoading = false,
	error = null,
	onToggle
}: CollapsibleSectionProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const handleToggle = () => {
		const wasExpanded = isExpanded;
		setIsExpanded(!isExpanded);
		// Only call onToggle when opening the section, not when closing
		if (!wasExpanded && onToggle) {
			onToggle();
		}
	};

	return (
		<Card>
			<CardHeader
				className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
				onClick={handleToggle}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
						<h3 className="text-lg font-semibold">{title}</h3>
						{isLoading && (
							<Loader2 className="h-4 w-4 animate-spin text-blue-600" />
						)}
					</div>
					{isExpanded ? (
						<ChevronDown className="h-5 w-5 text-gray-400" />
					) : (
						<ChevronRight className="h-5 w-5 text-gray-400" />
					)}
				</div>
			</CardHeader>
			{isExpanded && (
				<CardContent>
					{error ? (
						<div className="text-center py-8">
							<div className="text-red-600 dark:text-red-400 mb-2">
								Error loading data
							</div>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								{error}
							</p>
						</div>
					) : (
						children
					)}
				</CardContent>
			)}
		</Card>
	);
}

interface ExtendedDataSectionsProps {
	// Data
	contestData: any;
	submissionData: any;
	financialData: any;
	storeData: any;
	socialData: any;
	roomData: any;
	achievementData: any;
	analyticsData: any;

	// Loading states
	loadingContestData: boolean;
	loadingSubmissionData: boolean;
	loadingFinancialData: boolean;
	loadingStoreData: boolean;
	loadingSocialData: boolean;
	loadingRoomData: boolean;
	loadingAchievementData: boolean;
	loadingAnalyticsData: boolean;

	// Error states
	contestDataError: string | null;
	submissionDataError: string | null;
	financialDataError: string | null;
	storeDataError: string | null;
	socialDataError: string | null;
	roomDataError: string | null;
	achievementDataError: string | null;
	analyticsDataError: string | null;

	// Pagination
	contestPagination: {
		state: any;
		actions: any;
	};
	submissionPagination: {
		state: any;
		actions: any;
	};
	financialPagination: {
		coin: { state: any; actions: any };
		payment: { state: any; actions: any };
	};
	roomPagination: {
		state: any;
		actions: any;
	};

	// Actions
	onLoadContestData: () => void;
	onLoadSubmissionData: () => void;
	onLoadFinancialData: () => void;
	onLoadStoreData: () => void;
	onLoadSocialData: () => void;
	onLoadRoomData: () => void;
	onLoadAchievementData: () => void;
	onLoadAnalyticsData: () => void;
}

// Code Modal Component
function CodeModal({
	isOpen,
	onClose,
	sourceCode,
	language,
	problemTitle
}: {
	isOpen: boolean;
	onClose: () => void;
	sourceCode: string;
	language: string;
	problemTitle: string;
}) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
			/>

			{/* Modal Content */}
			<div className="relative z-10 mx-4 w-full max-w-4xl max-h-[90vh] rounded-lg bg-white shadow-xl dark:bg-gray-800 flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
					<div>
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
							Source Code - {problemTitle}
						</h3>
						<p className="text-sm text-gray-500 dark:text-gray-400">Language: {language}</p>
					</div>
					<button
						onClick={onClose}
						className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				{/* Code Body */}
				<div className="flex-1 overflow-auto p-4">
					<pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
						<code>{sourceCode}</code>
					</pre>
				</div>
			</div>
		</div>
	);
}

export default function ExtendedDataSections({
	contestData,
	submissionData,
	financialData,
	storeData,
	socialData,
	roomData,
	achievementData,
	analyticsData,
	loadingContestData,
	loadingSubmissionData,
	loadingFinancialData,
	loadingStoreData,
	loadingSocialData,
	loadingRoomData,
	loadingAchievementData,
	loadingAnalyticsData,
	contestDataError,
	submissionDataError,
	financialDataError,
	storeDataError,
	socialDataError,
	roomDataError,
	achievementDataError,
	analyticsDataError,
	contestPagination,
	submissionPagination,
	financialPagination,
	roomPagination,
	onLoadContestData,
	onLoadSubmissionData,
	onLoadFinancialData,
	onLoadStoreData,
	onLoadSocialData,
	onLoadRoomData,
	onLoadAchievementData,
	onLoadAnalyticsData
}: ExtendedDataSectionsProps) {
	// State for code modal
	const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

	const handleShowCode = (submission: any) => {
		setSelectedSubmission(submission);
	};

	const handleCloseCode = useCallback(() => {
		setSelectedSubmission(null);
	}, []);

	// Handle escape key for modal
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				handleCloseCode();
			}
		};

		if (selectedSubmission !== null) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [selectedSubmission, handleCloseCode]);
	const renderContestData = () => {
		if (!contestData) return <div>No contest data available</div>;

		return (
			<div className="space-y-4">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="text-center">
						<p className="text-2xl font-bold text-blue-600">{contestData.contestsParticipated}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">Contests Participated</p>
					</div>
					<div className="text-center">
						<p className="text-2xl font-bold text-green-600">{contestData.contestsWon}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">Contests Won</p>
					</div>
					<div className="text-center">
						<p className="text-2xl font-bold text-purple-600">{contestData.averageRanking}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">Average Ranking</p>
					</div>
					<div className="text-center">
						<p className="text-2xl font-bold text-orange-600">{contestData.totalContestRating}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">Total Rating</p>
					</div>
				</div>

				{contestData.contests && contestData.contests.length > 0 && (
					<div>
						<h4 className="font-semibold mb-3 text-lg">Contests</h4>
						<div className="space-y-3">
							{contestData.contests.map((contest: any, index: number) => (
								<div key={index} className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
									{/* Thumbnail */}
									{contest.contestThumbnail && (
										<img
											src={imageKitService.getContestThumbnailUrl(contest.contestThumbnail, 120, 80)}
											alt={contest.contestName}
											className="w-30 h-20 object-cover rounded-lg flex-shrink-0"
										/>
									)}

									{/* Details */}
									<div className="flex-1 min-w-0">
										<div className="flex items-start justify-between gap-4 mb-2">
											<h5 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
												{contest.contestName}
											</h5>
											{contest.rank && (
												<div className="flex items-center gap-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium flex-shrink-0">
													<Trophy className="h-3 w-3" />
													#{contest.rank}
												</div>
											)}
										</div>

										<div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
											{contest.contestDate && (
												<div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
													<Calendar className="h-3.5 w-3.5" />
													<span className="truncate">
														{new Date(contest.contestDate).toLocaleDateString()}
													</span>
												</div>
											)}

											{contest.totalParticipants !== undefined && (
												<div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
													<UsersIcon className="h-3.5 w-3.5" />
													<span>{contest.totalParticipants} participants</span>
												</div>
											)}

											{contest.ratingChange !== undefined && (
												<div className="flex items-center gap-1.5">
													<span className="text-gray-600 dark:text-gray-400">Rating:</span>
													<span className={`font-medium ${contest.ratingChange > 0
															? 'text-green-600 dark:text-green-400'
															: contest.ratingChange < 0
																? 'text-red-600 dark:text-red-400'
																: 'text-gray-600 dark:text-gray-400'
														}`}>
														{contest.ratingChange > 0 ? '+' : ''}{contest.ratingChange}
													</span>
												</div>
											)}

											{contest.coinsEarned !== undefined && (
												<div className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400">
													<Coins className="h-3.5 w-3.5" />
													<span className="font-medium">{contest.coinsEarned} coins</span>
												</div>
											)}

											{contest.participatedAt && (
												<div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
													<span className="text-xs">
														Participated: {new Date(contest.participatedAt).toLocaleDateString()}
													</span>
												</div>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
						<Pagination pagination={contestPagination.state} paginationActions={contestPagination.actions} />
					</div>
				)}
			</div>
		);
	};

	const renderSubmissionData = () => {
		if (!submissionData) return <div>No submission data available</div>;

		return (
			<div className="space-y-4">
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					<div className="text-center">
						<p className="text-2xl font-bold text-blue-600">{submissionData.totalSubmissions}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">Total Submissions</p>
					</div>
					<div className="text-center">
						<p className="text-2xl font-bold text-green-600">{submissionData.acceptedSubmissions}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">Accepted</p>
					</div>
					<div className="text-center">
						<p className="text-2xl font-bold text-red-600">{submissionData.rejectedSubmissions}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
					</div>
				</div>

				{submissionData.submissionsByLanguage && submissionData.submissionsByLanguage.length > 0 && (
					<div>
						<h4 className="font-semibold mb-2">Submissions by Language</h4>
						<div className="space-y-2">
							{submissionData.submissionsByLanguage.map((lang: any, index: number) => (
								<div key={index} className="flex justify-between items-center">
									<span className="font-medium">{lang.language}</span>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										{lang.count} ({lang.percentage.toFixed(1)}%)
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{submissionData.submissions && submissionData.submissions.length > 0 && (
					<div>
						<h4 className="font-semibold mb-2">Submissions</h4>
						<div className="space-y-3">
							{submissionData.submissions.map((submission: any, index: number) => (
								<div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
									<div className="flex items-start justify-between gap-4 mb-2">
										<div className="flex-1 min-w-0">
											<h5 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
												{submission.problemTitle}
											</h5>
											<p className="text-sm text-gray-600 dark:text-gray-400">{submission.language}</p>
										</div>
										<div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${submission.status === 'accepted'
												? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
												: submission.status === 'error'
													? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
													: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
											}`}>
											{submission.status}
										</div>
									</div>

									<div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-2 text-sm">
										<div className="flex flex-col">
											<span className="text-xs text-gray-500 dark:text-gray-400">Score</span>
											<span className="font-medium text-gray-900 dark:text-gray-100">{submission.score ?? 0}</span>
										</div>
										<div className="flex flex-col">
											<span className="text-xs text-gray-500 dark:text-gray-400">Execution Time</span>
											<span className="font-medium text-gray-900 dark:text-gray-100">{submission.totalExecutionTime ?? 0} ms</span>
										</div>
										<div className="flex flex-col">
											<span className="text-xs text-gray-500 dark:text-gray-400">Memory Usage</span>
											<span className="font-medium text-gray-900 dark:text-gray-100">{submission.maxMemoryUsage ?? 0} MB</span>
										</div>
										<div className="flex flex-col">
											<span className="text-xs text-gray-500 dark:text-gray-400">Submitted</span>
											<span className="font-medium text-gray-900 dark:text-gray-100">{new Date(submission.submittedAt).toLocaleDateString()}</span>
										</div>
										<div className="flex flex-col">
											<button
												onClick={() => handleShowCode(submission)}
												className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
											>
												<Code className="h-4 w-4" />
												View Code
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
						<Pagination pagination={submissionPagination.state} paginationActions={submissionPagination.actions} />
					</div>
				)}
			</div>
		);
	};

	const renderFinancialData = () => {
		if (!financialData) return <div>No financial data available</div>;

		return (
			<div className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="text-center">
						<p className="text-2xl font-bold text-red-600">{financialData.totalSpent}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
					</div>
					<div className="text-center">
						<p className="text-2xl font-bold text-green-600">{financialData.totalEarned}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">Total Earned</p>
					</div>
				</div>

				{financialData.coinTransactions && financialData.coinTransactions.length > 0 && (
					<div>
						<h4 className="font-semibold mb-2">Coin Transactions</h4>
						<div className="space-y-2">
							{financialData.coinTransactions.map((transaction: any, index: number) => (
								<div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
									<span className="font-medium">{transaction.description}</span>
									<div className={`text-sm font-medium ${transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
										{transaction.type === 'earn' ? '+' : '-'}{transaction.amount} coins
									</div>
								</div>
							))}
						</div>
						<Pagination pagination={financialPagination.coin.state} paginationActions={financialPagination.coin.actions} />
					</div>
				)}

				{financialData.paymentHistory && financialData.paymentHistory.length > 0 && (
					<div>
						<h4 className="font-semibold mb-2">Payment History</h4>
						<div className="space-y-2">
							{financialData.paymentHistory.map((payment: any, index: number) => (
								<div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
									<span className="font-medium">Payment {payment.paymentId}</span>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										{payment.amount} {payment.currency} - {payment.status}
									</div>
								</div>
							))}
						</div>
						<Pagination pagination={financialPagination.payment.state} paginationActions={financialPagination.payment.actions} />
					</div>
				)}
			</div>
		);
	};

	const renderStoreData = () => {
		if (!storeData) return <div>No store data available</div>;

		return (
			<div className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="text-center">
						<p className="text-2xl font-bold text-blue-600">{storeData.purchasedItems?.length || 0}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">Items Purchased</p>
					</div>
					<div className="text-center">
						<p className="text-2xl font-bold text-green-600">{storeData.inventory?.length || 0}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">Items in Inventory</p>
					</div>
				</div>

				{storeData.purchasedItems && storeData.purchasedItems.length > 0 && (
					<div>
						<h4 className="font-semibold mb-2">Recent Purchases</h4>
						<div className="space-y-2">
							{storeData.purchasedItems.slice(0, 5).map((item: any, index: number) => (
								<div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
									<span className="font-medium">{item.itemName}</span>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										{item.itemType} - ${item.purchasePrice}
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		);
	};

	const renderSocialData = () => {
		if (!socialData) return <div>No social data available</div>;

		return (
			<div className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="text-center">
						<p className="text-2xl font-bold text-blue-600">{socialData.followers}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
					</div>
					<div className="text-center">
						<p className="text-2xl font-bold text-green-600">{socialData.following}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
					</div>
				</div>

				{socialData.socialConnections && socialData.socialConnections.length > 0 && (
					<div>
						<h4 className="font-semibold mb-2">Social Connections</h4>
						<div className="space-y-2">
							{socialData.socialConnections.map((connection: any, index: number) => (
								<div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
									<span className="font-medium">{connection.platform}</span>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										@{connection.username} {connection.isVerified && '✓'}
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		);
	};

	const renderRoomData = () => {
		if (!roomData) return <div>No room data available</div>;

		return (
			<div className="space-y-4">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="text-center">
						<p className="text-2xl font-bold text-blue-600">{roomData.roomsJoined}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">Rooms Joined</p>
					</div>
					<div className="text-center">
						<p className="text-2xl font-bold text-green-600">{roomData.roomsCreated}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">Rooms Created</p>
					</div>
					<div className="text-center">
						<p className="text-2xl font-bold text-purple-600">{roomData.collaborationStats?.totalCollaborations || 0}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">Total Collaborations</p>
					</div>
					<div className="text-center">
						<p className="text-2xl font-bold text-orange-600">{roomData.collaborationStats?.successfulCollaborations || 0}</p>
						<p className="text-sm text-gray-600 dark:text-gray-400">Successful</p>
					</div>
				</div>

				{roomData.rooms && roomData.rooms.length > 0 && (
					<div>
						<h4 className="font-semibold mb-2">Rooms</h4>
						<div className="space-y-2">
							{roomData.rooms.map((room: any, index: number) => (
								<div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
									<span className="font-medium">{room.roomName}</span>
									<div className="text-sm text-gray-600 dark:text-gray-400">
										{room.role} - Joined {new Date(room.joinedAt).toLocaleDateString()}
									</div>
								</div>
							))}
						</div>
						<Pagination pagination={roomPagination.state} paginationActions={roomPagination.actions} />
					</div>
				)}
			</div>
		);
	};

	const renderAchievementData = () => {
		if (!achievementData) return <div>No achievement data available</div>;

		return (
			<div className="space-y-4">
				<div className="text-center">
					<p className="text-3xl font-bold text-yellow-600">{achievementData.totalBadges}</p>
					<p className="text-sm text-gray-600 dark:text-gray-400">Total Badges</p>
				</div>

				{achievementData.achievementProgress && achievementData.achievementProgress.length > 0 && (
					<div>
						<h4 className="font-semibold mb-2">Achievement Progress</h4>
						<div className="space-y-3">
							{achievementData.achievementProgress.map((achievement: any, index: number) => (
								<div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
									<div className="flex justify-between items-center mb-2">
										<span className="font-medium">{achievement.achievementName}</span>
										<span className="text-sm text-gray-600 dark:text-gray-400">
											{achievement.progress}/{achievement.target}
										</span>
									</div>
									<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
										<div
											className="bg-blue-600 h-2 rounded-full transition-all duration-300"
											style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
										></div>
									</div>
									<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
										{achievement.description}
									</p>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		);
	};

	const renderAnalyticsData = () => {
		if (!analyticsData) return <div>No analytics data available</div>;

		return (
			<div className="space-y-4">
				{analyticsData.problemSolvingPatterns && (
					<div>
						<h4 className="font-semibold mb-2">Problem Solving Patterns</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
								<p className="text-sm text-gray-600 dark:text-gray-400">Preferred Difficulty</p>
								<p className="font-medium">{analyticsData.problemSolvingPatterns.preferredDifficulty}</p>
							</div>
							<div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
								<p className="text-sm text-gray-600 dark:text-gray-400">Average Solve Time</p>
								<p className="font-medium">{analyticsData.problemSolvingPatterns.averageSolveTime} minutes</p>
							</div>
						</div>

						{analyticsData.problemSolvingPatterns.preferredLanguages && (
							<div className="mt-4">
								<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preferred Languages</p>
								<div className="flex flex-wrap gap-2">
									{analyticsData.problemSolvingPatterns.preferredLanguages.map((lang: string, index: number) => (
										<span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded dark:bg-blue-900 dark:text-blue-200">
											{lang}
										</span>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="space-y-4">
			<CollapsibleSection
				title="Contest Details"
				icon={Trophy}
				isLoading={loadingContestData}
				error={contestDataError}
				onToggle={onLoadContestData}
			>
				{renderContestData()}
			</CollapsibleSection>

			<CollapsibleSection
				title="Submission Details"
				icon={Code}
				isLoading={loadingSubmissionData}
				error={submissionDataError}
				onToggle={onLoadSubmissionData}
			>
				{renderSubmissionData()}
			</CollapsibleSection>

			<CollapsibleSection
				title="Financial & Payment Details"
				icon={DollarSign}
				isLoading={loadingFinancialData}
				error={financialDataError}
				onToggle={onLoadFinancialData}
			>
				{renderFinancialData()}
			</CollapsibleSection>

			<CollapsibleSection
				title="Store & Inventory Details"
				icon={ShoppingBag}
				isLoading={loadingStoreData}
				error={storeDataError}
				onToggle={onLoadStoreData}
			>
				{renderStoreData()}
			</CollapsibleSection>

			<CollapsibleSection
				title="Social Connection Data"
				icon={Users}
				isLoading={loadingSocialData}
				error={socialDataError}
				onToggle={onLoadSocialData}
			>
				{renderSocialData()}
			</CollapsibleSection>

			<CollapsibleSection
				title="Room & Collaboration Data"
				icon={Home}
				isLoading={loadingRoomData}
				error={roomDataError}
				onToggle={onLoadRoomData}
			>
				{renderRoomData()}
			</CollapsibleSection>

			<CollapsibleSection
				title="Achievements & Badge Data"
				icon={Award}
				isLoading={loadingAchievementData}
				error={achievementDataError}
				onToggle={onLoadAchievementData}
			>
				{renderAchievementData()}
			</CollapsibleSection>

			<CollapsibleSection
				title="Activity & Analytics Data"
				icon={BarChart3}
				isLoading={loadingAnalyticsData}
				error={analyticsDataError}
				onToggle={onLoadAnalyticsData}
			>
				{renderAnalyticsData()}
			</CollapsibleSection>

			{/* Code Modal */}
			<CodeModal
				isOpen={selectedSubmission !== null}
				onClose={handleCloseCode}
				sourceCode={selectedSubmission?.sourceCode || ''}
				language={selectedSubmission?.language || ''}
				problemTitle={selectedSubmission?.problemTitle || ''}
			/>
		</div>
	);
}
