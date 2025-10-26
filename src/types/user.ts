export interface User {
	id: string;
	fullName: string;
	userName: string;
	email: string;
	createdAt: string;
	updatedAt: string;
	provider: string;
	emailVerified: boolean;
	profilePicKey?: string;
}

export interface UserDetail extends User {
	// Extended Profile Info
	googleId?: string;
	githubId?: string;
	bio?: string;
	location?: string;
	birthdate?: string;
	gender?: string;
	githubUrl?: string;
	linkedinUrl?: string;
	
	// Performance Metrics
	ranking?: number;
	acceptanceRate?: number;
	contestRating?: number;
	coinBalance?: number;
	totalProblems?: number;
	easyProblems?: number;
	mediumProblems?: number;
	hardProblems?: number;
	activeDays?: number;
	
	// Status
	isBlocked?: boolean;
	lastLogin?: string;
	
	// Streak Data
	streak?: {
		currentCount: number;
		maxCount: number;
		lastActiveDate: string;
	};
	
	// Badges
	badges?: Badge[];
}

export interface Badge {
	badgeId: string;
	badgeType: string;
	name: string;
	description: string;
	iconUrl: string;
	awardedAt: string;
	criteria: {
		type: string;
		threshold: number;
		description: string;
		metadata?: Record<string, any>;
	};
}

export interface UserDetailResponse {
	success: boolean;
	message: string;
	data: UserDetail;
}

export interface UserContestData {
	contestsParticipated: number;
	contestsWon: number;
	averageRanking: number;
	totalContestRating: number;
	contests: Array<{
		contestId: string;
		contestName: string;
		contestThumbnail?: string;
		totalParticipants?: number;
		rank: number;
		ratingChange: number;
		participatedAt: string;
		contestDate?: string;
		coinsEarned?: number;
	}>;
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export interface UserSubmissionData {
	totalSubmissions: number;
	acceptedSubmissions: number;
	rejectedSubmissions: number;
	submissionsByLanguage: Array<{
		language: string;
		count: number;
		percentage: number;
	}>;
	submissions: Array<{
		submissionId: string;
		problemTitle: string;
		language: string;
		status: string;
		submittedAt: string;
	}>;
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export interface UserFinancialData {
	totalSpent: number;
	totalEarned: number;
	coinTransactions: Array<{
		transactionId: string;
		type: 'earn' | 'spend';
		amount: number;
		description: string;
		createdAt: string;
	}>;
	coinTransactionsPagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
	paymentHistory: Array<{
		paymentId: string;
		amount: number;
		currency: string;
		status: string;
		createdAt: string;
	}>;
	paymentHistoryPagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

export interface UserStoreData {
	purchasedItems: Array<{
		itemId: string;
		itemName: string;
		itemType: string;
		purchasePrice: number;
		purchasedAt: string;
	}>;
	inventory: Array<{
		itemId: string;
		itemName: string;
		quantity: number;
		acquiredAt: string;
	}>;
}

export interface UserSocialData {
	followers: number;
	following: number;
	socialConnections: Array<{
		platform: string;
		username: string;
		connectedAt: string;
		isVerified: boolean;
	}>;
}

export interface UserRoomData {
	roomsJoined: number;
	roomsCreated: number;
	rooms: Array<{
		roomId: string;
		roomName: string;
		role: string;
		joinedAt: string;
	}>;
	roomsPagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
	collaborationStats: {
		totalCollaborations: number;
		successfulCollaborations: number;
		averageSessionDuration: number;
	};
}

export interface UserAchievementData {
	totalBadges: number;
	recentBadges: Badge[];
	achievementProgress: Array<{
		achievementId: string;
		achievementName: string;
		progress: number;
		target: number;
		description: string;
	}>;
}

export interface UserAnalyticsData {
	loginFrequency: Array<{
		date: string;
		logins: number;
	}>;
	activityHeatmap: Array<{
		hour: number;
		day: string;
		activity: number;
	}>;
	problemSolvingPatterns: {
		preferredDifficulty: string;
		preferredLanguages: string[];
		averageSolveTime: number;
		peakActivityHours: number[];
	};
}

export interface UsersPagination {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface UsersResponse {
	success: boolean;
	message: string;
	data: {
		users: User[];
		pagination: UsersPagination;
	};
}
